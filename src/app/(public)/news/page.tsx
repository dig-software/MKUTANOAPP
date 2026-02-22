import type { Metadata } from "next";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = { title: "News & Press" };

const articles = [
  {
    id: 1,
    tag: "Product Update",
    tagColor: "badge-green",
    title: "Mkutano 2.0: Full offline sync and PDF reporting now live",
    date: "2026-02-10",
    author: "Mkutano Team",
    excerpt: "We are excited to announce Mkutano 2.0, which brings full offline-first data capture, automatic cloud sync, and one-click PDF generation for all meeting reports.",
  },
  {
    id: 2,
    tag: "Partnership",
    tagColor: "badge-orange",
    title: "Mkutano partners with CARE International for 200-group rollout in Ghana",
    date: "2026-01-22",
    author: "Communications",
    excerpt: "CARE Ghana has selected Mkutano as the digital platform for its Village Savings and Loan Association program, covering 200 groups across the Ashanti and Brong-Ahafo regions.",
  },
  {
    id: 3,
    tag: "Impact",
    tagColor: "badge-red",
    title: "How Maendeleo wa Wanawake group reduced meeting time by 68%",
    date: "2025-12-18",
    author: "Field Reports",
    excerpt: "A case study from Kangemi, Nairobi shows how a group of 18 women transformed their savings meetings after switching from paper records to Mkutano.",
  },
  {
    id: 4,
    tag: "Research",
    tagColor: "badge-green",
    title: "New report: Digital VSLA tools increase loan repayment rates by 23%",
    date: "2025-11-30",
    author: "Research Team",
    excerpt: "Our analysis of 450 groups over 12 months found that groups using digital tracking tools like Mkutano had significantly higher repayment rates than paper-based groups.",
  },
  {
    id: 5,
    tag: "Event",
    tagColor: "badge-orange",
    title: "Mkutano presents at Africa FinTech Summit 2025, Kigali",
    date: "2025-10-14",
    author: "Events",
    excerpt: "Our co-founder presented Mkutano at the Africa FinTech Summit, highlighting the unique challenges of offline-first finance for rural women's groups.",
  },
  {
    id: 6,
    tag: "Feature",
    tagColor: "badge-green",
    title: "Introducing the NGO Partner Dashboard: real-time group intelligence at scale",
    date: "2025-09-05",
    author: "Product Team",
    excerpt: "NGOs and MFIs can now monitor all their partner groups from a single dashboard — savings trends, loan repayment rates, and group health scores in real time.",
  },
];

export default function NewsPage() {
  return (
    <div>
      <div className="py-16 bg-white text-center border-b border-sand-100">
        <div className="max-w-2xl mx-auto px-4">
          <span className="badge-green mb-4 inline-flex">Latest Updates</span>
          <h1 className="section-title">News & Press</h1>
          <p className="section-subtitle text-center mx-auto mt-3">
            Product updates, impact stories, research, and announcements from the Mkutano team.
          </p>
        </div>
      </div>

      <section className="py-16 bg-sand-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <div key={a.id} className="card-hover flex flex-col">
                <span className={`${a.tagColor} mb-3 self-start`}>{a.tag}</span>
                <h2 className="text-base font-semibold text-gray-900 mb-2 flex-1">{a.title}</h2>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{a.excerpt}</p>
                <div className="flex items-center justify-between pt-3 border-t border-sand-100 text-xs text-gray-400">
                  <span>{a.author}</span>
                  <span>{formatDate(a.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press contact */}
      <section className="py-14 bg-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Media inquiries</h3>
          <p className="text-gray-500 text-sm mb-4">
            For press coverage, partnerships, or speaking requests, contact our communications team.
          </p>
          <Link href="/contact" className="btn-primary inline-flex">Get in Touch</Link>
        </div>
      </section>
    </div>
  );
}
