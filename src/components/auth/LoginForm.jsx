// src/components/auth/LoginForm.jsx
import React from 'react';
import logo from '../../assets/logo_new.png';

export default function LoginForm({
  role,
  email,
  password,
  error,
  onRoleChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-300 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="YourStudyAbroad" className="h-16 w-16" />
        </div>
        <h2 className="text-center text-2xl font-bold mb-1">YourStudyAbroad</h2>
        <p className="text-center text-gray-500 mb-6">
          Document Verification Platform
        </p>

        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">User Role</label>
            <select
              value={role}
              onChange={(e) => onRoleChange(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option>Review Team</option>
              <option>Agent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-md py-2 text-center hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
