import Link from "next/link";
import { FiHome, FiAlertTriangle } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50/50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center animate-pulse">
            <FiAlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-bold text-gray-800">
            Page not found
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Sorry, the page you are looking for has likely been moved or does not exist.
          </p>
        </div>

        <div className="pt-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-900 transition-all shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5"
          >
            <FiHome className="w-4 h-4" />
            Back to Home page
          </Link>
        </div>
      </div>
    </div>
  );
}
