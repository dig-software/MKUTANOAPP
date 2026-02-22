const steps = [
  {
    number: "01",
    color: "bg-forest-600",
    title: "Open the Meeting Session",
    desc: "The Secretary opens a new session, sets the date, venue, and records who is present. Works offline from the start.",
    detail: "Attendance is captured first — ensuring accurate per-session records even if someone joins late.",
  },
  {
    number: "02",
    color: "bg-earth-500",
    title: "Record Contributions",
    desc: "Go through each member one by one. Enter their share count, and Mkutano instantly calculates the shilling amount.",
    detail: "Social fund contributions, fines, and other fund types are all captured separately for clean accounting.",
  },
  {
    number: "03",
    color: "bg-terra-500",
    title: "Issue Loans & Log Repayments",
    desc: "Record any loan disbursements with interest rate and purpose. Then log repayments from previous loans.",
    detail: "Loan balances update instantly. Overdue loans are flagged automatically at the start of the next session.",
  },
  {
    number: "04",
    color: "bg-forest-700",
    title: "Confirm with the Dispute Screen",
    desc: "Before closing, a full summary screen shows every entry. The group can verify all numbers before signing off.",
    detail: "This single screen has eliminated disputes in 95% of groups using Mkutano. Trust built in real time.",
  },
  {
    number: "05",
    color: "bg-earth-600",
    title: "Close & Generate Report",
    desc: "Close the meeting session and Mkutano auto-generates the meeting report, ready to download as a PDF.",
    detail: "Reports include attendance, contributions by member, loans issued, repayments, and running fund balance.",
  },
  {
    number: "06",
    color: "bg-terra-600",
    title: "Sync When Online",
    desc: "When internet is available, all offline data syncs automatically to the cloud. A green badge confirms sync.",
    detail: "NGO partners and MFI lenders can view real-time dashboards once data is synced.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="badge-orange mb-3 inline-flex">Step by Step</span>
          <h2 className="section-title">How a Mkutano meeting works</h2>
          <p className="section-subtitle mx-auto text-center">
            Six simple steps that transform chaotic paper records into a clean digital trail — even in the village.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="relative card group hover:shadow-lg transition-all duration-200">
              <div className={`inline-flex w-11 h-11 rounded-xl items-center justify-center text-white font-bold text-sm mb-4 ${step.color}`}>
                {step.number}
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 right-0 w-6 text-sand-300 text-xl font-thin">→</div>
              )}
              <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{step.desc}</p>
              <p className="text-xs text-gray-400 italic border-t border-sand-100 pt-3">💡 {step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
