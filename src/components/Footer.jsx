import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} SalesApp-Ravindu Eshan's. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <Link
            to="/#"
            className="text-gray-400 hover:text-white text-sm"
          >
            Privacy Policy
          </Link>
          <Link to="/#" className="text-gray-400 hover:text-white text-sm">
            Terms of Service
          </Link>
          <Link
            to="/#"
            className="text-gray-400 hover:text-white text-sm"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
