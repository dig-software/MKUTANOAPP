import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Who It's For" };

const benefitSections = [
  {
    id: "secretaries",
    emoji: "📋",
    tag: "For Secretaries",
    tagColor: "badge-green",
    heading: "Run your meetings like a pro",
    subtext: "Mkutano was designed first and foremost for the group secretary &mdash; the hardest-working volunteer in every savings group.",
    color: "bg-forest-50",
    accentColor: "text-forest-700",
    borderColor: "border-forest-200",
    benefits: [
      { title: "Open & close sessions in under 2 minutes", desc: "A guided session flow walks you through every step — attendance, contributions, loans, repayments — so nothing is missed." },
      { title: "Zero manual arithmetic", desc: "Savings totals, loan balances, and fund running totals are all calculated instantly and accurately." },
      { title: "Dispute-prevention confirmation screen", desc: "Before confirming, every entry is displayed for the whole group to verify. No more arguments after the meeting." },
      { title: "Works offline in any village", desc: "No internet? The app keeps working. Data saves locally and syncs the moment you're back online." },
      { title: "One-click meeting report PDF", desc: "Download a professional meeting summary to share with members, post on the noticeboard, or send to NGO partners." },
      { title: "Audit trail for accountability", desc: "Every action is logged. If a question arises weeks later, you have a clean record to refer to." },
    ],
  },
  {
    id: "members",
    emoji: "👩‍👩‍👧‍👦",
    tag: "For Group Members",
    tagColor: "badge-orange",
    heading: "Know exactly where your money is",
    subtext: "Group members deserve transparency. Mkutano gives each member her own wallet view — no more wondering about your savings.",
    color: "bg-earth-50",
    accentColor: "text-earth-700",
    borderColor: "border-earth-200",
    benefits: [
      { title: "Your personal savings wallet", desc: "See your total contributions this cycle, wallet balance, and savings history at a glance." },
      { title: "Live loan tracking", desc: "Know your outstanding loan balance, next repayment amount, and due date without asking the secretary." },
      { title: "Meeting notifications", desc: "Get reminders for upcoming meetings, overdue repayments, and when a new report is available." },
      { title: "Full contribution history", desc: "Scroll through every meeting you've attended, every shilling you've contributed, and every loan you've taken." },
      { title: "Simple, large-text interface", desc: "Mkutano is designed for low-digital-literacy users. Big buttons, clear labels, and minimal text." },
      { title: "Available in local languages", desc: "Support for Swahili, Luganda, Twi, and other local languages — coming soon." },
    ],
  },
  {
    id: "ngos",
    emoji: "🏢",
    tag: "For NGOs & MFIs",
    tagColor: "badge-red",
    heading: "Real-time group intelligence at scale",
    subtext: "Partner organizations gain live visibility into every group they support — without burdensome field visits.",
    color: "bg-terra-50",
    accentColor: "text-terra-700",
    borderColor: "border-terra-200",
    benefits: [
      { title: "Multi-group reporting dashboard", desc: "View performance metrics, savings totals, loan repayment rates, and member growth across all your partner groups." },
      { title: "Verified financial records", desc: "Mkutano's audit trail means every number is traceable. Use group data for loan applications with confidence." },
      { title: "Data export & API access", desc: "Export group data to CSV or Excel, or integrate with your existing MIS through our API." },
      { title: "Group health scoring", desc: "At-a-glance indicators show which groups are thriving and which need support — enabling proactive field officer visits." },
      { title: "Faster credit assessments", desc: "Groups with Mkutano records get credit decisions 40% faster than paper-record groups, on average." },
      { title: "Impact measurement tools", desc: "Track metrics like average savings per member, loan utilization rates, and repayment performance for donor reporting." },
    ],
  },
];

export default function BenefitsPage() {
  return (
    <div>
      <div className="py-16 bg-white text-center border-b border-sand-100">
        <div className="max-w-2xl mx-auto px-4">
          <span className="badge-green mb-4 inline-flex">Designed for Everyone</span>
          <h1 className="section-title">Who Mkutano is built for</h1>
          <p className="section-subtitle text-center mx-auto mt-3">
            Whether you run the meetings, attend them, or fund them — Mkutano has something powerful for you.
          </p>
        </div>
      </div>

      {benefitSections.map((s) => (
        <section key={s.id} id={s.id} className={`py-20 ${s.color}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <span className={`${s.tagColor} mb-3 inline-flex`}>{s.tag}</span>
                <div className="text-5xl mb-4">{s.emoji}</div>
                <h2 className={`text-3xl font-display font-bold mb-4 ${s.accentColor}`}>{s.heading}</h2>
                <p className="text-gray-600 leading-relaxed">{s.subtext}</p>
                <Link href="/signup" className="btn-primary mt-8 inline-flex">Get Started Free</Link>
              </div>
              <div className="space-y-4">
                {s.benefits.map((b) => (
                  <div key={b.title} className={`bg-white rounded-xl p-4 border ${s.borderColor}`}>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">✓ {b.title}</h4>
                    <p className="text-sm text-gray-500">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
