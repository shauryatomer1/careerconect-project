import React from "react";
import { motion } from "framer-motion";  
import { Briefcase } from "lucide-react";  // 🔴 removed Link (icon)
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; 

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth(); 
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CareerConnect</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => navigate("/find-jobs")}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium" // ✏ fixed typo "font-meidium"
            >
              Find Jobs
            </button>
            <button
              onClick={() =>
                navigate(
                  isAuthenticated && user?.role === "employer"
                    ? "/employer-dashboard"
                    : "/login"
                )
              }
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              For Employers
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700 font-medium">
                  Welcome {user?.name || "User"} 👋
                </span>
                <button
                  onClick={() =>
                    navigate(
                      user?.role === "employer"
                        ? "/employer-dashboard"
                        : "/find-jobs"
                    )
                  }
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Dashboard
                </button>

                <button
                  onClick={logout} // 🟢 added logout
                  className="text-gray-600 hover:text-red-600 transition-colors font-medium px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}; 

export default Header;
