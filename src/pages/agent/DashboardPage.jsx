// src/pages/agent/DashboardPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AgentLayout from '../../layouts/AgentLayout';
import AddStudentModal from '../../components/agent/AddStudentModal';
import StudentCard from '../../components/review/StudentCard';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../utils/api';

export default function AgentAdminDashboardPage() {
  const currentUser = JSON.parse(localStorage.getItem('ysa_user') || '{}');

  const [students, setStudents]       = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Draft');
  const [showModal, setShowModal]     = useState(false);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  // Fetch this agent's applications on mount
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    api.get('/applications')
      .then(res => {
        if (!isMounted) return;
        const apps = res.data
          // only your own
          .filter(app => app.agent_id === currentUser.id)
          // map into the shape StudentCard expects
          .map(app => ({
            id: app.id,
            name: app.student_name,
            mobile: app.mobile,
            university: app.university,
            course: app.course_name,
            status: ({
              draft: 'Draft',
              active: 'Active',
              under_review: 'Under Review',
              action_required: 'Action Required',
              approved: 'Approved',
              rejected: 'Rejected',
            }[app.status] || app.status),
          }));
        setStudents(apps);
      })
      .catch(err => {
        if (!isMounted) return;
        console.error(err);
        setError(err.response?.data?.error || err.message);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser.id]);

  // Counts for cards
  const countBy = status =>
    students.filter(s => s.status === status).length;

  const cards = [
    { title: 'Draft Profiles',   status: 'Draft',         border: 'border-l-4 border-gray-800',  bg: 'bg-white' },
    { title: 'Active Students',  status: 'Active',        border: 'border-l-4 border-blue-600',  bg: 'bg-blue-50' },
    { title: 'Under Review',     status: 'Under Review',  border: 'border-l-4 border-yellow-400',bg: 'bg-white' },
    { title: 'Action Required',  status: 'Action Required',border: 'border-l-4 border-orange-400',bg: 'bg-white' },
    { title: 'Approved',         status: 'Approved',      border: 'border-l-4 border-green-400', bg: 'bg-white' },
    { title: 'Rejected',         status: 'Rejected',      border: 'border-l-4 border-red-400',   bg: 'bg-white' },
  ].map(c => ({ ...c, count: countBy(c.status) }));

  // Students filtered by status
  const filtered = useMemo(
    () => students.filter(s => s.status === selectedStatus),
    [students, selectedStatus]
  );

  // Add new student (via API)
  const handleAdd = data => {
    api.post('/applications', {
      agent_id:     currentUser.id,
      student_name: data.name,
      mobile:       data.mobile,
      email:        data.email,
      country:      data.country,
      state:        data.state,
      university:   data.university,
      course_name:  data.course,
      course_url:   data.courseUrl,
    })
    .then(res => {
      const app = res.data;
      setStudents(prev => [
        ...prev,
        {
          id:         app.id,
          name:       app.student_name,
          mobile:     app.mobile,
          university: app.university,
          course:     app.course_name,
          status:     'Draft',
        },
      ]);
      setShowModal(false);
    })
    .catch(err => alert(err.response?.data?.error || err.message));
  };

  // Delete a draft profile (via API)
  const handleDelete = id => {
    if (!window.confirm('Are you sure you want to delete this draft profile?')) return;
    api.delete(`/applications/${id}`)
      .then(() => {
        setStudents(prev => prev.filter(s => s.id !== id));
      })
      .catch(err => alert(err.response?.data?.error || err.message));
  };

  if (loading) {
    return (
      <AgentLayout userName={currentUser.name || 'Agent'}>
        <div className="text-center py-20">Loading…</div>
      </AgentLayout>
    );
  }

  if (error) {
    return (
      <AgentLayout userName={currentUser.name || 'Agent'}>
        <div className="text-center py-20 text-red-600">{error}</div>
      </AgentLayout>
    );
  }

  return (
    <AgentLayout userName={currentUser.name || 'Agent'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Student Management Dashboard
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add New Student
        </button>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {cards.map(c => {
          const isActive = c.status === selectedStatus;
          const bgClass = isActive
            ? c.bg === 'bg-blue-50'
              ? 'bg-blue-100'
              : 'bg-gray-100'
            : c.bg;
          return (
            <div
              key={c.status}
              onClick={() => setSelectedStatus(c.status)}
              className={`cursor-pointer ${bgClass} ${c.border} rounded-lg p-4 transition`}
            >
              <h3 className="text-sm font-medium text-gray-500">{c.title}</h3>
              <p className="mt-2 text-2xl font-bold text-gray-800">{c.count}</p>
              <p className="text-sm text-gray-500">students</p>
            </div>
          );
        })}
      </div>

      {/* Filtered list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="px-6 py-4 border-b text-lg font-medium text-gray-700">
          {cards.find(c => c.status === selectedStatus)?.title} ({filtered.length})
        </h2>
        <div>
          {filtered.map(s => (
            <div
              key={s.id}
              className="flex items-center justify-between px-6 py-4 border-b last:border-none hover:bg-gray-50"
            >
              <Link to={`/agent/student/${s.id}`} className="flex-1">
                <StudentCard student={s} />
              </Link>
              {selectedStatus === 'Draft' && (
                <button
                  onClick={() => handleDelete(s.id)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add modal */}
      <AddStudentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAdd}
      />
    </AgentLayout>
  );
}
