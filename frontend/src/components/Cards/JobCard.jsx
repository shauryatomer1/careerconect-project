import { Bookmark, Building, Building2, Calendar, MapPin } from "lucide-react";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
// import StatusBadge from "../StatusBadge";

const JobCard = ({ job, onClick, onToggleSave, onApply, saved, hideApply }) => {
  const { user } = useAuth();

  const formatSalary = (min, max) => {
    const formatNumber = (num) => {
      if (!num) return "N/A";
      if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
      return `$${num}`;
    };
    return `${formatNumber(min)}${max ? ` - ${formatNumber(max)}` : ""}/m`;
  };

  if (!job) return null; // safety guard

  return (
    <div
      className="flex flex-col justify-between bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-xl hover:shadow-gray-200 transition-all duration-300 relative cursor-pointer min-h-[280px]"
      onClick={onClick}
    >
      {/* Top Section */}
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4">
            {job?.company?.companyLogo ? (
              <img
                src={job.company.companyLogo}
                alt="Company Logo"
                className="w-14 h-14 object-cover rounded-2xl border border-white/20 shadow-lg"
              />
            ) : (
              <div className="w-14 h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                {job?.title || "Untitled Job"}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                <Building className="w-3.5 h-3.5" />
                {job?.company?.companyName || "Unknown Company"}
              </p>
            </div>
          </div>

          {/* Save Button */}
          {user && (
            <button
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave();
              }}
            >
              <Bookmark
                className={`w-5 h-5 transition-colors ${
                  job?.isSaved || saved
                    ? "fill-blue-600 text-blue-600"
                    : "text-gray-400 hover:text-blue-600"
                }`}
              />
            </button>
          )}
        </div>

        {/* Job Meta */}
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {job?.location && (
              <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
            )}

            {job?.type && (
              <span
                className={`px-3 py-1 rounded-full font-medium text-xs ${
                  job.type === "Full-Time"
                    ? "bg-green-100 text-green-800"
                    : job.type === "Part-Time"
                    ? "bg-yellow-100 text-yellow-800"
                    : job.type === "Contract"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {job.type}
              </span>
            )}

            {job?.category && (
              <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                {job.category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section (Footer) */}
      <div className="flex items-center justify-between text-xs font-medium text-gray-500 pt-4 border-t border-gray-100 mt-auto">
        {/* Left side: Date + Salary stacked */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {job?.createdAt ? moment(job.createdAt).format("Do MMM YYYY") : "N/A"}
          </div>
          <div className="text-sm font-semibold text-blue-600">
            {formatSalary(job?.salaryMin, job?.salaryMax)}
          </div>
        </div>

        {/* Right side: Apply button / Status */}
        <div className="flex items-center gap-4">
          {!saved && (
            <>
              {job?.applicationStatus ? (
                // <StatusBadge status={job?.applicationStatus} />
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {job.applicationStatus}
                </span>
              ) : (
                !hideApply && (
                  <button
                    className="bg-gradient-to-r from-blue-50 to-blue-50 text-sm text-blue-700 hover:text-white px-6 py-2.5 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 font-semibold transform hover:-translate-y-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      onApply();
                    }}
                  >
                    Apply Now
                  </button>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
