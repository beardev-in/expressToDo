import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl space-y-6">
        <h3 className="text-3xl font-bold text-center text-gray-800">
          Welcome to TaskyApp - Your Ultimate Productivity Companion!
        </h3>
        <div className="flex justify-center items-center space-x-4">
          <p className="text-lg text-gray-700">Want to be a user?</p>
          <Link to="/register">
            <Button className="bg-black text-white hover:bg-gray-800">Register</Button>
          </Link>
        </div>
        {/* <div className="flex justify-center items-center space-x-4">
          <p className="text-lg text-gray-700">Already a user?</p>
          <Link to="/login">
            <Button className="bg-black text-white hover:bg-gray-800">Login</Button>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Landing;