import React, { useState } from 'react';
import api from '../../utils/api';

export default function AgentsList({ agents, onReload }) {
  const [editingId, setEditingId] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const changePassword = id => {
    api
      .patch(`/admin/agents/${id}/password`, { newPassword })
      .then(() => {
        alert('Password changed');
        setEditingId(null);
        setNewPassword('');
      })
      .catch(err => alert(err.response?.data?.error || err.message));
  };

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Created At</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {agents.map(a => (
          <tr key={a.id} className="border-t">
            <td className="px-4 py-2">{a.email}</td>
            <td className="px-4 py-2">{new Date(a.created_at).toLocaleString()}</td>
            <td className="px-4 py-2">
              {editingId === a.id ? (
                <>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="border px-2 py-1 mr-2"
                  />
                  <button
                    onClick={() => changePassword(a.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="ml-2 text-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditingId(a.id)}
                  className="text-blue-600 hover:underline"
                >
                  Change Password
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
