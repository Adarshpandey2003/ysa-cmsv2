// src/pages/admin/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/admin/LoginForm';
import { authenticate } from '../../utils/auth';

export default function AdminLogin() {
  // initial role can be empty or default to one of your two options
  const [role, setRole]         = useState('Agent Admin'); // or 'review_admin' based on your app's logic
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const path = await authenticate(role, email, password);
      console.log(`Redirecting to: ${path}`);
      navigate(path); // Adjust the URL as needed
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
      onRoleChange={setRole}      // LoginForm should call this when the user picks a role
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
}
