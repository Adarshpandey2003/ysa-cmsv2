// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { authenticate } from '../utils/auth';

export default function LoginPage() {
  const [role, setRole]       = useState('Review Team');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const navigate               = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const path = await authenticate(role, email, password);
      navigate(path);
    } catch (err) {
      setError(err.message);
    }
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
      /* demo props removed */
    />
  );
}
