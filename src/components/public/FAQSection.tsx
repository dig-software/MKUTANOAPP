"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "Does Mkutano work without internet?", a: "Yes! Mkutano is built offline-first. You can run a full meeting session — contributions, loans, repayments — with zero internet. All data is stored locally on the device, then synced automatically when connectivity is available." },
  { q: "What devices does Mkutano work on?", a: "Mkutano works on any modern web browser — Chrome, Firefox, Safari, Edge. It is optimized for tablets (like a 7-inch Android tablet) but also works on smartphones and desktops. No app download is required." },
  { q: "How do members view their own savings?", a: "Members with a member account can log in and view their personal wallet — total contributions, active loans, repayment schedule, and savings history. They cannot edit any group data." },
  { q: "Can NGOs or MFIs access group data?", a: "Yes. NGO and MFI partner organizations get a separate reporting dashboard. They can view aggregated group statistics, financial summaries, and download reports — without accessing individual member details." },
  { q: "Is our group's financial data secure?", a: "All data is encrypted at rest and in transit. Mkutano uses role-based access control — secretaries, members, NGOs, and admins each see only what they're authorized to see. A full audit log tracks every action." },
  { q: "How do we generate reports for our cycles?", a: "Reports are auto-generated at the end of each meeting. You can also generate monthly and annual reports from the Reports section. All reports can be downloaded as PDFs and shared via WhatsApp or email." },
  { q: "What happens if the secretary makes a mistake?", a: "All entries can be corrected before the session is confirmed. After confirmation, corrections require an admin override, which is logged in the audit trail. This ensures accountability without locking groups out when genuine errors occur." },
  { q: "How much does Mkutano cost?", a: "Mkutano offers a free tier for groups up to 20 members. Larger groups and NGO subscriptions are available on paid plans. Contact us for NGO bulk licensing and partner pricing." },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faqs" className="py-20 lg:py-28 bg-sand-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="badge-orange mb-3 inline-flex">FAQs</span>
          <h2 className="section-title">Common questions</h2>
          <p className="section-subtitle mx-auto text-center">
            Everything you need to know before getting started.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="card overflow-hidden !p-0">
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-sand-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
