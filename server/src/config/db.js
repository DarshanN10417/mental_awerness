import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindsprint';
  
  try {
    console.log('Attempting to connect to MongoDB...');
    // Set low timeout for quick fallback
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000, 
      connectTimeoutMS: 2000
    });
    console.log('MongoDB Connected Successfully.');
    process.env.USE_MEMORY_DB = 'false';
  } catch (err) {
    console.error('--- WARNING: DATABASE FALLBACK ENABLED ---');
    console.error(`MongoDB connection failed: ${err.message}`);
    console.error('MindSprint AI will run in IN-MEMORY database mode.');
    console.error('Data will persist in-memory while the server is running.');
    console.error('------------------------------------------');
    process.env.USE_MEMORY_DB = 'true';
  }
};

// Generic memory store provider
const memoryStores = {};

export const getMemoryStore = (modelName) => {
  if (!memoryStores[modelName]) {
    memoryStores[modelName] = [];
  }
  return memoryStores[modelName];
};

// Resilient wrapper utility to create mock/real transparent Mongo query objects
export const makeResilientModel = (modelName, mongooseModel) => {
  const store = getMemoryStore(modelName);

  return {
    // Save or insert data
    create: async (data) => {
      if (process.env.USE_MEMORY_DB === 'true') {
        const id = new mongoose.Types.ObjectId().toString();
        const record = { 
          _id: id, 
          id: id,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data 
        };
        // Add instance helper methods like save()
        record.save = async function() {
          const idx = store.findIndex(item => item._id === this._id);
          this.updatedAt = new Date();
          if (idx !== -1) store[idx] = this;
          return this;
        };
        store.push(record);
        return record;
      }
      return mongooseModel.create(data);
    },

    // Find multiple
    find: async (query = {}) => {
      if (process.env.USE_MEMORY_DB === 'true') {
        // Simple query matching filter
        return store.filter(item => {
          for (let key in query) {
            let val = query[key];
            // Handle simple direct matches or userId/ObjectId conversions
            if (val && typeof val === 'object' && val.toString) val = val.toString();
            let itemVal = item[key];
            if (itemVal && typeof itemVal === 'object' && itemVal.toString) itemVal = itemVal.toString();
            
            if (itemVal !== val) return false;
          }
          return true;
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      return mongooseModel.find(query).sort({ createdAt: -1 });
    },

    // Find one match
    findOne: async (query = {}) => {
      if (process.env.USE_MEMORY_DB === 'true') {
        const matches = await store.filter(item => {
          for (let key in query) {
            let val = query[key];
            if (val && typeof val === 'object' && val.toString) val = val.toString();
            let itemVal = item[key];
            if (itemVal && typeof itemVal === 'object' && itemVal.toString) itemVal = itemVal.toString();
            if (itemVal !== val) return false;
          }
          return true;
        });
        return matches.length > 0 ? matches[0] : null;
      }
      return mongooseModel.findOne(query);
    },

    // Find by ID
    findById: async (id) => {
      const idStr = id ? id.toString() : '';
      if (process.env.USE_MEMORY_DB === 'true') {
        const item = store.find(item => item._id === idStr || item.id === idStr);
        if (!item) return null;
        if (!item.save) {
          item.save = async function() {
            const idx = store.findIndex(x => x._id === this._id);
            this.updatedAt = new Date();
            if (idx !== -1) store[idx] = this;
            return this;
          };
        }
        return item;
      }
      return mongooseModel.findById(id);
    },

    // Find and update
    findByIdAndUpdate: async (id, update, options = {}) => {
      const idStr = id ? id.toString() : '';
      if (process.env.USE_MEMORY_DB === 'true') {
        const idx = store.findIndex(item => item._id === idStr || item.id === idStr);
        if (idx === -1) return null;
        const current = store[idx];
        const updated = {
          ...current,
          ...update,
          updatedAt: new Date()
        };
        store[idx] = updated;
        return updated;
      }
      return mongooseModel.findByIdAndUpdate(id, update, { new: true, ...options });
    },

    // Get count
    countDocuments: async (query = {}) => {
      if (process.env.USE_MEMORY_DB === 'true') {
        const list = await store.filter(item => {
          for (let key in query) {
            if (item[key] !== query[key]) return false;
          }
          return true;
        });
        return list.length;
      }
      return mongooseModel.countDocuments(query);
    },

    // Delete many
    deleteMany: async (query = {}) => {
      if (process.env.USE_MEMORY_DB === 'true') {
        const originalLength = store.length;
        // Keep elements that DON'T match query
        const filtered = store.filter(item => {
          for (let key in query) {
            if (item[key] === query[key]) return false;
          }
          return true;
        });
        store.length = 0;
        store.push(...filtered);
        return { deletedCount: originalLength - filtered.length };
      }
      return mongooseModel.deleteMany(query);
    },

    // Access raw store/model directly
    rawModel: mongooseModel,
    getStore: () => store
  };
};
