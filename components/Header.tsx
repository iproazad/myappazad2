
import React from 'react';
import type { Page } from '../App';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const navLinkClasses = (page: Page) =>
    `px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors duration-300 ${
      currentPage === page
        ? 'bg-blue-600 text-white shadow-lg'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="bg-gray-800 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white">نظام التسجيل</h1>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setCurrentPage('suspect')}
              className={navLinkClasses('suspect')}
            >
              توماركرنا تومەتباری
            </button>
            <button
              onClick={() => setCurrentPage('incident')}
              className={navLinkClasses('incident')}
            >
              توماری ئاریشە
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;