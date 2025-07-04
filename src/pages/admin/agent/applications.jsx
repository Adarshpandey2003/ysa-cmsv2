import React, { useEffect, useState } from 'react';
import AgentAdminLayout from '../../../layouts/AgentAdminLayout';
import ApplicationsTable from '../../../components/admin/ApplicationsTable';
import api from '../../../utils/api';

export default function AgentAdminApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setError('');
    api.get('/applications')
      .then(res => {
        if (!isMounted) return;
        setApps(res.data);
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err.response?.data?.error || err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AgentAdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Reassign Applications</h1>
      {error && <p className="text-red-600">{error}</p>}
      <ApplicationsTable applications={apps} onReload={() => window.location.reload()} />
    </AgentAdminLayout>
  );
}
