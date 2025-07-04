// src/pages/review/StudentProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReviewLayout from '../../layouts/ReviewLayout';
import api from '../../utils/api';
import {
  ChevronLeftIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

export default function ReviewStudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  const [viewingUrl, setViewingUrl]     = useState('');
  const [showChat, setShowChat]         = useState(false);
  const [chatComments, setChatComments] = useState([]);
  const [commentTag, setCommentTag]     = useState('');
  const [chatText, setChatText]         = useState('');

  const currentUser = JSON.parse(localStorage.getItem('ysa_user') || '{}');

  // 1) load application + docs on mount
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    api.get(`/applications/${id}`)
      .then(res => {
        if (!isMounted) return;
        const { application, documents } = res.data;
        setStudent({
          id: application.id,
          student_name: application.student_name,
          mobile: application.mobile,
          email: application.email,
          country: application.country,
          state: application.state,
          university: application.university,
          course: application.course_name,
          courseUrl: application.course_url,
          status: ({
            draft: 'Draft',
            active: 'Active',
            under_review: 'Under Review',
            action_required: 'Action Required',
            approved: 'Approved',
            rejected: 'Rejected',
          }[application.status] || application.status),
          docs: documents.map(d => ({
            id: d.id,
            type: d.type,
            fileUrl: d.file_url,
            status: d.status, // pending | approved | rejected
          })),
        });
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
  }, [id]);

  // 2) fetch all tagged comments when chat opens
  useEffect(() => {
    if (!showChat) return;
    
    let isMounted = true;
    api.get(`/applications/${id}`)
      .then(res => {
        if (!isMounted) return;
        const tagged = res.data.comments.filter(c => c.document_id);
        setChatComments(tagged.map(c => ({
          id: c.id,
          document_id: c.document_id,
          author: c.author,
          text: c.text,
          time: new Date(c.created_at).toLocaleString(),
        })));
      })
      .catch(err => {
        if (!isMounted) return;
        console.error(err);
      });

    return () => {
      isMounted = false;
    };
  }, [showChat, id]);

  const statusDot = st =>
    st === 'approved' ? 'bg-green-500'
  : st === 'pending'  ? 'bg-blue-500'
                       : 'bg-red-500';

  if (loading) {
    return (
      <ReviewLayout userName="Review Manager">
        <div className="text-center py-20">Loading…</div>
      </ReviewLayout>
    );
  }
  if (error || !student) {
    return (
      <ReviewLayout userName="Review Manager">
        <div className="text-center py-20 text-red-600">
          {error || 'Student not found'}
        </div>
      </ReviewLayout>
    );
  }

  const allApproved = student.docs.every(d => d.status === 'approved');
  const hasRejected = student.docs.some(d => d.status === 'rejected');

  // document handlers
  const approveDoc = docId => {
    api.patch(`/documents/${docId}`, { status: 'approved' })
      .then(() => {
        setStudent(s => ({
          ...s,
          docs: s.docs.map(d =>
            d.id === docId ? { ...d, status: 'approved' } : d
          ),
        }));
      })
      .catch(err => {
        if (!isMounted) return;
        alert(err.response?.data?.error || err.message);
      });
  };
  const rejectDoc = docId => {
  // first, update status on the server
  api.patch(`/documents/${docId}`, { status: 'rejected' })
    .then(() => {
      // reflect in local state
      setStudent(s => ({
        ...s,
        docs: s.docs.map(d =>
          d.id === docId ? { ...d, status: 'rejected' } : d
        ),
      }));
      // now open the comment chat panel
      setCommentTag(String(docId));
      setChatText('');
      setShowChat(true);
      setViewingUrl('');
    })
    .catch(err => alert(err.response?.data?.error || err.message));
  };

  const submitComment = () => {
    if (!commentTag) {
      return alert('Please select a document to tag this comment.');
    }
    if (!chatText.trim()) {
      return alert('Comment cannot be empty.');
    }
    api.post('/comments', {
      application_id: student.id,
      document_id: Number(commentTag),
      user_id: currentUser.id,
      text: chatText,
    })
      .then(res => {
        const c = res.data;
        setChatComments(cc => [
          ...cc,
          {
            id: c.id,
            document_id: c.document_id,
            author: currentUser.name,
            text: c.text,
            time: new Date(c.created_at).toLocaleString(),
          },
        ]);
        setStudent(s => ({
          ...s,
          docs: s.docs.map(d =>
            d.id === c.document_id ? { ...d, status: 'rejected' } : d
          ),
        }));
        setChatText('');
      })
      .catch(err => alert(err.response?.data?.error || err.message));
  };

  // application handlers with redirect
  const sendToAction = () =>
    api.patch(`/applications/${student.id}`, { status: 'action_required' })
      .then(() => {
        setStudent(s => ({ ...s, status: 'Action Required' }));
        navigate('/review/dashboard');
      });

  const approveApp = () =>
    api.patch(`/applications/${student.id}`, { status: 'approved' })
      .then(() => {
        setStudent(s => ({ ...s, status: 'Approved' }));
        navigate('/review/dashboard');
      });

  const rejectApp = () =>
    api.patch(`/applications/${student.id}`, { status: 'rejected' })
      .then(() => {
        setStudent(s => ({ ...s, status: 'Rejected' }));
        navigate('/review/dashboard');
      });

  return (
    <ReviewLayout userName="Review Manager">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Link
            to="/review/dashboard"
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span className="ml-1">Back to Dashboard</span>
          </Link>
          <h2 className="text-xl font-semibold ml-4">Student Profile</h2>
        </div>
        <span className="inline-block bg-yellow-100 text-yellow-800 uppercase text-xs font-semibold px-3 py-1 rounded-full">
          {student.status}
        </span>
      </div>

      {/* info + docs */}
      <div className="bg-white rounded-lg shadow p-6 space-y-8">
        {/* student info */}
        <div>
          <h3 className="text-lg font-medium mb-4">Student Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-600">
            {[
              ['Full Name', student.student_name],
              ['Mobile', student.mobile],
              ['Email', student.email],
              ['Country', student.country],
              ['State', student.state],
              ['University', student.university],
            ].map(([label, value]) => (
              <div key={label} className="space-y-1">
                <div className="uppercase text-xs text-gray-500">{label}</div>
                <div className="text-gray-800">{value}</div>
              </div>
            ))}
            <div className="space-y-1 sm:col-span-2 lg:col-span-3">
              <div className="uppercase text-xs text-gray-500">Course</div>
              <a
                href={student.courseUrl}
                className="underline text-gray-800 hover:text-blue-600"
              >
                {student.course}
              </a>
            </div>
          </div>
        </div>

        {/* uploaded docs */}
        <div>
          <h3 className="text-lg font-medium mb-4">Uploaded Documents</h3>
          <div className="space-y-4">
            {student.docs.map(d => (
              <div
                key={d.id}
                className="flex items-center justify-between bg-gray-50 rounded-md p-4"
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-3 h-3 rounded-full ${statusDot(d.status)}`} />
                  <div>
                    <div className="font-medium">{d.type}</div>
                    <div className="text-sm text-gray-600">
                      {d.fileUrl.split('/').pop()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setViewingUrl(d.fileUrl)}>
                    <EyeIcon className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                  </button>
                  <a href={d.fileUrl} download className="text-gray-600 hover:text-gray-800">
                    <ArrowDownTrayIcon className="w-5 h-5" />
                  </a>
                  <button onClick={() => approveDoc(d.id)} disabled={d.status==='approved'}>
                    <CheckIcon className="w-5 h-5 text-green-600" />
                  </button>
                  <button onClick={() => rejectDoc(d.id)}>
                    <XMarkIcon className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* application actions */}
        <div className="text-right">
          {hasRejected ? (
            <button
              onClick={sendToAction}
              className="bg-orange-500 text-white px-5 py-2 rounded-md hover:bg-orange-600"
            >
              Send to Action Required
            </button>
          ) : (
            <>
              <button
                onClick={approveApp}
                disabled={!allApproved}
                className={`${
                  allApproved
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-green-300 cursor-not-allowed'
                } text-white px-5 py-2 rounded-md`}
              >
                Approve Application
              </button>
              <button
                onClick={rejectApp}
                className="ml-3 bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700"
              >
                Reject Application
              </button>
            </>
          )}
        </div>
      </div>

      {/* chat toggle */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </button>

      {/* chat panel */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
          <div className="w-full max-w-sm bg-white h-full p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">Team Communication</h4>
              <button onClick={() => setShowChat(false)}>
                <XMarkIcon className="w-6 h-6 text-gray-600 hover:text-gray-800" />
              </button>
            </div>
            {/* doc selector */}
            <select
              value={commentTag}
              onChange={e => setCommentTag(e.target.value)}
              className="mb-4 border rounded-md p-2"
            >
              <option value="">Select document to tag</option>
              {student.docs.map(d => (
                <option key={d.id} value={d.id}>{d.type}</option>
              ))}
            </select>
            {/* comments */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {chatComments
                .filter(c =>
                  !commentTag ? true : c.document_id === Number(commentTag)
                )
                .map(c => {
                  const doc = student.docs.find(d => d.id === c.document_id);
                  return (
                    <div key={c.id} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold">
                          {doc?.type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-gray-400">{c.time}</span>
                      </div>
                      <div className="text-sm font-medium">{c.author}</div>
                      <div className="mt-1">{c.text}</div>
                    </div>
                  );
                })}
            </div>
            {/* new comment */}
            <textarea
              rows={3}
              value={chatText}
              onChange={e => setChatText(e.target.value)}
              placeholder="Type your comment..."
              className="border rounded-md p-3 mb-4 focus:outline-none focus:ring"
            />
            <button
              onClick={submitComment}
              disabled={!commentTag || !chatText.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Send Comment
            </button>
          </div>
        </div>
      )}

      {/* PDF viewer */}
      {viewingUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg overflow-hidden w-full max-w-3xl h-full max-h-[90vh]">
            <button
              onClick={() => setViewingUrl('')}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <object data={viewingUrl} type="application/pdf" width="100%" height="100%">
              <p className="p-4">
                Cannot preview PDF.{' '}
                <a href={viewingUrl} download className="text-blue-600 underline">
                  Download
                </a>
              </p>
            </object>
          </div>
        </div>
      )}
    </ReviewLayout>
  );
}
