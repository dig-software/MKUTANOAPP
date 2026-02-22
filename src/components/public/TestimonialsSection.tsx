const testimonials = [
  {
    name: "Grace Wanjiku",
    role: "Group Secretary",
    village: "Kangemi, Nairobi",
    initials: "GW",
    color: "bg-forest-200 text-forest-800",
    quote: "Before Mkutano, I spent two hours after every meeting doing calculations on paper. Now I close the session and the report is ready in seconds. My members trust the numbers more than ever.",
    stars: 5,
  },
  {
    name: "Fatuma Hassan",
    role: "Group Member",
    village: "Mombasa, Kenya",
    initials: "FH",
    color: "bg-earth-200 text-earth-800",
    quote: "I can check my wallet balance any time. I know exactly how much I have saved, how much my loan is, and when I need to repay. No more waiting to ask the secretary.",
    stars: 5,
  },
  {
    name: "Dr. Amina Osei",
    role: "Program Officer",
    village: "CARE Ghana, Accra",
    initials: "AO",
    color: "bg-terra-200 text-terra-800",
    quote: "We deployed Mkutano across 45 groups in 3 districts. The reporting dashboard saves our field officers dozens of hours per month. The offline capability is a game-changer for rural areas.",
    stars: 5,
  },
  {
    name: "Mary Achieng",
    role: "Group Member & Treasurer",
    village: "Kisumu, Kenya",
    initials: "MA",
    color: "bg-forest-200 text-forest-800",
    quote: "The confirmation screen before we close the meeting has stopped all our arguments. Everyone sees the same numbers and approves them together. There is peace in our group now.",
    stars: 5,
  },
  {
    name: "John Kamau",
    role: "MFI Field Officer",
    village: "Equity Foundation, Kenya",
    initials: "JK",
    color: "bg-earth-200 text-earth-800",
    quote: "The PDF reports are exactly what we need for loan assessments. Groups using Mkutano get faster loan approvals because their records are clean, consistent, and verifiable.",
    stars: 5,
  },
  {
    name: "Beatrice Otieno",
    role: "Group Chair",
    village: "Eldoret, Kenya",
    initials: "BO",
    color: "bg-terra-200 text-terra-800",
    quote: "Even our less educated members can use it. The screen is simple — big buttons, their photo, their amount. No confusion. Our meetings now finish in half the time.",
    stars: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="badge-green mb-3 inline-flex">Real Stories</span>
          <h2 className="section-title">Trusted by groups across Africa</h2>
          <p className="section-subtitle mx-auto text-center">
            From rural village halls to NGO program offices &mdash; here&apos;s what real users say.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card-hover flex flex-col">
              <div className="flex text-earth-400 gap-0.5 mb-4 text-lg">
                {"★".repeat(t.stars)}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed flex-1 italic">&quot;{t.quote}&quot;</p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-sand-100">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role} · {t.village}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-14 bg-forest-700 rounded-3xl p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
          {[
            { value: "1,200+", label: "Groups Active" },
            { value: "21,000+", label: "Members" },
            { value: "KES 85M+", label: "Savings Tracked" },
            { value: "98%", label: "Secretary Satisfaction" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-display font-bold">{s.value}</p>
              <p className="text-forest-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
