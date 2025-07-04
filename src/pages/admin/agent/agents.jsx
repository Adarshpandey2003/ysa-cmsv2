// src/pages/admin/AgentAgentDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AgentLayout from '../../../layouts/AgentLayout';
import api from '../../../utils/api';
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Modal from '../../../components/common/Modal'; // your generic modal

export default function AgentAdminAgentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [agent, setAgent]     = useState(null);
  const [apps, setApps]       = useState([]);
  const [allAgents, setAllAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const [showPwdModal, setShowPwdModal] = useState(false);
  const [newPassword, setNewPassword]   = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    Promise.all([
      api.get(`/admin/agents/${id}`),
      api.get('/applications'),
      api.get('/admin/agents')
    ])
      .then(([agentRes, appsRes, agentsRes]) => {
        if (!isMounted) return;
        setAgent(agentRes.data);
        setApps(appsRes.data.filter(a => a.agent_id === Number(id)));
        setAllAgents(agentsRes.data);
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err.response?.data?.error || err.message);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const statusClasses = {
    draft:           'text-gray-500',
    active:          'text-blue-600',
    under_review:    'text-yellow-500',
    action_required: 'text-orange-500',
    approved:        'text-green-600',
    rejected:        'text-red-600',
  };

  // Reassign a single application to another agent
  const reassignApp = async (appId, newAgentId) => {
    try {
      await api.patch(`/admin/applications/${appId}/assign`, { agent_id: newAgentId });
      // remove from this list (since it's no longer theirs)
      setApps(curr => curr.filter(a => a.id !== appId));
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // Delete this agent altogether
  const handleDeleteAgent = async () => {
    if (!window.confirm('Really delete this agent and orphan their applications?')) return;
    try {
      await api.delete(`/admin/agents/${id}`);
      navigate('/admin/agent/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  // Change password
  const handlePasswordUpdate = () => {
    if (!newPassword) return alert('Enter a new password');
    api.patch(`/admin/agents/${id}/password`, { password: newPassword })
      .then(() => {
        setShowPwdModal(false);
        alert('Password updated');
      })
      .catch(err => alert(err.response?.data?.error || err.message));
  };

  if (loading) {
    return (
      <AgentLayout userName="Agent Admin">
        <div className="py-20 text-center">Loading…</div>
      </AgentLayout>
    );
  }
  if (error || !agent) {
    return (
      <AgentLayout userName="Agent Admin">
        <div className="py-20 text-red-600 text-center">
          {error || 'Agent not found'}
        </div>
      </AgentLayout>
    );
  }

  return (
    <AgentLayout userName="Agent Admin">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Link to="/admin/agent/dashboard" className="text-gray-700 hover:text-gray-900">
            ← Back
          </Link>
          <h2 className="text-2xl font-semibold">Agent: {agent.name}</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPwdModal(true)}
            className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <PencilSquareIcon className="w-5 h-5" />
            <span>Update Password</span>
          </button>
          <button
            onClick={handleDeleteAgent}
            className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            <TrashIcon className="w-5 h-5" />
            <span>Delete Agent</span>
          </button>
        </div>
      </div>

      {/* Agent Info */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <p><strong>Name:</strong> {agent.name}</p>
        <p><strong>Email:</strong> {agent.email}</p>
        <p><strong>Role:</strong> {agent.role}</p>
      </div>

      {/* Applications Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Assigned Applications</h3>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Student</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Reassign To</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {apps.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No applications assigned.
                </td>
              </tr>
            )}
            {apps.map(a => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{a.id}</td>
                <td className="px-4 py-2">{a.student_name}</td>
                <td className={`px-4 py-2 font-semibold ${statusClasses[a.status]}`}>
                  {a.status.replace('_',' ')}
                </td>
                <td className="px-4 py-2">
                  <select
                    defaultValue={a.agent_id}
                    onChange={e => reassignApp(a.id, Number(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    <option value="">— select —</option>
                    {allAgents.map(ag => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name} ({ag.email})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <Link
                    to={`/agent/student/${a.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View / Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Password Modal */}
      {showPwdModal && (
        <Modal onClose={() => setShowPwdModal(false)}>
          <h4 className="text-xl font-semibold mb-4">Change Password</h4>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowPwdModal(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </Modal>
      )}
    </AgentLayout>
  );
}
