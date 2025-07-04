import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function ApplicationsTable({ applications, onReload }) {
  const [agents, setAgents] = useState([]);

  // load agent list for reassign
  useEffect(() => {
    let isMounted = true;
    api.get('/admin/agents')
      .then(res => {
        if (!isMounted) return;
        setAgents(res.data);
      })
      .catch(err => {
        if (!isMounted) return;
        console.error(err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const reassign = (appId, agentId) => {
    api.patch(`/admin/applications/${appId}/assign`, { agent_id: agentId })
      .then(onReload)
      .catch(err => alert(err.response?.data?.error || err.message));
  };

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">Student</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Agent</th>
          <th className="px-4 py-2">Reassign To</th>
        </tr>
      </thead>
      <tbody>
        {applications.map(app => (
          <tr key={app.id} className="border-t">
            <td className="px-4 py-2">{app.id}</td>
            <td className="px-4 py-2">{app.student_name}</td>
            <td className="px-4 py-2">{app.status}</td>
            <td className="px-4 py-2">{app.agent_id || '—'}</td>
            <td className="px-4 py-2">
              <select
                value={app.agent_id||''}
                onChange={e => reassign(app.id, Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                <option value="">— none —</option>
                {agents.map(a => (
                  <option key={a.id} value={a.id}>{a.email}</option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
