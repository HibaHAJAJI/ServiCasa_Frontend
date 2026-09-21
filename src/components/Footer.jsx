const Footer = () => {
  return (
    <footer className="bg-[#0B1F3A] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold">
              Servi<span className="text-red-500">Casa</span>
            </h2>

            <p className="mt-1 text-sm text-slate-300">
              Trouvez facilement un artisan qualifié près de chez vous.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-300">
            <a href="/" className="transition hover:text-white">
              Accueil
            </a>

            <a href="/artisans" className="transition hover:text-white">
              Artisans
            </a>

            <a href="/#comment-ca-marche" className="transition hover:text-white">
              Comment ça marche
            </a>
          </nav>
        </div>
        <div className="mt-6 border-t border-slate-700 pt-4 text-center">
          <p className="text-xs text-slate-400">
            © 2026 ServiCasa. Tous droits réservés.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;