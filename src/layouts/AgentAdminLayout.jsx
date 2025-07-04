import React from 'react';
import { Link } from 'react-router-dom';

export default function AgentAdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between">
          <Link href="/"><a className="font-bold text-xl">YSA Admin</a></Link>
          <div className="space-x-4">
            <Link href="/admin/agent/dashboard"><a>Apps</a></Link>
            <Link href="/admin/agent/applications"><a>Reassign</a></Link>
            <Link href="/admin/agent/agents"><a>Agents</a></Link>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('ysa_user');
                window.location.href = '/admin/login';
              }}
              className="text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
