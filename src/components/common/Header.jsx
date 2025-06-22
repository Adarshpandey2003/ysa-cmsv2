// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/logo_new.png';

export default function Header({ role, userName }) {
  const navigate = useNavigate();
  const handleLogout = () => navigate('/');

  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src={logo} alt="YourStudyAbroad" className="h-8 w-8" />
          <span className="ml-2 text-xl font-bold text-gray-800">
            YourStudyAbroad
          </span>
          <span className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
            {role}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">{userName}</span>
          <ArrowRightOnRectangleIcon
            className="w-6 h-6 text-gray-700 cursor-pointer"
            onClick={handleLogout}
          />
        </div>
      </div>
    </header>
  );
}
