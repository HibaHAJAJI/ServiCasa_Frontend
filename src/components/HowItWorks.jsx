import {
  Search,
  UserCheck,
  CalendarCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Recherchez un artisan",
    description:
      "Choisissez une spécialité et une ville pour trouver les artisans disponibles près de chez vous.",
  },
  {
    number: "02",
    icon: UserCheck,
    title: "Choisissez votre artisan",
    description:
      "Consultez les informations de l’artisan et choisissez le professionnel qui correspond à votre besoin.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Réservez une intervention",
    description:
      "Envoyez votre demande et convenez de la date d’intervention avec l’artisan.",
  },
];

const HowItWorks = () => {
  return (
    <section id="comment-ca-marche" className="bg-slate-50 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[#0B1F3A]">
            Comment ça marche ?
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            Trouver un artisan qualifié avec ServiCasa est simple et rapide.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0B1F3A] text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="text-3xl font-bold text-slate-100">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-semibold text-[#0B1F3A]">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;