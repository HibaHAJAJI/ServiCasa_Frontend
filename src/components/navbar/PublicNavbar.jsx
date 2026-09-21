import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full h-[70px] bg-white border-b border-slate-200">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        <Link
          to="/"
          className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A]"
        >
          Servi<span className="text-red-500">Casa</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <Link
            to="/"
            className="text-[#0B1F3A] font-semibold hover:text-red-500 transition"
          >
            Accueil
          </Link>

          <a
            href="/#artisans"
            className="text-slate-600 font-medium hover:text-[#0B1F3A] transition"
          >
            Artisans
          </a>

          <a
            href="/#comment-ca-marche"
            className="text-slate-600 font-medium hover:text-[#0B1F3A] transition"
          >
            Comment ça marche
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <Link
            to="/login"
            className="text-[#0B1F3A] font-semibold hover:text-red-500 transition"
          >
            Se connecter
          </Link>

          <Link
            to="/register"
            className="bg-[#0B1F3A] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#132d52] transition"
          >
            S'inscrire
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[#0B1F3A] text-xl"
          aria-label="Menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg">
          <nav className="flex flex-col px-6 py-5 gap-4">

            <Link
              to="/"
              onClick={closeMenu}
              className="py-2 text-[#0B1F3A] font-semibold"
            >
              Accueil
            </Link>

            <a
              href="/#artisans"
              onClick={closeMenu}
              className="py-2 text-slate-600 font-medium"
            >
              Artisans
            </a>

            <a
              href="/#comment-ca-marche"
              onClick={closeMenu}
              className="py-2 text-slate-600 font-medium"
            >
              Comment ça marche
            </a>

            <div className="border-t border-slate-200 pt-4 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="py-2 text-[#0B1F3A] font-semibold"
              >
                Se connecter
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="text-center bg-[#0B1F3A] text-white font-semibold px-5 py-2.5 rounded-lg"
              >
                S'inscrire
              </Link>
            </div>

          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;