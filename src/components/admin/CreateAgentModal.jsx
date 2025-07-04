import React, { useState } from 'react';
import api from '../../utils/api';

export default function CreateAgentModal({ isOpen, onClose, onCreated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const submit = () => {
    api.post('/admin/agents', { email, password })
      .then(() => {
        onCreated();
        onClose();
      })
      .catch(err => alert(err.response?.data?.error || err.message));
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">New Agent</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2">Cancel</button>
          <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
