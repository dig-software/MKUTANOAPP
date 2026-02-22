import {
  WifiOff, FileText, PieChart, Users, ShieldAlert, Bell,
  Download, ClipboardList, Wallet, Lock, RefreshCw, BarChart2
} from "lucide-react";

const features = [
  { icon: ClipboardList, color: "bg-forest-100 text-forest-600", title: "Meeting Session Manager", desc: "Open a session, record attendance, track every shilling contributed per member in real time." },
  { icon: WifiOff, color: "bg-earth-100 text-earth-600", title: "Offline-First Capture", desc: "No internet? No problem. Capture all data offline and sync automatically when connectivity returns." },
  { icon: Wallet, color: "bg-terra-100 text-terra-600", title: "Member Savings Wallets", desc: "Each member has a live wallet showing their savings total and outstanding loans." },
  { icon: FileText, color: "bg-forest-100 text-forest-600", title: "Loan Issuance & Tracking", desc: "Record loan disbursements, terms, and purposes. Track repayments session by session." },
  { icon: ShieldAlert, color: "bg-earth-100 text-earth-600", title: "Dispute Prevention Screen", desc: "A confirmation screen shows totals per member before finalizing — reducing errors and disputes." },
  { icon: PieChart, color: "bg-terra-100 text-terra-600", title: "Auto Financial Reports", desc: "Generate meeting summaries, monthly statements, and cycle-end reports automatically. Download as PDF." },
  { icon: Download, color: "bg-forest-100 text-forest-600", title: "Downloadable PDFs", desc: "Share meeting minutes and reports with members, NGO partners, or MFI lenders in one click." },
  { icon: BarChart2, color: "bg-earth-100 text-earth-600", title: "Analytics Dashboard", desc: "Visual charts of savings trends, loan repayment rates, and fund growth over time." },
  { icon: Users, color: "bg-terra-100 text-terra-600", title: "Member Registry", desc: "Full member directory with photos, national IDs, contact details, and contribution history." },
  { icon: RefreshCw, color: "bg-forest-100 text-forest-600", title: "Sync Status Indicator", desc: "Always know your data state — synced, pending, or offline — with a visible colored badge." },
  { icon: Bell, color: "bg-earth-100 text-earth-600", title: "Notifications & Alerts", desc: "Get alerts for overdue loans, upcoming meetings, completed syncs, and new reports." },
  { icon: Lock, color: "bg-terra-100 text-terra-600", title: "Audit Trail Logs", desc: "Every action is logged with timestamp, actor, and details. Full accountability, zero disputes." },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="badge-green mb-3 inline-flex">12 Powerful Features</span>
          <h2 className="section-title">Everything your group needs</h2>
          <p className="section-subtitle mx-auto text-center">
            From first contribution to final report — Mkutano covers the entire savings group lifecycle.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="card-hover group">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
