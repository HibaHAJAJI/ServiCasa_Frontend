import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-3 max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          404 Page Not Found
        </h1>
        <p className="text-sm text-slate-500">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        <div className="pt-4">
          <Link
            to="/profile"
            className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs"
          >
            Return to website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;