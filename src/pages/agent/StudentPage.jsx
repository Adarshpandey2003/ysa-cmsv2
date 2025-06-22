// src/pages/agent/StudentProfilePage.jsx
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeftIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ArrowUpOnSquareIcon,
  EyeIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import AgentLayout from '../../layouts/AgentLayout';

// Static student list — must match your Dashboard IDs
const students = [
  {
    id: 101,
    name: 'Anshu',
    mobile: '2378327432',
    email: 'anshu@example.com',
    country: 'United Kingdom',
    state: 'UP',
    university: 'Essex',
    course: 'MBA',
    status: 'Draft',
  },
  {
    id: 102,
    name: 'Avi',
    mobile: '9999999999',
    email: 'avi@example.com',
    country: 'United Kingdom',
    state: 'UP',
    university: 'KSDBCUIWEB',
    course: 'UK',
    status: 'Under Review',
  },
  // …other students…
];

// All possible doc-types, with those *required* marked
const DOC_TYPES = [
  { label: 'Passport Copy',       value: 'Passport Copy',   required: true,  group: 'Passport Information' },
  { label: 'Passport Receipt',    value: 'Passport Receipt',required: false, group: 'Passport Information' },
  { label: 'CV/Resume',           value: 'CV/Resume',       required: true,  group: 'Academic Documents' },
  { label: '10th Marksheet',      value: '10th Marksheet',  required: true,  group: 'Academic Documents' },
  { label: '12th Marksheet',      value: '12th Marksheet',  required: true,  group: 'Academic Documents' },
  { label: 'UG Degree',           value: 'UG Degree',       required: false, group: 'Academic Documents' },
  { label: 'UG Marksheets',       value: 'UG Marksheets',   required: false, group: 'Academic Documents' },
  { label: 'PG Degree',           value: 'PG Degree',       required: false, group: 'Academic Documents' },
  { label: 'PG Marksheets',       value: 'PG Marksheets',   required: false, group: 'Academic Documents' },
  { label: 'LOR 1',               value: 'LOR 1',           required: false, group: 'Academic Documents' },
  { label: 'LOR 2',               value: 'LOR 2',           required: false, group: 'Academic Documents' },
  { label: 'Work Experience Letter', value: 'Work Experience Letter', required: false, group: 'Academic Documents' },
  { label: 'Statement of Purpose',   value: 'Statement of Purpose',   required: false, group: 'Academic Documents' },
  { label: 'Additional Document',     value: 'Additional Document',     required: false, group: 'Academic Documents' },
];

// Helper to group docs by their “group” field
const GROUPS = Array.from(
  new Set(DOC_TYPES.map((d) => d.group))
);

export default function AgentStudentProfilePage() {
  const { id } = useParams();
  const student = students.find((s) => s.id === +id);

  // documents & comments in local state
  const [docs, setDocs] = useState([]); // { id, type, fileName, status, rejections, views, timestamp }
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    // sample existing comments
    { id: 1, actor: 'Agent',   text: 'Initial upload done.',        time: 'Jun 21, 08:37 PM' },
    { id: 2, actor: 'Review',  text: 'Please reupload passport.',    time: 'Jun 22, 10:41 AM' },
  ]);

  // upload form state
  const [docType, setDocType] = useState('');
  const [file, setFile] = useState(null);

  if (!student) {
    return (
      <AgentLayout userName="Agent Smith">
        <div className="text-center py-20 text-red-600">Student not found.</div>
      </AgentLayout>
    );
  }

  const handleUpload = () => {
    if (!docType || !file) {
      alert('Please select document type and file.');
      return;
    }
    const newDoc = {
      id: Date.now(),
      type: docType,
      fileName: file.name,
      status: 'Pending',
      rejections: 0,
      views: 0,
      timestamp: new Date().toLocaleString(),
    };
    setDocs((prev) => [...prev, newDoc]);
    setDocType('');
    setFile(null);
  };

  const handleReupload = (docId) => {
    const newFileName = prompt('New file name?');
    if (!newFileName) return;
    setDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, fileName: newFileName, status: 'Pending', timestamp: new Date().toLocaleString() }
          : d
      )
    );
  };

  const handleView = (docId) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, views: d.views + 1 } : d
      )
    );
    alert('Viewing document…');
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        actor: 'Agent',
        text: commentText,
        time: new Date().toLocaleString(),
      },
    ]);
    setCommentText('');
  };

  // grouped docs
  const docsByGroup = useMemo(() => {
    return GROUPS.map((group) => ({
      group,
      items: docs.filter((d) =>
        DOC_TYPES.find((dt) => dt.value === d.type)?.group === group
      ),
    }));
  }, [docs]);

  // status‐badge colors
  const badgeStyles = {
    Draft: 'bg-gray-100 text-gray-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    'Action Required': 'bg-orange-100 text-orange-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };

  return (
    <AgentLayout userName="Agent Smith">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 text-gray-700">
          <Link to="/agent/dashboard" className="flex items-center hover:text-gray-900">
            <ChevronLeftIcon className="w-5 h-5" />
            <span className="ml-1">Back to Dashboard</span>
          </Link>
          <h2 className="text-xl font-semibold ml-4">Student Profile</h2>
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${badgeStyles[student.status]}`}>
          {student.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ─── Student Information ───────────────────────── */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Student Information</h3>
          <div className="space-y-6">
            {/* Personal */}
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

            {/* Academic */}
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

        {/* ─── Upload & Verification ─────────────────────── */}
        <div className="space-y-6">
          {/* Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <ArrowUpOnSquareIcon className="w-6 h-6 mr-2" /> Upload Document
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select document type</option>
                  {DOC_TYPES.map((dt) => (
                    <option key={dt.value} value={dt.value}>
                      {dt.label}{dt.required ? ' ⭐' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select File <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                  className="w-full"
                />
              </div>
              <button
                onClick={handleUpload}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                <ArrowUpOnSquareIcon className="w-5 h-5 inline-block mr-1" />
                Upload
              </button>
            </div>
            <ul className="mt-4 text-xs text-gray-500 space-y-1">
              <li>• Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG</li>
              <li>• Maximum file size: 10MB</li>
              <li>• Documents marked with ⭐ are required</li>
            </ul>
          </div>

          {/* Document Verification */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Document Verification</h3>
            <hr className="mb-4" />

            {/* Team Communication */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2 text-gray-700">Team Communication</h4>
              <div className="space-y-4 max-h-40 overflow-y-auto">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="bg-gray-50 rounded-md p-3 flex items-start justify-between"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center 
                        ${c.actor === 'Agent' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'}
                      `}>
                        {c.actor[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{c.actor} Team</div>
                        <div className="text-sm text-gray-600">{c.text}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{c.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Comment */}
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">Add Comment</label>
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add your agent comments here…"
                className="w-full border rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-200 resize-y"
              />
              <button
                onClick={handleAddComment}
                className="mt-3 bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition w-full"
              >
                Add Comment
              </button>
            </div>

            {/* Uploaded documents by category */}
            {docsByGroup.map(({ group, items }) =>
              items.length > 0 ? (
                <div key={group} className="mb-6">
                  <h4 className="font-semibold mb-2 text-gray-700">{group}</h4>
                  <div className="space-y-3">
                    {items.map((d) => (
                      <div
                        key={d.id}
                        className="bg-gray-50 rounded-md p-3 flex items-center justify-between"
                      >
                        <div className="flex-1 flex items-center space-x-2 truncate">
                          <span className="font-medium truncate">{d.fileName}</span>
                          {d.status === 'Pending' && (
                            <span className="text-yellow-600 text-xs">⌛</span>
                          )}
                          {d.status === 'Rejected' && (
                            <span className="text-red-600 text-xs">{d.rejections}× rejected</span>
                          )}
                          {d.status === 'Approved' && (
                            <span className="text-green-600 text-xs">✔ approved</span>
                          )}
                          <span className="text-gray-400 text-xs">{d.views}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <EyeIcon
                            className="w-5 h-5 text-gray-600 cursor-pointer"
                            onClick={() => handleView(d.id)}
                          />
                          <ArrowPathIcon
                            className="w-5 h-5 text-gray-600 cursor-pointer"
                            onClick={() => handleReupload(d.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}
