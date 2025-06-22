// src/components/review/StudentCard.jsx
import React from 'react';
import {
  PhoneIcon,
  AcademicCapIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const statusColors = {
  Active: 'bg-blue-500',
  'Under Review': 'bg-yellow-400',
  'Action Required': 'bg-orange-500',
  Approved: 'bg-green-400',
  Rejected: 'bg-red-500',
};

export default function StudentCard({ student }) {
  return (
    <div className="flex items-center">
      {/* 1/3 width: name + mobile */}
      <div className="flex-1">
        <h4 className="font-medium text-gray-800">{student.name}</h4>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <PhoneIcon className="w-4 h-4 mr-1" />
          <span>{student.mobile}</span>
        </div>
      </div>

      {/* 1/3 width: university, centered */}
      <div className="flex-1 flex items-center justify-center">
        <AcademicCapIcon className="w-4 h-4 mr-1 text-gray-400" />
        <span className="text-sm text-gray-500">
          {student.university}
        </span>
      </div>

      {/* 1/3 width: course, centered */}
      <div className="flex-1 flex items-center justify-center">
        <BookOpenIcon className="w-4 h-4 mr-1 text-gray-400" />
        <span className="text-sm text-gray-500">{student.course}</span>
      </div>

      {/* fixed width: status dot, right aligned */}
      <div className="flex-none flex items-center justify-end w-8">
        <span
          className={`inline-block w-3 h-3 rounded-full ${
            statusColors[student.status] || 'bg-gray-300'
          }`}
        />
      </div>
    </div>
  );
}
