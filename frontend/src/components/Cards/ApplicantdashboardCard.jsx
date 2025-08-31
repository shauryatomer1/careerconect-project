import { Clock } from "lucide-react";

const ApplicantDashboardCard = ({ applicant, position, time }) => {
  // Safely get initials from the applicant's name
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const applicantName = applicant?.name || 'No Name';

  return (
    <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
      {/* Avatar */}
      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
        <span className="text-white font-medium text-sm">
          {getInitials(applicantName)}
        </span>
      </div>

      {/* Info (Flex-grow section with truncation) */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-800 truncate" title={applicantName}>
          {applicantName}
        </h4>
        <p className="text-xs text-gray-500 truncate" title={position}>
          {position}
        </p>
      </div>

      {/* Time */}
      <div className="flex-shrink-0 flex items-center space-x-1 text-xs text-gray-500">
        <Clock className="w-4 h-4" />
        <span>{time}</span>
      </div>
    </div>
  );
};

export default ApplicantDashboardCard;
