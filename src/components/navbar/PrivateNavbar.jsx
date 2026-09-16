import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const PrivateNavbar = () => {
  return (
    <header className="h-[70px] w-full bg-[#0B1F3A] border-b border-slate-800 fixed top-0 left-0 z-40 flex items-center justify-between px-6 shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-white">
          Servi<span className="text-red-500">Casa</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/artisan/profile"
          className="flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-lg border border-white/10"
        >
          <FaUserCircle className="text-xl text-slate-300" />
          <span>Mon profil</span>
        </Link>
      </div>
    </header>
  );
};

export default PrivateNavbar;