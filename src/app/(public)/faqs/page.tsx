import FAQSection from "@/components/public/FAQSection";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "FAQs" };

export default function FAQsPage() {
  return (
    <>
      <div className="py-16 bg-white text-center border-b border-sand-100">
        <div className="max-w-2xl mx-auto px-4">
          <span className="badge-orange mb-4 inline-flex">Help Center</span>
          <h1 className="section-title">Frequently Asked Questions</h1>
          <p className="section-subtitle text-center mx-auto mt-3">
            Find answers to the most common questions about Mkutano.
          </p>
        </div>
      </div>
      <FAQSection />
      <div className="py-14 bg-white text-center">
        <p className="text-gray-500 text-sm">Still have questions?</p>
        <Link href="/contact" className="btn-primary mt-4 inline-flex">Contact Our Team</Link>
      </div>
    </>
  );
}
