// src/pages/review/DashboardPage.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ReviewLayout from '../../layouts/ReviewLayout';
import StudentCard from '../../components/review/StudentCard';

const students = [
  { id: 1, name: 'Anshu',                 mobile: '2378327432', university: 'Essex',           course: 'MBA',             status: 'Active' },
  { id: 2, name: 'Avi',                   mobile: '9999999999', university: 'KSDBCUIWEB',     course: 'UK',              status: 'Active' },
  { id: 3, name: 'AKN',                   mobile: '1234567890', university: 'Keele',           course: 'Psychology',      status: 'Active' },
  { id: 4, name: 'Avinash Pandey',        mobile: '9319765934', university: 'Essex University', course: 'MBA',             status: 'Active' },
  { id: 5, name: 'Under Review Student',  mobile: '1231231234', university: 'Oxford',          course: 'History',         status: 'Under Review' },
  { id: 6, name: 'Action Required Student', mobile: '2342342345', university: 'Cambridge',     course: 'Engineering',     status: 'Action Required' },
  { id: 7, name: 'Approved Student 1',    mobile: '3453453456', university: 'Harvard',         course: 'Law',             status: 'Approved' },
  { id: 8, name: 'Approved Student 2',    mobile: '4564564567', university: 'Stanford',        course: 'Medicine',         status: 'Approved' },
  // Note: no 'Rejected' example here
];

export default function DashboardPage() {
  const [selectedStatus, setSelectedStatus] = useState('Active');

  // count how many students in each status
  const countByStatus = (status) =>
    students.filter((s) => s.status === status).length;

  // define the five dashboard cards
  const cards = [
    {
      title: 'Active Students',
      status: 'Active',
      count: countByStatus('Active'),
      border: 'border-l-4 border-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Under Review',
      status: 'Under Review',
      count: countByStatus('Under Review'),
      border: 'border-l-4 border-yellow-400',
      bg: 'bg-white',
    },
    {
      title: 'Action Required',
      status: 'Action Required',
      count: countByStatus('Action Required'),
      border: 'border-l-4 border-orange-400',
      bg: 'bg-white',
    },
    {
      title: 'Approved',
      status: 'Approved',
      count: countByStatus('Approved'),
      border: 'border-l-4 border-green-400',
      bg: 'bg-white',
    },
    {
      title: 'Rejected',
      status: 'Rejected',
      count: countByStatus('Rejected'),
      border: 'border-l-4 border-red-400',
      bg: 'bg-white',
    },
  ];

  // compute filtered list based on selection
  const filteredStudents = useMemo(
    () => students.filter((s) => s.status === selectedStatus),
    [selectedStatus]
  );

  return (
    <ReviewLayout userName="Review Manager">
      {/* Page title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Student Management Dashboard
      </h1>

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => {
          const isActive = c.status === selectedStatus;
          // darker bg for the active card
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
              <h3 className="text-sm font-medium text-gray-500">{c.title}</h3>
              <p className="mt-2 text-2xl font-bold text-gray-800">{c.count}</p>
              <p className="text-sm text-gray-500">students</p>
            </div>
          );
        })}
      </div>

      {/* Filtered student list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="px-6 py-4 border-b text-lg font-medium text-gray-700">
          {cards.find((c) => c.status === selectedStatus)?.title || ''}
          {' '}({filteredStudents.length})
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
    </ReviewLayout>
  );
}
