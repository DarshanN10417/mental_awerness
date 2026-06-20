import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'mindsprint_super_secret_jwt_key_123!';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, examType, examDate, supportStyle, dailyStudyHours, sleepHours, baselineStress, emergencyContact } = req.body;

    if (!name || !email || !password || !examDate) {
      return res.status(400).json({ message: 'Please provide all required fields (name, email, password, examDate).' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      examType: examType || 'custom',
      examDate: new Date(examDate),
      supportStyle: supportStyle || 'calm mentor',
      dailyStudyHours: Number(dailyStudyHours) || 8,
      sleepHours: Number(sleepHours) || 7,
      baselineStress: Number(baselineStress) || 5,
      emergencyContact: emergencyContact || ''
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        examType: user.examType,
        examDate: user.examDate,
        supportStyle: user.supportStyle,
        dailyStudyHours: user.dailyStudyHours,
        sleepHours: user.sleepHours,
        baselineStress: user.baselineStress,
        emergencyContact: user.emergencyContact
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. User does not exist.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        examType: user.examType,
        examDate: user.examDate,
        supportStyle: user.supportStyle,
        dailyStudyHours: user.dailyStudyHours,
        sleepHours: user.sleepHours,
        baselineStress: user.baselineStress,
        emergencyContact: user.emergencyContact
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        examType: req.user.examType,
        examDate: req.user.examDate,
        supportStyle: req.user.supportStyle,
        dailyStudyHours: req.user.dailyStudyHours,
        sleepHours: req.user.sleepHours,
        baselineStress: req.user.baselineStress,
        emergencyContact: req.user.emergencyContact
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile settings
// @route   PUT /api/users/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, examType, examDate, supportStyle, dailyStudyHours, sleepHours, baselineStress, emergencyContact } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        examType: examType || user.examType,
        examDate: examDate ? new Date(examDate) : user.examDate,
        supportStyle: supportStyle || user.supportStyle,
        dailyStudyHours: dailyStudyHours !== undefined ? Number(dailyStudyHours) : user.dailyStudyHours,
        sleepHours: sleepHours !== undefined ? Number(sleepHours) : user.sleepHours,
        baselineStress: baselineStress !== undefined ? Number(baselineStress) : user.baselineStress,
        emergencyContact: emergencyContact !== undefined ? emergencyContact : user.emergencyContact
      },
      { new: true }
    );

    res.json({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        examType: updatedUser.examType,
        examDate: updatedUser.examDate,
        supportStyle: updatedUser.supportStyle,
        dailyStudyHours: updatedUser.dailyStudyHours,
        sleepHours: updatedUser.sleepHours,
        baselineStress: updatedUser.baselineStress,
        emergencyContact: updatedUser.emergencyContact
      }
    });
  } catch (err) {
    next(err);
  }
};
