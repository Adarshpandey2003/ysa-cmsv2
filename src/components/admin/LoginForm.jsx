import React from 'react';

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
      <form
        onSubmit={onSubmit}
        className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-6"
      >
        <h2 className="text-center text-2xl font-bold">Admin Login</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={role}
            onChange={e => onRoleChange(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-200"
          >
            <option value="agent_admin">Agent Admin</option>
            <option value="review_admin">Review Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => onEmailChange(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => onPasswordChange(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
