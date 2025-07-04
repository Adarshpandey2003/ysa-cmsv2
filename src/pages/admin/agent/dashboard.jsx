// src/pages/admin/AgentAdminDashboardPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import AgentLayout from '../../../layouts/AgentLayout';
import api from '../../../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../../../components/common/Modal';

export default function AgentAdminDashboardPage() {
  const [apps, setApps]       = useState([]);
  const [agents, setAgents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName]     = useState('');
  const [newEmail, setNewEmail]   = useState('');
  const [newPass, setNewPass]     = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([ api.get('/applications'), api.get('/admin/agents') ])
      .then(([appsRes, agentsRes]) => {
        if (!isMounted) return;
        setApps(appsRes.data);
        setAgents(agentsRes.data);
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err.message);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Status categories
  const statuses = ['draft','active','under_review','action_required','approved','rejected'];

  // Global counts
  const globalCounts = useMemo(() => {
    const c = Object.fromEntries(statuses.map(s => [s,0]));
    apps.forEach(a => { c[a.status] = (c[a.status]||0) + 1 });
    return c;
  }, [apps]);

  // Per-agent breakdown
  const byAgent = useMemo(() => {
    const map = {};
    agents.forEach(agent => {
      map[agent.id] = { ...agent, counts: Object.fromEntries(statuses.map(s=>[s,0])) };
    });
    apps.forEach(a => {
      if (map[a.agent_id]) map[a.agent_id].counts[a.status]++;
    });
    return Object.values(map);
  }, [agents, apps]);

  // Create new agent handler
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/agents', { name: newName, email: newEmail, password: newPass });
      // refresh agents list
      const res = await api.get('/admin/agents');
      setAgents(res.data);
      // close modal & reset
      setShowModal(false);
      setNewName(''); setNewEmail(''); setNewPass('');
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AgentLayout userName="Agent Admin">
        <div className="py-20 text-center">Loading…</div>
      </AgentLayout>
    );
  }
  if (error) {
    return (
      <AgentLayout userName="Agent Admin">
        <div className="py-20 text-red-600 text-center">{error}</div>
      </AgentLayout>
    );
  }

  return (
    <AgentLayout userName="Agent Admin">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">YSA Admin — Agent Overview</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Create Agent
        </button>
      </div>

      {/* Global Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {statuses.map(st => {
          const titles = {
            draft: 'Draft Profiles',
            active: 'Active Students',
            under_review: 'Under Review',
            action_required: 'Action Required',
            approved: 'Approved',
            rejected: 'Rejected'
          };
          const border = {
            draft: 'border-gray-800',
            active: 'border-blue-600',
            under_review: 'border-yellow-400',
            action_required: 'border-orange-400',
            approved: 'border-green-400',
            rejected: 'border-red-400'
          }[st];
          const bg = st === 'active' ? 'bg-blue-50' : 'bg-white';
          return (
            <div
              key={st}
              className={`border-l-4 ${border} ${bg} rounded-lg p-4`}
            >
              <h3 className="text-sm font-medium text-gray-500">{titles[st]}</h3>
              <p className="mt-2 text-2xl font-bold text-gray-800">{globalCounts[st]}</p>
              <p className="text-sm text-gray-500">applications</p>
            </div>
          );
        })}
      </div>

      {/* Per-Agent Breakdown */}
      <div className="space-y-6">
        {byAgent.map(agent => (
          <div
            key={agent.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md cursor-pointer"
            onClick={() => navigate(`/admin/agent/agents/${agent.id}`)}
          >
            <h2 className="text-lg font-semibold mb-4">
              {agent.name} &lt;{agent.email}&gt;
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {statuses.map(st => (
                <div key={st} className="text-center">
                  <div className="text-sm text-gray-500 uppercase">
                    {st.replace('_',' ')}
                  </div>
                  <div className="mt-1 text-xl font-bold">
                    {agent.counts[st]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create Agent Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h3 className="text-xl font-semibold mb-4">Create New Agent</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="text-right">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Creating…' : 'Create Agent'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AgentLayout>
  );
}
