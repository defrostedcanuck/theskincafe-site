import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { Camera } from "lucide-react";

const team = [
  {
    name: "Tamara Reinelt",
    role: "Owner & Aesthetician",
    specialty: "Lashes, Brows & Advanced Skin",
    experience: "16 years as an aesthetician",
    image: "/images/Tamara.jpg",
    focal: "65% 25%",
    bio: "Passionate about making every person feel special and beautiful. Tamara brings 16 years of aesthetics experience to advanced lash work, microblading, medical-grade peels, and microneedling — every visit feels personal and creative.",
    acceptingClients: true,
  },
  {
    name: "Dr. Laree Hooker",
    role: "Medical Director",
    specialty: "Aesthetic Medicine & Anti-Aging",
    experience: "Nearly 13 years in aesthetics",
    image: "/images/team-placeholder.jpg",
    focal: "50% 50%",
    bio: "Naturopathic doctor and aesthetic medicine expert who has overseen multiple clinics as medical director. She has personally trained hundreds of healthcare professionals in botox, dermal fillers, and cosmetic lasers — and believes knowledge is meant to be shared.",
    acceptingClients: true,
  },
  {
    name: "Starr Elsy",
    role: "Aesthetician",
    specialty: "Lashes, Brows & Facials",
    experience: "Career aesthetician",
    image: "/images/Star.jpg",
    focal: "55% 28%",
    bio: "A former graphic designer who pivoted into aesthetics after her own skin journey. Starr is certified in classic + volume lashes, microneedling, dermaplane, TrueBrow™ Level 2, and medical-grade peels — and takes pride in watching clients gain confidence.",
    acceptingClients: true,
  },
  {
    name: "Chelsea Lang",
    role: "Aesthetician",
    specialty: "Facials & Peels",
    experience: "Medical background",
    image: "/images/Chelsea.jpg",
    focal: "52% 22%",
    bio: "Blends her healthcare foundation with the art of skincare to deliver treatments that are both restorative and results-driven. Certified in microneedling, dermaplane, and Skin Script / PCA / Perfect Peel protocols.",
    acceptingClients: true,
  },
  {
    name: "Cydnii Cherny",
    role: "Aesthetician",
    specialty: "Skincare & Lashes",
    experience: "Licensed aesthetician",
    image: "/images/Cyndii.jpg",
    focal: "58% 22%",
    bio: "Discovered her passion for skincare through her own journey and loves walking clients through theirs. Certified in dermaplane, lash lift & tint, and PCA peels.",
    acceptingClients: true,
  },
  {
    name: "Kathy Chen",
    role: "Cosmetologist & Lash Artist",
    specialty: "Classic & Volume Lashes",
    experience: "8 years as a lash artist",
    image: "/images/kathy.jpg",
    focal: "60% 28%",
    bio: "Eight years of focus on a single craft — beautifully executed classic and volume lashes customized to each client. Also a licensed cosmetologist and fine-line tattoo artist.",
    acceptingClients: true,
  },
  {
    name: "Olivia Richardson",
    role: "Aesthetician",
    specialty: "Sugaring & Waxing",
    experience: "Since 2022",
    image: "/images/olivia.jpg",
    focal: "52% 22%",
    bio: "Sugaring and waxing specialist who has traveled to open and train new franchise locations. Certified in Brazilian sugaring and waxing, dermaplaning, microdermabrasion, chemical peels, lash lifts, and brow laminations.",
    acceptingClients: true,
  },
  {
    name: "Tasha Scott",
    role: "Hair Stylist",
    specialty: "Cut & Color",
    experience: "Since 2003",
    image: "/images/Tasha.jpg",
    focal: "48% 28%",
    bio: "Serving Arizona clients since 2003. Tasha blends creativity with world-class care, continually training in the latest trends and classic techniques.",
    acceptingClients: false,
  },
];

interface TeamProps {
  /** Hide the internal section header (use when a page-level hero already provides title + intro). */
  showHeader?: boolean;
}

export default function Team({ showHeader = true }: TeamProps = {}) {
  return (
    <section id="team" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream-dark/30 to-cream" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {showHeader && (
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
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 100}>
              <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-espresso/8 transition-all duration-500 hover:-translate-y-2">
                {/* Team photo */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={member.image}
                    alt={`${member.name} — ${member.role}`}
                    fill
                    style={{ objectPosition: member.focal }}
                    className="object-cover scale-[1.35] group-hover:scale-[1.45] transition-transform duration-700"
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  {/* Hover bio overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <p className="text-white/90 text-xs leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                  {/* Not-accepting-clients badge */}
                  {!member.acceptingClients && (
                    <div className="absolute top-3 left-3 bg-espresso/80 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      Booked Full
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-[var(--font-display)] text-lg font-semibold text-espresso">
                    {member.name}
                  </h3>
                  <p className="text-champagne text-xs font-medium uppercase tracking-wider mb-1">
                    {member.role}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-2 mb-2 px-2.5 py-1 rounded-full bg-champagne/10 border border-champagne/30 text-espresso text-[11px] font-semibold tracking-wide">
                    {member.experience}
                  </span>
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
