
import React, { useState } from 'react';
import Header from './components/Header';
import SuspectPage from './pages/SuspectPage';
import IncidentPage from './pages/IncidentPage';

export type Page = 'suspect' | 'incident';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('suspect');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        {currentPage === 'suspect' && <SuspectPage />}
        {currentPage === 'incident' && <IncidentPage />}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        نظام إدارة القضايا - تم إنشاؤه بواسطة مهندس frontend خبير
      </footer>
    </div>
  );
};

export default App;