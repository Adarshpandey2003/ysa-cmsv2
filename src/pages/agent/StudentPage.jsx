// src/pages/agent/StudentProfilePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeftIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  AcademicCapIcon,
  BookOpenIcon,
  PencilSquareIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import AgentLayout from '../../layouts/AgentLayout';
import api from '../../utils/api';

// All document types and grouping
const DOC_TYPES = [
  { label: 'Passport Copy',          value: 'passport_copy',         required: true,  group: 'Passport Information' },
  { label: 'Passport Receipt',       value: 'passport_receipt',      required: false, group: 'Passport Information' },
  { label: 'CV/Resume',              value: 'cv_resume',             required: true,  group: 'Academic Documents' },
  { label: '10th Marksheet',         value: 'mark10',                required: true,  group: 'Academic Documents' },
  { label: '12th Marksheet',         value: 'mark12',                required: true,  group: 'Academic Documents' },
  { label: 'UG Degree',              value: 'ug_degree',             required: false, group: 'Academic Documents' },
  { label: 'UG Marksheets',          value: 'ug_marksheet',          required: false, group: 'Academic Documents' },
  { label: 'PG Degree',              value: 'pg_degree',             required: false, group: 'Academic Documents' },
  { label: 'PG Marksheets',          value: 'pg_marksheet',          required: false, group: 'Academic Documents' },
  { label: 'LOR 1',                  value: 'lor1',                  required: false, group: 'Academic Documents' },
  { label: 'LOR 2',                  value: 'lor2',                  required: false, group: 'Academic Documents' },
  { label: 'Work Experience Letter', value: 'work_experience_letter',required: false, group: 'Academic Documents' },
  { label: 'Statement of Purpose',   value: 'statement_of_purpose',  required: false, group: 'Academic Documents' },
  { label: 'Additional Document',    value: 'additional_document',   required: false, group: 'Academic Documents' },
];

export default function AgentStudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('ysa_user') || '{}');

  const [student, setStudent]       = useState(null);
  const [docs, setDocs]             = useState([]);
  const [comments, setComments]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [editing, setEditing]       = useState(false);

  const [fileInputs, setFileInputs]   = useState({});
  const [commentText, setCommentText] = useState('');
  const [commentTag, setCommentTag]   = useState('');
  const [showAllDocs, setShowAllDocs] = useState(true);
  const [viewingDoc, setViewingDoc]   = useState(null);

  // Group DOC_TYPES by category
  const groups = useMemo(() => {
    const map = {};
    DOC_TYPES.forEach(d => {
      if (!map[d.group]) map[d.group] = [];
      map[d.group].push(d);
    });
    return Object.entries(map).map(([group, types]) => ({ group, types }));
  }, []);

  // Helper for status dot
  const statusDot = st =>
    st === 'approved' ? 'bg-green-500'
  : st === 'pending'   ? 'bg-blue-500'
                       : 'bg-red-500';

  // Determine which required docs are still missing
  const uploadedTypes = docs.map(d => d.type);
  const missingByGroup = groups.map(({ group, types }) => ({
    group,
    types: types.filter(t => !uploadedTypes.includes(t.value)),
  }));
  const requiredValues = DOC_TYPES.filter(d => d.required).map(d => d.value);
  const allRequired = requiredValues.every(v => uploadedTypes.includes(v));

  // Load application, its docs and all comments
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    
    api.get(`/applications/${id}`)
      .then(res => {
        if (!isMounted) return; // Don't update state if component unmounted
        
        const { application, documents, comments } = res.data;
        setStudent({
          id:         application.id,
          name:       application.student_name,
          mobile:     application.mobile,
          email:      application.email,
          country:    application.country,
          state:      application.state,
          university: application.university,
          course:     application.course_name,
          courseUrl:  application.course_url,
          status:     application.status,
        });
        setDocs(documents.map(d => ({
          id:       d.id,
          type:     d.type,
          fileUrl:  d.file_url,
          fileName: d.file_url.split('/').pop(),
          status:   d.status,
        })));
        setComments(
          comments.map(c => {
            const actor = c.user_id === currentUser.id ? 'Agent' : 'Review';
            const doc   = documents.find(d => d.id === c.document_id);
            const tag   = doc
              ? DOC_TYPES.find(dt => dt.value === doc.type)?.label || ''
              : '';
            return {
              id:    c.id,
              actor,
              text:  c.text,
              time:  new Date(c.created_at).toLocaleString(),
              tag,
            };
          })
        );
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err.response?.data?.error || err.message);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [id, currentUser.id]);

  // Save edits back to API
  const handleSave = () => {
    const payload = {
      student_name: student.name,
      mobile:       student.mobile,
      email:        student.email,
      country:      student.country,
      state:        student.state,
      university:   student.university,
      course_name:  student.course,
      course_url:   student.courseUrl,
    };
    api.patch(`/applications/${student.id}`, payload)
      .then(res => {
        const upd = res.data;
        setStudent(s => ({
          ...s,
          name:       upd.student_name,
          mobile:     upd.mobile,
          email:      upd.email,
          country:    upd.country,
          state:      upd.state,
          university: upd.university,
          course:     upd.course_name,
          courseUrl:  upd.course_url,
          status:     upd.status,
        }));
        setEditing(false);
      })
      .catch(err =>
        alert('Failed to save changes: ' + (err.response?.data?.error || err.message))
      );
  };

  // Field change handler
  const handleFieldChange = e =>
    setStudent(s => ({ ...s, [e.target.name]: e.target.value }));

  // File change handler
  const onFileChange = (type, file) => {
    if (/\s/.test(file.name)) {
      alert('File names may not contain spaces. Please rename your file and try again.');
      return;
    }
    setFileInputs(fi => ({ ...fi, [type]: file }));
  };

  // Upload document
  const uploadDoc = (type) => {
    const file = fileInputs[type];
    if (!file) return alert('Please select a file first.');
    const form = new FormData();
    form.append('file', file);
    form.append('application_id', student.id);
    form.append('type', type);
    api.post('/documents', form, { headers: {'Content-Type':'multipart/form-data'} })
      .then(res => {
        const d = res.data;
        setDocs(ds => [...ds, {
          id:       d.id,
          type:     d.type,
          fileUrl:  d.file_url,
          fileName: file.name,
          status:   d.status,
        }]);
        setFileInputs(fi => { const c={...fi}; delete c[type]; return c; });
      })
      .catch(err => alert(err.response?.data?.error || err.message));
  };

  // Remove document
  const removeDoc = (docId) => {
    api.delete(`/documents/${docId}`)
      .then(() => setDocs(ds => ds.filter(d => d.id !== docId)))
      .catch(err => alert(err.response?.data?.error || err.message));
  };

  // Add comment (tag required)
  const addComment = () => {
    if (!commentTag) {
      return alert('Please select a document tag before commenting.');
    }
    if (!commentText.trim()) {
      return alert('Comment cannot be empty.');
    }
    const docValue = DOC_TYPES.find(d => d.label === commentTag).value;
    const doc      = docs.find(d => d.type === docValue);
    if (!doc) {
      return alert('Invalid document tag.');
    }
    api.post('/comments', {
      application_id: student.id,
      document_id:    doc.id,
      user_id:        currentUser.id,
      text:           commentText,
    })
    .then(res => {
      const c = res.data;
      setComments(cs => [
        ...cs,
        {
          id:    c.id,
          actor: 'Agent',
          text:  c.text,
          time:  new Date(c.created_at).toLocaleString(),
          tag:   commentTag,
        }
      ]);
      setCommentText('');
      setCommentTag('');
    })
    .catch(err => alert(err.response?.data?.error || err.message));
  };

  // Submit for review
  const submitForReview = () => {
    api.patch(`/applications/${student.id}`, { status: 'under_review' })
      .then(() => {
        // Navigate immediately to prevent state updates after unmount
        navigate('/agent/dashboard');
      })
      .catch(err => alert(err.response?.data?.error || err.message));
  };

  if (loading) {
    return (
      <AgentLayout userName={currentUser.name}>
        <div className="text-center py-20">Loading…</div>
      </AgentLayout>
    );
  }
  if (error || !student) {
    return (
      <AgentLayout userName={currentUser.name}>
        <div className="text-center py-20 text-red-600">
          {error || 'Student not found'}
        </div>
      </AgentLayout>
    );
  }

  return (
    <AgentLayout userName={currentUser.name}>
      {/* Header with Edit/Save */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer">
            <ChevronLeftIcon className="w-5 h-5" />
            <span className="ml-1">Back to Dashboard</span>
          </div>
          <h2 className="text-xl font-semibold ml-4">Student Profile</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setEditing(e => !e)}
            className="p-1 text-gray-500 hover:text-gray-800"
          >
            <PencilSquareIcon className="w-5 h-5" />
          </button>
          {editing && (
            <button
              onClick={handleSave}
              className="p-1 text-green-600 hover:text-green-800"
            >
              Save
            </button>
          )}
          <span className="inline-block bg-gray-100 text-gray-800 uppercase text-xs font-semibold px-3 py-1 rounded-full">
            {student.status}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Info, Uploaded Docs, Submit */}
        <div>
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Personal Info */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 mr-2" />
                    {editing ? (
                      <input
                        name="name"
                        value={student.name}
                        onChange={handleFieldChange}
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : (
                      <div>
                        <div className="text-xs uppercase">Full Name</div>
                        <div>{student.name}</div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    {editing ? (
                      <input
                        name="mobile"
                        value={student.mobile}
                        onChange={handleFieldChange}
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : (
                      <div>
                        <div className="text-xs uppercase">Mobile</div>
                        <div>{student.mobile}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-gray-600">
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  {editing ? (
                    <input
                      name="email"
                      value={student.email}
                      onChange={handleFieldChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    <div>
                      <div className="text-xs uppercase">Email</div>
                      <div>{student.email}</div>
                    </div>
                  )}
                </div>
              </div>
              {/* Location */}
              <div>
                <h4 className="font-semibold mb-2">Location</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                  {['country','state'].map(f => (
                    <div key={f} className="flex items-center">
                      <MapPinIcon className="w-5 h-5 mr-2" />
                      {editing ? (
                        <input
                          name={f}
                          value={student[f]}
                          onChange={handleFieldChange}
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : (
                        <div>
                          <div className="text-xs uppercase">{f}</div>
                          <div>{student[f]}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Academic */}
              <div>
                <h4 className="font-semibold mb-2">Academic Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                  <div className="flex items-center">
                    <AcademicCapIcon className="w-5 h-5 mr-2" />
                    {editing ? (
                      <input
                        name="university"
                        value={student.university}
                        onChange={handleFieldChange}
                        className="w-full border rounded px-2 py-1"
                      />
                    ) : (
                      <div>
                        <div className="text-xs uppercase">University</div>
                        <div>{student.university}</div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <BookOpenIcon className="w-5 h-5 mr-2" />
                    <div className="w-full">
                      <div className="text-xs uppercase">Course</div>
                      {editing ? (
                        <>
                          <input
                            name="course"
                            value={student.course}
                            onChange={handleFieldChange}
                            className="w-full border rounded px-2 py-1 mb-1"
                          />
                          <input
                            name="courseUrl"
                            value={student.courseUrl}
                            onChange={handleFieldChange}
                            placeholder="Course URL"
                            className="w-full border rounded px-2 py-1 text-xs"
                          />
                        </>
                      ) : (
                        <a
                          href={student.courseUrl}
                          className="underline hover:text-blue-600"
                        >
                          {student.course}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Documents */}
            <div>
              <h4 className="font-semibold mb-3">Uploaded Documents</h4>
              <ul className="space-y-2">
                {docs.length > 0 ? docs.map(d => (
                  <li key={d.id} className="flex items-center justify-between">
                    <div
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => setViewingDoc(d)}
                    >
                      <span className={`w-3 h-3 rounded-full ${statusDot(d.status)}`} />
                      <span className="underline text-gray-800">
                        {DOC_TYPES.find(dt => dt.value === d.type)?.label || d.type}
                      </span>
                    </div>
                    <button onClick={() => removeDoc(d.id)}>
                      <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  </li>
                )) : (
                  <li className="text-gray-500 italic">No documents uploaded yet.</li>
                )}
              </ul>
            </div>

            {/* Submit for Review */}
            {allRequired && (
              <div className="pt-4 border-t text-center">
                <button
                  onClick={submitForReview}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  Submit for Review
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Missing Docs & Team Communication */}
        <div className="space-y-6">
          {/* Missing Documents */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">All Documents</h3>
              <button onClick={() => setShowAllDocs(v => !v)}>
                {showAllDocs
                  ? <ChevronUpIcon className="w-5 h-5"/>
                  : <ChevronDownIcon className="w-5 h-5"/>}
              </button>
            </div>
            {showAllDocs && missingByGroup.map(({ group, types }) => types.length > 0 && (
              <div key={group} className="mb-4">
                <h4 className="font-semibold mb-2">{group}</h4>
                <div className="space-y-3">
                  {types.map(dt => (
                    <div key={dt.value} className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <span>{dt.label}</span>
                        {dt.required && <span className="text-yellow-500">*</span>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          onChange={e => onFileChange(dt.value, e.target.files[0])}
                          className="text-sm"
                        />
                        <button
                          onClick={() => uploadDoc(dt.value)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Team Communication */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Team Communication</h3>
            <hr className="mb-4" />

            <select
              value={commentTag}
              onChange={e => setCommentTag(e.target.value)}
              className="mb-4 border rounded-md p-2 w-full"
            >
              <option value="">— show all —</option>
              {DOC_TYPES.map(d => (
                <option key={d.value} value={d.label}>{d.label}</option>
              ))}
            </select>

            <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
              {comments
                .filter(c => !commentTag || c.tag === commentTag)
                .map(c => (
                  <div key={c.id} className="bg-gray-50 rounded-md p-3 flex justify-between">
                    <div>
                      <div className="text-xs font-semibold text-gray-500">
                        {c.tag} · {c.actor}
                      </div>
                      <div className="mt-1 text-sm">{c.text}</div>
                    </div>
                    <div className="text-xs text-gray-400">{c.time}</div>
                  </div>
                ))
              }
            </div>

            <textarea
              rows={3}
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Add your comment..."
              className="w-full border rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-200 mb-2"
            />
            <button
              onClick={addComment}
              disabled={!commentTag || !commentText.trim()}
              className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 disabled:opacity-50 transition"
            >
              Send Comment
            </button>
          </div>
        </div>
      </div>

      {/* File Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="relative bg-white rounded-lg w-full max-w-3xl h-full max-h-[90vh] p-4">
            <button
              onClick={() => setViewingDoc(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <XMarkIcon className="w-6 h-6"/>
            </button>
            <iframe
              src={viewingDoc.fileUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              className="border-none"
            >
              <p className="p-4">
                PDF preview not supported.{' '}
                <a href={viewingDoc.fileUrl} download className="text-blue-600 underline">
                  Download PDF
                </a>.
              </p>
            </iframe>
          </div>
        </div>
      )}
    </AgentLayout>
  );
}
