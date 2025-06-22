// src/pages/review/StudentProfilePage.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeftIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  AcademicCapIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import ReviewLayout from '../../layouts/ReviewLayout';

// Static student list — mirror your Dashboard data
const students = [
  { id: 1, name: 'Anshu',        mobile: '2378327432', email: 'anshu@gmail.com',        country: 'United Kingdom', state: 'UP', university: 'Essex',           course: 'MBA', status: 'Under Review' },
  { id: 2, name: 'Avi',          mobile: '9999999999', email: 'avi@gmail.com',          country: 'United Kingdom', state: 'UP', university: 'KSDBCUIWEB',     course: 'UK',  status: 'Under Review' },
  // …other entries…
];

export default function ReviewStudentPage() {
  const { id } = useParams();
  const student = students.find((s) => s.id === +id);

  // local comment state
  const [comment, setComment] = useState('');

  if (!student) {
    return (
      <ReviewLayout userName="Review Manager">
        <div className="text-center py-20 text-red-600">
          Student not found.
        </div>
      </ReviewLayout>
    );
  }

  const handleAddComment = () => {
    // placeholder: wire to API later
    alert(`Posted comment: ${comment}`);
    setComment('');
  };

  const handleApprove = () => {
    alert('Application approved!');
  };
  const handleReject = () => {
    alert('Application rejected!');
  };

  return (
    <ReviewLayout userName="Review Manager">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 text-gray-700">
          <Link to="/review/dashboard" className="flex items-center hover:text-gray-900">
            <ChevronLeftIcon className="w-5 h-5" />
            <span className="ml-1">Back to Dashboard</span>
          </Link>
          <h2 className="text-xl font-semibold ml-4">Student Profile</h2>
        </div>
        <span className="inline-block bg-yellow-100 text-yellow-800 uppercase text-xs font-semibold px-3 py-1 rounded-full">
          {student.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ─── Student Information ───────────────────────── */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Student Information</h3>

          <div className="space-y-6">
            {/* Personal Info */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-700">Personal Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <UserIcon className="w-5 h-5 mr-2" />
                  <div>
                    <div className="text-xs uppercase">Full Name</div>
                    <div>{student.name}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  <div>
                    <div className="text-xs uppercase">Mobile</div>
                    <div>{student.mobile}</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center text-gray-600">
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                <div>
                  <div className="text-xs uppercase">Email</div>
                  <div>{student.email}</div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-700">Location</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  <div>
                    <div className="text-xs uppercase">Country</div>
                    <div>{student.country}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  <div>
                    <div className="text-xs uppercase">State</div>
                    <div>{student.state}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div>
              <h4 className="font-semibold mb-2 text-gray-700">Academic Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                <div className="flex items-center">
                  <AcademicCapIcon className="w-5 h-5 mr-2" />
                  <div>
                    <div className="text-xs uppercase">University</div>
                    <div>{student.university}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <BookOpenIcon className="w-5 h-5 mr-2" />
                  <div>
                    <div className="text-xs uppercase">Course</div>
                    <a href="#" className="underline hover:text-blue-600">
                      {student.course}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Document Verification ──────────────────────── */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <h3 className="text-lg font-medium mb-4">Document Verification</h3>
          <hr className="mb-6" />

          {/* Team Communication */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-gray-700">Team Communication</h4>
            <div className="bg-gray-50 rounded-md p-4 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                  A
                </div>
                <div>
                  <div className="text-sm font-medium">Agent Team</div>
                  <div className="text-sm text-gray-600">
                    Here’s a sample comment from the agent.
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400">Jun 21, 08:37 PM</div>
            </div>
          </div>

          {/* Add Comment */}
          <div className="mb-6 flex-1 flex flex-col">
            <label className="block mb-1 font-medium text-gray-700">Add Comment</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your review comments here…"
              className="w-full border rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-200 resize-y"
            />
            <button
              onClick={handleAddComment}
              className="mt-3 bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition"
            >
              Add Comment
            </button>
          </div>

          {/* Review Actions */}
          <div className="pt-4 border-t flex space-x-4">
            <button
              onClick={handleReject}
              className="flex-1 bg-red-500 text-white rounded-md py-2 hover:bg-red-600 transition"
            >
              Reject Application
            </button>
            <button
              onClick={handleApprove}
              className="flex-1 bg-green-500 text-white rounded-md py-2 hover:bg-green-600 transition"
            >
              Approve Application
            </button>
          </div>
        </div>
      </div>
    </ReviewLayout>
  );s
}
