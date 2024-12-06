import React from 'react';

const Page = () => {
  return (
    <div className="bg-blue-800 text-white text-center">
      <nav className="flex justify-between text-center items-center p-4 overflow-hidden">
        {/* Navbar Title */}
        <h1 className="text-xl font-bold text-center">RBAC Dashboard</h1>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

       
        <div className="hidden md:flex space-x-6">
          {/* <a href="#" className="hover:text-gray-400">
            Home
          </a> */}
         
        </div>
      </nav>
    </div>
  );
};

export default Page;
