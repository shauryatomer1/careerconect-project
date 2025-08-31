import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  X,
  Trash2,
  ChevronUp,
  ChevronDown,
  Users,
  Check,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Dashboardlayout from "../../components/layout/Dashboardlayout";

const ManageJobs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;

  // Jobs state
  const [jobs, setJobs] = useState([]);

  // Filter + sort
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // normalize undefined/null and numeric sort for applicants
      if (sortField === "applicants") {
        aValue = Number(aValue || 0);
        bValue = Number(bValue || 0);
      } else {
        aValue = aValue ?? "";
        bValue = bValue ?? "";
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [jobs, searchTerm, statusFilter, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedJobs.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredAndSortedJobs.slice(startIndex, startIndex + itemsPerPage);

  // keep currentPage valid when filters change / results shrink
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // reset to page 1 when search or status or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Toggle job status
  const handleStatusChange = async (jobId) => {
    try {
      await axiosInstance.put(API_PATHS.JOBS.TOGGLE_CLOSE(jobId));
      // refresh but don't show loader
      getPostedJobs(true);
    } catch (error) {
      console.error("Error toggling job status: Please try again", error);
    }
  };

  // Delete job
  const handleDeleteJob = async (jobId) => {
    try {
      await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(jobId));
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      toast.success("Job listing deleted successfully");
    } catch (error) {
      console.error("Error deleting job: Please try again", error);
    }
  };

  // Sort icon
  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  // Loading skeleton row
  const LoadingRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </td>
    </tr>
  );

  // Fetch jobs
  const getPostedJobs = async (disableLoader = false) => {
    setIsLoading(!disableLoader);
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER);
      if (response.status === 200 && response.data?.length > 0) {
        const formattedJobs = response.data.map((job) => ({
          // ensure id is present — use _id fallback if needed
          id: job._id || job.id,
          title: job.title,
          company: job.company?.name || "—",
          status: job.isClosed ? "Closed" : "Active",
          applicants: job.applicationCount || 0,
          datePosted: moment(job.createdAt).format("DD-MM-YYYY"),
          logo: job.company?.companyLogo,
        }));
        setJobs(formattedJobs);
      } else {
        // no jobs or empty array — clear
        setJobs([]);
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data?.message || error.response);
      } else {
        console.error("Error fetching jobs: Please try again", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // compute user-friendly start/end for results row
  const resultsStart = filteredAndSortedJobs.length === 0 ? 0 : startIndex + 1;
  const resultsEnd = Math.min(startIndex + itemsPerPage, filteredAndSortedJobs.length);

  return (
    <Dashboardlayout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-row items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Job Management</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your job postings and track applications</p>
            </div>

            <button
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap"
              onClick={() => navigate("/post-job")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Job
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/5 border border-white/20 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 placeholder-gray-400"
                />
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Results Summary */}
              <div className="my-4">
                <p className="text-sm text-gray-600">
                  Showing {paginatedJobs.length} of {filteredAndSortedJobs.length} jobs
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/5 border border-white/20 p-6 overflow-hidden">
            {filteredAndSortedJobs.length === 0 && !isLoading ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="w-[75vw] md:w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-300">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                    <tr>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100/60 transition-all duration-200 min-w-[200px]"
                        onClick={() => handleSort("title")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Job Title</span>
                          <SortIcon field="title" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100/60 transition-all duration-200 min-w-[120px]"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Status</span>
                          <SortIcon field="status" />
                        </div>
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100/60 transition-all duration-200 min-w-[120px]"
                        onClick={() => handleSort("applicants")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Applicants</span>
                          <SortIcon field="applicants" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[180px]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading
                      ? Array.from({ length: 5 }).map((_, index) => <LoadingRow key={index} />)
                      : paginatedJobs.map((job) => (
                          <tr key={job.id} className="hover:bg-gray-50 transition-all duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                <div className="text-sm text-gray-500">{job.company}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${
                                  job.status === "Active"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    : "bg-gray-100 text-gray-800 border border-gray-200"
                                }`}
                              >
                                {job.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                type="button"
                                className="flex items-center text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                                onClick={() => navigate("/applicants", { state: { jobId: job.id } })}
                              >
                                <Users className="w-4 h-4 mr-1" />
                                {job.applicants}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {/*
                                <button
                                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 focus:outline-none transition-all duration-200"
                                  onClick={() => {
                                    // Diagnostic & guard before navigating
                                    console.log("Edit clicked for job id:", job.id);
                                    if (job?.id) {
                                      // navigate to route with id and send job in state
                                      navigate(`/edit-job/${job.id}`, { state: { job } });
                                    } else {
                                      toast.error("Cannot open editor: job id is missing");
                                    }
                                  }}
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </button>
                                */}
                                <button
                                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg ${
                                    job.status === "Active"
                                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                      : "bg-green-100 text-green-800 hover:bg-green-200"
                                  } focus:outline-none transition-all duration-200`}
                                  onClick={() => handleStatusChange(job.id)}
                                >
                                  {job.status === "Active" ? (
                                    <>
                                      <X className="w-4 h-4 mr-1" />
                                      Close
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-4 h-4 mr-1" />
                                      Reopen
                                    </>
                                  )}
                                </button>
                                <button
                                  className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-800 hover:bg-red-200 text-xs font-medium rounded-lg focus:outline-none transition-all duration-200"
                                  onClick={() => handleDeleteJob(job.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredAndSortedJobs.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{resultsStart}</span> to{" "}
                  <span className="font-medium">{resultsEnd}</span> of{" "}
                  <span className="font-medium">{filteredAndSortedJobs.length}</span> results
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dashboardlayout>
  );
};

export default ManageJobs;
