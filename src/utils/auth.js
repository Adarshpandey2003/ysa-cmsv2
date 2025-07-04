// src/services/auth.js
import api from '../utils/api';

// Map the friendly role names in your UI to the backend’s enum values
const roleMap = {
  'Agent':       'agent',
  'Review Team': 'reviewer',
  'Agent Admin': 'agent_admin',
  'Review Admin': 'review_admin',
};

// After login, redirect based on the backend’s role
const redirectMap = {
  agent:  '/agent/dashboard',
  reviewer: '/review/dashboard',
  agent_admin: '/admin/agent/dashboard',
  review_admin: '/review_admin/dashboard',
};

export async function authenticate(roleLabel, email, password) {
  // 1) Verify the roleLabel is known
  const expectedRole = roleMap[roleLabel];
  if (!expectedRole) {
    throw new Error(`Unknown role: ${roleLabel}`);
  }

  // 2) Call your /auth/login endpoint
  let data;
  try {
    ({ data } = await api.post('/auth/login', { email, password }));
  } catch (err) {
    // Propagate backend errors (e.g. 401) as JS errors
    const msg = err.response?.data?.error || 'Login failed';
    throw new Error(msg);
  }

  // 3) Check the role matches what the user selected
  if (data.user.role !== expectedRole) {
    throw new Error(`You are not registered as a ${roleLabel}`);
  }

  // 4) Persist token + user info

  localStorage.setItem('ysa_token',data.token);
  localStorage.setItem('ysa_user', JSON.stringify(data.user));

  // 5) Return the correct redirect path
  return redirectMap[expectedRole];
}
