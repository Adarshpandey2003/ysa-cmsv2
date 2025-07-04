// src/components/common/Modal.jsx
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}                /* close when clicking backdrop */
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-6 relative"
        onClick={e => e.stopPropagation()} /* prevent backdrop click */
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
}
