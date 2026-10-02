import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Activity,
  ArrowRight,
  Gavel,
  ClipboardCheck,
  Search,
  Clock3,
  FileText,
  BadgeCheck,
  GitBranch,
  Home as HomeIcon,
  Headphones,
  Lock,
  IndianRupee,
  Stamp,
  CheckCircle2,
  UserCheck,
  ClipboardList,
  PackageCheck,
} from "lucide-react";

/* ================= BRAND TOKENS =================
  paper      #FAF6EC  warm deed-paper background
  ink        #1B2622  near-black ink for body text
  primary    #0E4D46  deep ledger-green (registry ink)
  primaryDk  #0A3733
  primaryLt  #15736A
  gold       #B8862B  brass seal
  goldLt     #D9A94A
  maroon     #8B3232  stamp red, used sparingly
================================================== */

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF6EC] font-[Inter]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-[#0E4D46]/20 bg-[#0A3733]/97 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#B8862B] text-[#0A3733] shadow-lg shadow-black/20">
              <Stamp size={22} />
            </div>
            <div className="font-display text-xl font-semibold tracking-tight">
              <span className="text-[#D9A94A]">Estate</span>
              <span className="text-white">Sync</span>
            </div>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <Link to="/" className="font-medium text-[#D9A94A]">Home</Link>
            <Link to="/services" className="font-medium text-white/75 transition hover:text-white">Services</Link>
            <a href="#how-it-works" className="font-medium text-white/75 transition hover:text-white">How It Works</a>
            <Link to="/support" className="font-medium text-white/75 transition hover:text-white">Support</Link>
            <Link to="/dashboard/user" className="font-medium text-white/75 transition hover:text-white">Track Application</Link>
          </div>

          <Link
            to="/services"
            className="hidden items-center gap-2 rounded-full bg-[#B8862B] px-5 py-3 font-semibold text-[#0A3733] shadow-lg shadow-black/20 transition hover:bg-[#D9A94A] sm:flex"
          >
            Start My Request
            <ArrowRight size={18} />
          </Link>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <header className="relative overflow-hidden bg-[#0A3733] px-6 pb-24 pt-20">
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=60')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A3733] via-[#0A3733]/95 to-[#0A3733]" />
        <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#B8862B]/10 blur-[130px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* LEFT */}
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D9A94A]/40 bg-[#D9A94A]/10 px-4 py-2 text-sm font-semibold tracking-wide text-[#D9A94A]">
                <Stamp size={16} />
                THE EASIEST WAY TO HANDLE PROPERTY WORK
              </div>

              <h1 className="font-display mb-7 text-5xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Property Work?
                <span className="block text-[#D9A94A]">Done From Home.</span>
              </h1>

              <p className="mb-9 max-w-2xl text-lg leading-8 text-white/65 sm:text-xl">
                No more standing in long lines or visiting government offices
                multiple times. A verified local agent handles your paperwork,
                start to finish, while you track every step from your phone.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/services"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#B8862B] px-8 py-4 text-lg font-semibold text-[#0A3733] shadow-xl shadow-black/25 transition-all hover:-translate-y-1 hover:bg-[#D9A94A]"
                >
                  Start My Request
                  <ArrowRight size={21} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10"
                >
                  <Activity size={20} />
                  See What We Do
                </Link>
              </div>

              <div className="mt-7 flex items-center gap-2 text-sm text-white/55">
                <ShieldCheck size={19} className="text-[#D9A94A]" />
                Trusted by 5,000+ customers across India
              </div>
            </div>

            {/* RIGHT — mock application certificate */}
            <div className="relative">
              <div className="relative rounded-3xl border border-white/10 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-dashed border-[#E6DCC3] px-7 py-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#8A8272]">
                      Application Status
                    </p>
                    <p className="font-mono mt-1 text-sm font-semibold text-[#0E4D46]">
                      GPW-2026-04521
                    </p>
                  </div>
                  <div className="flex h-16 w-16 -rotate-12 items-center justify-center rounded-full border-2 border-dashed border-[#B8862B] text-[#B8862B]">
                    <div className="text-center leading-none">
                      <CheckCircle2 size={18} className="mx-auto mb-0.5" />
                      <span className="text-[9px] font-bold tracking-tight">VERIFIED</span>
                    </div>
                  </div>
                </div>

                <div className="px-7 py-6">
                  <p className="text-sm font-semibold text-[#1B2622]">
                    Property Registration — Flat No. 402, Sunrise Residency
                  </p>
                  <p className="mt-1 text-xs text-[#8A8272]">Agent: R. Shetty · Filed 3 days ago</p>

                  <div className="mt-6 space-y-4">
                    {[
                      { label: "Request Filed", done: true },
                      { label: "Office Visit Completed", done: true },
                      { label: "Registrar Approval", done: false, active: true },
                      { label: "Certificate Delivered", done: false },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                            step.done
                              ? "bg-[#0E4D46] text-white"
                              : step.active
                              ? "border-2 border-[#B8862B] text-[#B8862B]"
                              : "border-2 border-[#E6DCC3] text-[#E6DCC3]"
                          }`}
                        >
                          {step.done ? <CheckCircle2 size={14} /> : <div className="h-2 w-2 rounded-full bg-current" />}
                        </div>
                        <span className={`text-sm ${step.done ? "text-[#1B2622]" : step.active ? "font-semibold text-[#0E4D46]" : "text-[#8A8272]"}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-b-3xl bg-[#FAF6EC] px-7 py-4">
                  <span className="text-xs text-[#8A8272]">Updated live — no repeat calls needed</span>
                  <Search size={16} className="text-[#0E4D46]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= IMAGE STRIP ================= */}
      <section className="bg-[#FAF6EC] px-6 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=60", label: "Residential Plots" },
            { url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=60", label: "Apartments" },
            { url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=60", label: "Ownership Transfer" },
            { url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=60", label: "Commercial Property" },
          ].map((img, i) => (
            <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src={img.url}
                alt={img.label}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              <span className="absolute bottom-3 left-3 text-sm font-semibold text-white">{img.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="bg-white px-6 py-20" id="services">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="font-mono mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B8862B]">
              Our Services
            </p>
            <h2 className="font-display text-4xl font-semibold text-[#1B2622] sm:text-5xl">
              We handle all types of property work
            </h2>
            <p className="mt-4 text-lg text-[#6B6656]">
              Simple, reliable and professional property assistance.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <ServiceCard icon={<FileText />} title="Property" subtitle="Registration" />
            <ServiceCard icon={<BadgeCheck />} title="Encumbrance" subtitle="Certificate" />
            <ServiceCard icon={<GitBranch />} title="Khata" subtitle="Transfer" />
            <ServiceCard icon={<HomeIcon />} title="Mutation" subtitle="Services" />
            <ServiceCard icon={<FileText />} title="NOC" subtitle="Services" />
            <ServiceCard icon={<Gavel />} title="And Many" subtitle="More..." />
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="bg-[#FAF6EC] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="font-mono mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#B8862B]">
              How It Works
            </p>
            <h2 className="font-display text-4xl font-semibold text-[#1B2622] sm:text-5xl">
              Four steps. Zero office visits.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <StepCard number="01" icon={<ClipboardList size={24} />} title="Submit Request" text="Tell us what you need and upload your documents online in minutes." />
            <StepCard number="02" icon={<UserCheck size={24} />} title="Agent Assigned" text="A verified local expert who knows your area takes on your case." />
            <StepCard number="03" icon={<Gavel size={24} />} title="Office Visit & Filing" text="We stand in the queues, file the paperwork, and follow up for you." />
            <StepCard number="04" icon={<PackageCheck size={24} />} title="Certificate Delivered" text="Get notified the moment it's ready — no repeated calls needed." />
          </div>
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="font-display text-4xl font-semibold text-[#1B2622] sm:text-5xl">
              Why EstateSync?
            </h2>
            <p className="mt-4 text-lg text-[#6B6656]">
              We remove the chaos from property management.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <ValueCard icon={<ClipboardCheck size={28} />} title="Professional Liaison" text="Our agents handle physical visits and application filing at government and municipal offices for you." />
            <ValueCard icon={<Gavel size={28} />} title="Legal Verification" text="Get reliable property verification and local expert assistance before making important property decisions." />
            <ValueCard icon={<Activity size={28} />} title="Live Status Updates" text="Know exactly where your application stands without repeatedly calling agents or visiting offices." />
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-[#0A3733] px-6 py-10">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
          <Feature icon={<Headphones />} title="Expert Support" text="Local experts at your service" />
          <Feature icon={<Lock />} title="100% Secure" text="Your documents are safe with us" />
          <Feature icon={<IndianRupee />} title="Transparent Pricing" text="No hidden charges" />
          <Feature icon={<ShieldCheck />} title="Trusted Service" text="Reliable property assistance" />
        </div>
      </section>

      {/* ================= PRICING (styled as a receipt) ================= */}
      <section className="bg-[#0A3733] px-6 py-16">
        <div className="mx-auto max-w-md">
          <div
            className="relative rounded-2xl bg-[#FAF6EC] px-8 py-8 shadow-2xl"
            style={{
              maskImage:
                "radial-gradient(circle at 0 0, transparent 8px, black 8.5px), radial-gradient(circle at 100% 0, transparent 8px, black 8.5px)",
            }}
          >
            <p className="font-mono text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#8A8262]">
              Fee Schedule
            </p>
            <h4 className="font-display mt-2 text-center text-2xl font-semibold text-[#1B2622]">
              Transparent Pricing
            </h4>

            <div className="my-6 border-t border-dashed border-[#D8CFB3]" />

            <div className="space-y-4 font-mono text-sm">
              <div className="flex items-center justify-between text-[#1B2622]">
                <span>Platform Fee</span>
                <span className="font-semibold text-[#0E4D46]">₹499</span>
              </div>
              <div className="flex items-center justify-between text-[#1B2622]">
                <span>Agent Commission</span>
                <span className="font-semibold text-[#0E4D46]">3%</span>
              </div>
            </div>

            <div className="my-6 border-t border-dashed border-[#D8CFB3]" />

            <p className="text-center text-xs text-[#8A8262]">
              No hidden charges. Quality service shouldn't be expensive.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ================= SERVICE CARD ================= */
function ServiceCard({ icon, title, subtitle }) {
  return (
    <Link
      to="/services"
      className="group relative rounded-2xl border border-[#EFE9D8] bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-2 hover:border-[#D9A94A]/40 hover:shadow-xl"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0E4D46]/8 text-[#0E4D46] transition-all group-hover:bg-[#0E4D46] group-hover:text-white">
        {icon}
      </div>
      <h3 className="font-semibold text-[#1B2622]">{title}</h3>
      <p className="text-sm text-[#8A8262]">{subtitle}</p>
    </Link>
  );
}

/* ================= STEP CARD ================= */
function StepCard({ number, icon, title, text }) {
  return (
    <div className="relative rounded-2xl border border-[#EFE9D8] bg-white p-7">
      <span className="font-mono absolute right-5 top-5 text-2xl font-semibold text-[#EFE4C6]">
        {number}
      </span>
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0E4D46] text-white">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-[#1B2622]">{title}</h3>
      <p className="text-sm leading-6 text-[#6B6656]">{text}</p>
    </div>
  );
}

/* ================= VALUE CARD ================= */
function ValueCard({ icon, title, text }) {
  return (
    <div className="group rounded-[2rem] border border-[#EFE9D8] bg-[#FAF6EC] p-10 transition-all hover:-translate-y-2 hover:shadow-2xl">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0E4D46]/8 text-[#0E4D46] transition-all group-hover:bg-[#0E4D46] group-hover:text-white">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-[#1B2622]">{title}</h3>
      <p className="leading-relaxed text-[#6B6656]">{text}</p>
    </div>
  );
}

/* ================= FEATURE ================= */
function Feature({ icon, title, text }) {
  return (
    <div className="flex items-center gap-4 md:border-r md:border-white/10 md:pr-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#D9A94A]/15 text-[#D9A94A]">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-sm text-white/55">{text}</p>
      </div>
    </div>
  );
}