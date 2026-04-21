import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { ArrowRight } from "lucide-react";

const featured = [
  {
    name: "Tamara Reinelt",
    role: "Owner & Aesthetician",
    experience: "16 years",
    image: "/images/Tamara.jpg",
    focal: "65% 25%",
  },
  {
    name: "Dr. Laree Hooker",
    role: "Medical Director",
    experience: "Nearly 13 years",
    image: "/images/team-placeholder.jpg",
    focal: "50% 50%",
  },
  {
    name: "Starr Elsy",
    role: "Aesthetician",
    experience: "Career aesthetician",
    image: "/images/Star.jpg",
    focal: "55% 28%",
  },
  {
    name: "Chelsea Lang",
    role: "Aesthetician",
    experience: "Medical background",
    image: "/images/Chelsea.jpg",
    focal: "52% 22%",
  },
];

export default function TeamTeaser() {
  return (
    <section id="team" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream-dark/30 to-cream" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal className="text-center mb-14">
          <span className="text-champagne text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
            Our Artists
          </span>
          <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-espresso mb-4">
            Meet a Few of the <span className="gradient-text">Experts</span>
          </h2>
          <div className="section-divider mx-auto mb-6" />
          <p className="text-mocha/70 max-w-2xl mx-auto">
            Decades of combined experience across skin, lashes, brows, hair,
            and aesthetic medicine. Every person on our team is here because
            they love this craft.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featured.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 100}>
              <Link
                href="/team"
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-espresso/8 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={member.image}
                    alt={`${member.name} — ${member.role}`}
                    fill
                    style={{ objectPosition: member.focal }}
                    className="object-cover scale-[1.35] group-hover:scale-[1.45] transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/50 via-transparent to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="font-[var(--font-display)] text-lg font-semibold text-espresso group-hover:text-champagne transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-champagne text-xs font-medium uppercase tracking-wider mb-1">
                    {member.role}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full bg-champagne/10 border border-champagne/30 text-espresso text-[11px] font-semibold tracking-wide">
                    {member.experience}
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center">
          <Link
            href="/team"
            className="btn-shimmer inline-flex items-center gap-2 bg-gradient-to-r from-champagne to-champagne-dark text-white px-8 py-4 rounded-full text-base font-semibold hover:shadow-2xl hover:shadow-champagne/30 hover:-translate-y-0.5 transition-all"
          >
            Meet the whole team
            <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
