import { Briefcase } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-purple-200 flex items-center justify-center flex-col space-y-6">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 to border-t-blue-600 mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center ">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <p className="text-gray-600 font-medium">
        Finding amazing opportunities...
      </p>
    </div>
  )
}

export default LoadingSpinner