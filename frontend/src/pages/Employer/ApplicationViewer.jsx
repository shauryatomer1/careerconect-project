import { useState, useEffect, useMemo } from "react";
import {
  Users,
  MapPin,
  Briefcase,
  Download,
  Eye,
  ArrowLeft,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { getInitials } from "../../utils/helper";
import Dashboardlayout from "../../components/layout/Dashboardlayout";
import StatusBadge from "../../components/StatusBadge";
import ApplicantProfilePreview from "../../components/Cards/ApplicantProfilePreview";

const ApplicationViewer = () => {
  const location = useLocation();
  const jobId = location.state?.jobId ?? null;
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId)
      );
      setApplications(response.data || []);
    } catch (err) {
      console.log("Failed to fetch applications", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) {
      navigate("/manage-jobs");
      return;
    }
    fetchApplications();
  }, [jobId, navigate]);

  const groupedApplications = useMemo(() => {
    const filtered = applications.filter((app) => app && app.job && app.job.title);
    return filtered.reduce((acc, app) => {
      const jId = app?.job?._id || app?.job?.title || "unknown";
      if (!acc[jId]) {
        acc[jId] = {
          job: app.job || {},
          applications: [],
        };
      }
      acc[jId].applications.push(app);
      return acc;
    }, {});
  }, [applications]);

  const handleDownloadResume = (maybeUrlOrApp) => {
    if (!maybeUrlOrApp) {
      alert("No resume available");
      return;
    }
    if (typeof maybeUrlOrApp === "object") {
      const url =
        maybeUrlOrApp.resumeUrl ||
        maybeUrlOrApp.applicant?.resume ||
        maybeUrlOrApp.applicant?.resumeUrl;
      if (!url) {
        alert("No resume available");
        return;
      }
      window.open(url, "_blank");
      return;
    }
    if (typeof maybeUrlOrApp === "string") {
      window.open(maybeUrlOrApp, "_blank");
      return;
    }
    alert("No resume available");
  };

  return (
    <Dashboardlayout activeMenu="manage-jobs">
      {loading && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div
              role="status"
              aria-live="polite"
              className="inline-flex flex-col items-center"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
              <p className="mt-4 text-gray-600 text-sm">Loading applications...</p>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <div className="min-h-screen bg-gray-50 pb-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <button
                  onClick={() => navigate("/manage-jobs")}
                  className="group flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-300 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span>Back</span>
                </button>

                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                    Applications Overview
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Review candidates who applied for your job postings
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
            {Object.keys(groupedApplications).length === 0 ? (
              <div className="text-center py-16">
                <Users className="mx-auto h-24 w-24 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No applications available
                </h3>
                <p className="mt-2 text-gray-500">
                  No applications found at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.values(groupedApplications).map(({ job, applications }) => (
                  <div key={job._id || job.title} className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Job Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-semibold text-white">
                            {job.title}
                          </h2>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-blue-100">
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location || "—"}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Briefcase className="h-4 w-4" />
                              <span>{job.type || "—"}</span>
                            </div>
                            <div className="text-sm">{job.category || "—"}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                            <span className="text-sm text-white font-medium">
                              {applications.length} Application{applications.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Only applicants list now (removed right panel) */}
                    <div className="p-6">
                      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Applicants</h3>
                        <div className="divide-y divide-gray-100">
                          {applications.map((app) => {
                            const applicant = app.applicant || {};
                            const appliedAt = (app.appliedAt || app.createdAt)
                              ? moment(app.appliedAt || app.createdAt).fromNow()
                              : "—";

                            return (
                              <div key={app._id} className="py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                  {applicant?.avatar ? (
                                    <img
                                      src={applicant.avatar}
                                      alt={applicant.name || "avatar"}
                                      className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700 flex-shrink-0">
                                      {getInitials(applicant.name || applicant.fullName || "NA")}
                                    </div>
                                  )}

                                  <div className="truncate">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                      {applicant.name || applicant.fullName || "No name"}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">{applicant.email || "No email"}</div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="text-xs text-gray-400 mr-2 hidden sm:block">{appliedAt}</div>
                                  <StatusBadge status={app.status || app.applicationStatus || "Applied"} />
                                  <button
                                    onClick={() => handleDownloadResume(app)}
                                    className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:shadow-sm transition"
                                    title="Download resume"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Resume
                                  </button>
                                  <button
                                    onClick={() => setSelectedApplicant(app)}
                                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition"
                                    title="View details"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedApplicant && (
        <ApplicantProfilePreview
          selectedApplicant={selectedApplicant}
          setSelectedApplicant={setSelectedApplicant}
          handleDownloadResume={(urlOrObj) => handleDownloadResume(urlOrObj)}
          handleClose={() => {
            setSelectedApplicant(null);
            fetchApplications();
          }}
        />
      )}
    </Dashboardlayout>
  );
};

export default ApplicationViewer;
