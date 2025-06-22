import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function ReviewLayout({ children, userName }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header role="Review Team" userName={userName} />

      {/* full-page gradient & centered content */}
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-blue-300">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
