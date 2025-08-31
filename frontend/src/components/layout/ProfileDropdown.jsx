import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  userRole,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Avatar trigger only */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center p-1 rounded-xl hover:ring-2 hover:ring-blue-200 transition"
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="h-12 w-12 object-cover rounded-xl"  // ✅ bigger & squarish
          />
        ) : (
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center rounded-xl">
            <span className="text-white font-semibold text-lg">
              {companyName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-2">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{companyName}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>

          <button
            onClick={() =>
              navigate(userRole === "jobseeker" ? "/profile" : "/company-profile")
            }
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View Profile
          </button>

          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={onLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
