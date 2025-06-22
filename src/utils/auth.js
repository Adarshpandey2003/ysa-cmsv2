// src/utils/auth.js
const dummyUsers = [
  {
    role: 'Review Team',
    email: 'review@example.com',
    password: 'review123',
    redirectTo: '/review/dashboard',
  },
  {
    role: 'Agent',
    email: 'agent@example.com',
    password: 'agent123',
    redirectTo: '/agent/dashboard',
  },
];

export function authenticate(role, email, password) {
  const user = dummyUsers.find(
    (u) =>
      u.role === role && u.email === email.trim() && u.password === password
  );
  if (user) return user.redirectTo;
  throw new Error('Invalid credentials');
}
