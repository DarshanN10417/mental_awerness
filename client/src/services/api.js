/**
 * Unified API Client for MindSprint AI
 */

const getHeaders = () => {
  const token = localStorage.getItem('mindsprint_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;
  
  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth & Profile
  auth: {
    signup: (data) => fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),

    login: (data) => fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(handleResponse),

    getMe: () => fetch('/api/auth/me', {
      headers: getHeaders()
    }).then(handleResponse),

    updateProfile: (data) => fetch('/api/users/profile', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse)
  },

  // Daily Check-ins
  mood: {
    log: (data) => fetch('/api/mood', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

    getLogs: () => fetch('/api/mood', {
      headers: getHeaders()
    }).then(handleResponse),

    getAnalytics: () => fetch('/api/mood/analytics', {
      headers: getHeaders()
    }).then(handleResponse)
  },

  // Journaling
  journal: {
    submit: (content, title = '') => fetch('/api/journal', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content, title })
    }).then(handleResponse),

    getEntries: () => fetch('/api/journal', {
      headers: getHeaders()
    }).then(handleResponse),

    getInsights: () => fetch('/api/journal/insights', {
      headers: getHeaders()
    }).then(handleResponse),

    getInsight: (id) => fetch(`/api/journal/${id}/insight`, {
      headers: getHeaders()
    }).then(handleResponse)
  },

  // SprintBuddy Chatbot
  chat: {
    send: (message) => fetch('/api/chat', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message })
    }).then(handleResponse),

    getHistory: () => fetch('/api/chat', {
      headers: getHeaders()
    }).then(handleResponse),

    clearHistory: () => fetch('/api/chat', {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse)
  },

  // Reports
  reports: {
    getWeekly: () => fetch('/api/reports/weekly', {
      headers: getHeaders()
    }).then(handleResponse)
  },

  // Interventions
  interventions: {
    generate: (category, reason) => fetch('/api/interventions', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ category, reason })
    }).then(handleResponse),

    complete: (id) => fetch(`/api/interventions/${id}/complete`, {
      method: 'PUT',
      headers: getHeaders()
    }).then(handleResponse),

    getHistory: () => fetch('/api/interventions', {
      headers: getHeaders()
    }).then(handleResponse)
  },

  // Dashboard Aggregator
  dashboard: {
    get: () => fetch('/api/dashboard', {
      headers: getHeaders()
    }).then(handleResponse)
  }
};
