import {
  ArrowLeft,
  Bookmark,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import JobCard from "../../components/Cards/JobCard";
import toast from "react-hot-toast";

const SavedJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedJobList, setSavedJobList] = useState([]);

  const getSavedJobs = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
      setSavedJobList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to load saved jobs");
    }
  };

  const handelUnsaveJob = async (jobId) => {
    try {
      await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
      toast.success("Job unsaved successfully!");
      setSavedJobList((prev) =>
        prev.filter((savedJob) => savedJob?.job?._id !== jobId)
      );
    } catch (err) {
      toast.error("Something went wrong! Try again later");
    }
  };

  useEffect(() => {
    if (user) {
      getSavedJobs();
    }
  }, [user]);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="container mx-auto pt-24">
        {savedJobList && (
          <div className="bg-white p-6 rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="group flex items-center space-x-2 px-3.5 py-2.5 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </button>
                <h1 className="text-lg lg:text-xl font-semibold leading-tight text-gray-900">
                  Saved Jobs
                </h1>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-0 pb-8 space-y-8">
              {savedJobList.length === 0 ? (
                <div className="text-center py-16 lg:py-20 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20">
                  <div className="text-gray-400 mb-6">
                    <Bookmark className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold mb-3 text-gray-900">
                    You haven't saved any jobs yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start saving jobs that interest you to view them later.
                  </p>
                  <button
                    onClick={() => navigate("/find-jobs")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6">
                  {savedJobList.map((savedJob) => (
                    <JobCard
                      key={savedJob?.job?._id}
                      job={savedJob?.job}
                      onClick={() => navigate(`/jobs/${savedJob?.job._id}`)}
                      onToggleSave={() => handelUnsaveJob(savedJob?.job._id)}
                      saved
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
