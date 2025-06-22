// src/pages/agent/DashboardPage.jsx
import React, { useState, useMemo } from 'react';
import ReviewLayout from '../../layouts/AgentLayout';
import AddStudentModal from '../../components/agent/AddStudentModal';
import StudentCard from '../../components/review/StudentCard'; // reuse the same row
import { Link } from 'react-router-dom';

export default function AgentDashboardPage() {
  // initial static data:
  const initial = [
    { id: 101, name: 'Anshu', mobile: '2378327432', university: 'Essex', course: 'MBA', status: 'Active' },
    { id: 102, name: 'Avi', mobile: '9999999999', university: 'KSDBCUIWEB', course: 'UK', status: 'Active' },
    { id: 103, name: 'AKN', mobile: '1234567890', university: 'Keele', course: 'Psychology', status: 'Active' },
    { id: 104, name: 'Avinash Pandey', mobile: '9319765934', university: 'Essex University', course: 'MBA', status: 'Active' },
    { id: 105, name: 'Under Review Student', mobile: '1231231234', university: 'Oxford', course: 'History', status: 'Under Review' },
    { id: 106, name: 'Action Required Student', mobile: '2342342345', university: 'Cambridge', course: 'Engineering', status: 'Action Required' },
    { id: 107, name: 'Approved Student 1', mobile: '3453453456', university: 'Harvard', course: 'Law', status: 'Approved' },
    { id: 108, name: 'Approved Student 2', mobile: '4564564567', university: 'Stanford', course: 'Medicine', status: 'Approved' },
  ];

  const [students, setStudents] = useState(initial);
  const [selectedStatus, setSelectedStatus] = useState('Active');
  const [showModal, setShowModal] = useState(false);

  // counts
  const countBy = (st) => students.filter((s) => s.status === st).length;

  const cards = [
    { title: 'Draft Profiles',  status: 'Draft',         count: countBy('Draft'),         border: 'border-l-4 border-gray-800',  bg: 'bg-white' },
    { title: 'Active Students', status: 'Active',        count: countBy('Active'),        border: 'border-l-4 border-blue-600',  bg: 'bg-blue-50' },
    { title: 'Under Review',    status: 'Under Review',  count: countBy('Under Review'),  border: 'border-l-4 border-yellow-400',bg: 'bg-white' },
    { title: 'Action Required', status: 'Action Required',count: countBy('Action Required'),border: 'border-l-4 border-orange-400',bg: 'bg-white' },
    { title: 'Approved',        status: 'Approved',      count: countBy('Approved'),      border: 'border-l-4 border-green-400', bg: 'bg-white' },
    { title: 'Rejected',        status: 'Rejected',      count: countBy('Rejected'),      border: 'border-l-4 border-red-400',   bg: 'bg-white' },
  ];

  const filtered = useMemo(
    () => students.filter((s) => s.status === selectedStatus),
    [students, selectedStatus]
  );

  const handleAdd = (newStudent) =>
    setStudents((prev) => [newStudent, ...prev]);

  return (
    <ReviewLayout userName="Agent Smith">
      {/* header + Add button */}
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

      {/* status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {cards.map((c) => {
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

      {/* filtered list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="px-6 py-4 border-b text-lg font-medium text-gray-700">
          {cards.find((c) => c.status === selectedStatus)?.title} ({filtered.length})
        </h2>
        <div className="divide-y">
          {filtered.map((s) => (
            <Link
              key={s.id}
              to={`/agent/student/${s.id}`}
              className="block px-6 py-4 hover:bg-gray-50"
            >
              <StudentCard student={s} />
            </Link>
          ))}
        </div>
      </div>

      {/* Add modal */}
      <AddStudentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAdd}
      />
    </ReviewLayout>
  );
}
