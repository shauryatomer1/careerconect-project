import { useEffect, useState } from "react";
import {
  Plus,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Dashboardlayout from "../../components/layout/Dashboardlayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import JobDashboardCard from "../../components/Cards/JobdashboardCard";
import ApplicantDashboardCard from "../../components/Cards/ApplicantdashboardCard";

const Card = ({ title, headerAction, subtitle, children }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {(title || headerAction) && (
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
          <div>
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

/* StatCard styled to match screenshot:
   - full colored background (gradient-like)
   - white text
   - icon in a subtle white/20 badge on the right
   - number large on left with small title & trend below
*/
const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
  const bgClasses = {
    blue: "bg-gradient-to-br from-blue-500 to-blue-600",
    green: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    purple: "bg-gradient-to-br from-violet-500 to-violet-600",
  };

  return (
    <div className={`${bgClasses[color]} rounded-2xl p-6 flex justify-between items-center text-white`}>
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        {trend && (
          <div className="flex items-center text-xs mt-3 opacity-90">
            <TrendingUp className="h-4 w-4 mr-2 text-white/90" />
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center">
        <Icon className="h-6 w-6 text-white/95" />
      </div>
    </div>
  );
};

const EmployerDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDashboardOverview = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      // you can replace with better logging
      console.error("Error fetching dashboard overview", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dashboardlayout activeMenu="employer-dashboard">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-7xl mx-auto space-y-8 mb-32">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Active Jobs"
              value={dashboardData?.counts?.totalActiveJobs ?? 0}
              icon={Briefcase}
              trend={true}
              trendValue={`${dashboardData?.counts?.trends?.activeJobs ?? 0}%`}
              color="blue"
            />
            <StatCard
              title="Total Applicants"
              value={dashboardData?.counts?.totalApplications ?? 0}
              icon={Users}
              trend={true}
              trendValue={`${dashboardData?.counts?.trends?.applicants ?? 0}%`}
              color="green"
            />
            <StatCard
              title="Hired"
              value={dashboardData?.counts?.totalHired ?? 0}
              icon={CheckCircle2}
              trend={true}
              trendValue={`${dashboardData?.counts?.trends?.totalHired ?? 0}%`}
              color="purple"
            />
          </div>

          {/* Recent Jobs & Applications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card
              title="Recent Job Posts"
              subtitle="Your latest job postings"
              headerAction={
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => navigate("/manage-jobs")}
                >
                  View all
                </button>
              }
            >
              <div className="space-y-3">
                {dashboardData?.data?.recentJobs?.slice(0, 3)?.map((job, index) => (
                  <JobDashboardCard key={index} job={job} />
                ))}
              </div>
            </Card>

            <Card
              title="Recent Applications"
              subtitle="Latest candidate applications"
              headerAction={
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => navigate("/manage-jobs")}
                >
                  View all
                </button>
              }
            >
              <div className="space-y-3">
                {dashboardData?.data?.recentApplications?.slice(0, 3)?.map((data, index) => (
                  <ApplicantDashboardCard
                    key={index}
                    applicant={data?.applicant || ""}
                    position={data?.job?.title || ""}
                    time={moment(data?.appliedAt).fromNow()}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions  */}
          {/*
          <Card title="Quick Actions" subtitle="Common tasks to get you started">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Post New Job",
                  icon: Plus,
                  color: "bg-blue-50 text-blue-700",
                  path: "/post-job",
                },
                {
                  title: "Review Applications",
                  icon: Users,
                  color: "bg-green-50 text-green-700",
                  path: "/manage-jobs",
                },
                {
                  title: "Company Settings",
                  icon: Building2,
                  color: "bg-orange-50 text-orange-700",
                  path: "/company-profile",
                },
              ].map((action, index) => (
                <button
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all duration-200 text-left"
                  onClick={() => navigate(action.path)}
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-gray-900">{action.title}</span>
                </button>
              ))}
            </div>
          </Card>
          */}
        </div>
      )}
    </Dashboardlayout>
  );
};

export default EmployerDashboard;
