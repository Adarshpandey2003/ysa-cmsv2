// src/components/agent/AddStudentModal.jsx
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function AddStudentModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    university: '',
    country: '',
    state: '',
    course: '',
    courseUrl: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // require name, mobile, email, university, country, course
    const { name, mobile, email, university, country, course } = form;
    if (!name || !mobile || !email || !university || !country || !course) {
      alert('Please fill all required fields.');
      return;
    }
    onAdd({ ...form, status: 'Draft', id: Date.now() });
    onClose();
    setForm({
      name: '',
      mobile: '',
      email: '',
      university: '',
      country: '',
      state: '',
      course: '',
      courseUrl: '',
    });
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile <span className="text-red-500">*</span>
            </label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          {/* University */}
          <div>
            <label className="block text-sm font-medium mb-1">
              University <span className="text-red-500">*</span>
            </label>
            <input
              name="university"
              value={form.university}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          {/* Country */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select Country</option>
              <option>United Kingdom</option>
              <option>United States</option>
              <option>Canada</option>
              <option>Australia</option>
            </select>
          </div>
          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          {/* Course Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Course Name <span className="text-red-500">*</span>
            </label>
            <input
              name="course"
              value={form.course}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          {/* Course URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Course URL</label>
            <input
              name="courseUrl"
              placeholder="https://university.edu/course"
              value={form.courseUrl}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end space-x-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
