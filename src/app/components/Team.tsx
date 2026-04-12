import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { Camera } from "lucide-react";

const team = [
  {
    name: "Tammy",
    role: "Owner & Lead Aesthetician",
    specialty: "Lash Extensions & Facials",
    image: "/images/team-tammy.jpg",
    bio: "With over a decade of experience, Tammy founded The Skin Cafe to create a space where beauty meets wellness. Her lash artistry is legendary — clients say you look like a normal woman with fabulous eyes.",
  },
  {
    name: "Starr Elsy",
    role: "Senior Specialist",
    specialty: "Lashes & Brows",
    image: "/images/team-starr.jpg",
    bio: "Known for her calming energy and delicate technique, Starr has been a client favorite for over 7 years. Her attention to detail and personalized approach keeps clients coming back.",
  },
  {
    name: "Chelsea",
    role: "Facial Specialist",
    specialty: "Luxury Facials & Peels",
    image: "/images/team-chelsea.jpg",
    bio: "Chelsea delivers what clients call 'the best facial ever.' Her expertise with advanced treatments and genuine care creates a truly pampering experience with visible results.",
  },
  {
    name: "Adriana",
    role: "Beauty Specialist",
    specialty: "Lashes, Brows & Facials",
    image: "/images/team-adriana.jpg",
    bio: "A true multi-talent, Adriana excels at lash extensions, brow design, and facial treatments. Her versatility and warm personality make every visit feel special.",
  },
  {
    name: "Cydnii",
    role: "Lash Artist",
    specialty: "Eyelash Extensions",
    image: "/images/team-cydnii.jpg",
    bio: "Cydnii combines expertise with efficiency, delivering flawless lash extensions with professionalism and a sweet personality that makes the process enjoyable.",
  },
];

export default function Team() {
  return (
    <section id="team" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream-dark/30 to-cream" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal className="text-center mb-16">
          <span className="text-champagne text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
            Our Artists
          </span>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-espresso mb-4">
            Meet the <span className="gradient-text">Experts</span>
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-mocha/70 max-w-2xl mx-auto">
            Our team of certified specialists brings passion, precision, and years of
            expertise to every treatment. Your beauty is in the best hands.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {team.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 100}>
              <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-espresso/8 transition-all duration-500 hover:-translate-y-2">
                {/* Team photo */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={member.image}
                    alt={`${member.name} — ${member.role}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  {/* Hover bio overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <p className="text-white/90 text-xs leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-[var(--font-display)] text-lg font-semibold text-espresso">
                    {member.name}
                  </h3>
                  <p className="text-champagne text-xs font-medium uppercase tracking-wider mb-1">
                    {member.role}
                  </p>
                  <p className="text-mocha/50 text-xs">{member.specialty}</p>
                </div>
                {/* Social link */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer">
                    <Camera size={14} />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
