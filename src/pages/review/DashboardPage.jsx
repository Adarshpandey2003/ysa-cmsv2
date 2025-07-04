// src/pages/review/DashboardPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ReviewLayout from '../../layouts/ReviewLayout';
import StudentCard from '../../components/review/StudentCard';
import api from '../../utils/api';

export default function DashboardPage() {
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    api.get('/applications')
      .then((res) => {
        if (!isMounted) return;
        console.log('API response:', res.data);
        const apps = res.data.map((app) => ({
          id: app.id,
          name: app.student_name,
          mobile: app.mobile,
          university: app.university,
          course: app.course_name,
          status: {
            draft: 'Draft',
            active: 'Active',
            under_review: 'Under Review',
            action_required: 'Action Required',
            approved: 'Approved',
            rejected: 'Rejected',
          }[app.status] || app.status,
        }));
        setAllStudents(apps);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('API error loading applications:', err);
        // show the backend message if available, otherwise the JS error
        const msg =
          err.response?.data?.error ||
          err.response?.statusText ||
          err.message ||
          'Unknown error';
        setError(`Error: ${msg}`);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const countByStatus = (status) =>
    allStudents.filter((s) => s.status === status).length;

  const filteredStudents = useMemo(
    () => allStudents.filter((s) => s.status === selectedStatus),
    [allStudents, selectedStatus]
  );

  const cardsMeta = [
    { title: 'Active Students',    status: 'Active',        border: 'border-l-4 border-blue-600',   bg: 'bg-blue-50' },
    { title: 'Under Review',       status: 'Under Review',  border: 'border-l-4 border-yellow-400', bg: 'bg-white'  },
    { title: 'Action Required',    status: 'Action Required',border: 'border-l-4 border-orange-400',bg: 'bg-white'  },
    { title: 'Approved',           status: 'Approved',      border: 'border-l-4 border-green-400',  bg: 'bg-white'  },
    { title: 'Rejected',           status: 'Rejected',      border: 'border-l-4 border-red-400',    bg: 'bg-white'  },
  ];

  return (
    <ReviewLayout userName="Review Manager">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Student Management Dashboard
      </h1>

      {error && (
        <div className="mb-4 text-red-600 text-center">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-20">Loading…</div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {cardsMeta.map((c) => {
              const isActive = c.status === selectedStatus;
              const bgClass = isActive
                ? c.bg === 'bg-blue-50'
                  ? 'bg-blue-100'
                  : 'bg-gray-100'
                : c.bg;

              return (
                <div
                  key={c.status}
                  role="button"
                  onClick={() => setSelectedStatus(c.status)}
                  className={`cursor-pointer ${bgClass} ${c.border} rounded-lg p-4 transition`}
                >
                  <h3 className="text-sm font-medium text-gray-500">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-2xl font-bold text-gray-800">
                    {countByStatus(c.status)}
                  </p>
                  <p className="text-sm text-gray-500">students</p>
                </div>
              );
            })}
          </div>

          {/* Student List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <h2 className="px-6 py-4 border-b text-lg font-medium text-gray-700">
              {cardsMeta.find((c) => c.status === selectedStatus)?.title ||
                ''}{' '}
              ({filteredStudents.length})
            </h2>
            <div className="divide-y">
              {filteredStudents.map((student) => (
                <Link
                  to={`/review/student/${student.id}`}
                  key={student.id}
                  className="block px-6 py-4 hover:bg-gray-50"
                >
                  <StudentCard student={student} />
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </ReviewLayout>
  );
}
