// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { authenticate } from '../utils/auth';

export default function LoginPage() {
  const [role, setRole] = useState('Review Team');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      const path = authenticate(role, email, password);
      navigate(path);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDemo = (demoRole) => {
    const demo =
      demoRole === 'Review Team'
        ? { email: 'review@example.com', password: 'review123' }
        : { email: 'agent@example.com', password: 'agent123' };
    setRole(demoRole);
    setEmail(demo.email);
    setPassword(demo.password);
    setError('');
    setTimeout(() => {
      const path = authenticate(demoRole, demo.email, demo.password);
      navigate(path);
    }, 100);
  };

  return (
    <LoginForm
      role={role}
      email={email}
      password={password}
      error={error}
      onRoleChange={setRole}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onDemo={handleDemo}
    />
  );
}
