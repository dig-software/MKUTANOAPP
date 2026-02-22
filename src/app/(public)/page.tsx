import { HeroSection } from "@/components/public/HeroSection";
import FeaturesSection from "@/components/public/FeaturesSection";
import HowItWorks from "@/components/public/HowItWorks";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import FAQSection from "@/components/public/FAQSection";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Social proof banner */}
      <div className="bg-forest-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-white text-sm">
          {["🇰🇪 Kenya", "🇺🇬 Uganda", "🇹🇿 Tanzania", "🇬🇭 Ghana", "🇷🇼 Rwanda"].map((country) => (
            <span key={country} className="text-forest-100 font-medium">{country}</span>
          ))}
          <span className="text-forest-300 hidden sm:inline">|</span>
          <span className="text-forest-100 font-semibold">1,200+ groups trust Mkutano</span>
        </div>
      </div>

      <FeaturesSection />
      <HowItWorks />

      {/* Benefits split section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Built for the people who run the group</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: "📋",
                label: "Secretaries",
                color: "border-forest-200 bg-forest-50",
                accent: "text-forest-700",
                tagColor: "badge-green",
                benefits: [
                  "Run meetings 3x faster",
                  "No manual calculations",
                  "Instant PDF reports",
                  "Offline always works",
                  "Dispute prevention screen",
                  "Audit-proof records",
                ],
              },
              {
                emoji: "👩‍👩‍👧‍👦",
                label: "Group Members",
                color: "border-earth-200 bg-earth-50",
                accent: "text-earth-700",
                tagColor: "badge-orange",
                benefits: [
                  "Check my wallet anytime",
                  "See my loan balance",
                  "Review my savings history",
                  "Receive meeting reminders",
                  "Track my loan schedule",
                  "Trust the final numbers",
                ],
              },
              {
                emoji: "🏢",
                label: "NGOs & MFIs",
                color: "border-terra-200 bg-terra-50",
                accent: "text-terra-700",
                tagColor: "badge-red",
                benefits: [
                  "Dashboard across all groups",
                  "Exportable data reports",
                  "Loan disbursement tracking",
                  "Group performance analytics",
                  "Faster credit assessments",
                  "Verified financial records",
                ],
              },
            ].map((card) => (
              <div key={card.label} className={`rounded-2xl border-2 p-6 ${card.color}`}>
                <div className="text-4xl mb-3">{card.emoji}</div>
                <h3 className={`text-lg font-bold mb-4 ${card.accent}`}>{card.label}</h3>
                <ul className="space-y-2">
                  {card.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-forest-500 shrink-0">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <FAQSection />

      {/* Final CTA */}
      <section className="py-20 lg:py-28 gradient-hero">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title">Ready to transform your group meetings?</h2>
          <p className="section-subtitle mx-auto text-center mt-4">
            Join 1,200+ savings groups already using Mkutano. Free to start, simple to use, trusted to scale.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary text-base !px-8 !py-4">
              Create Your Group Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="btn-outline text-base !px-8 !py-4">
              Talk to Our Team
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-5">No credit card required · Works offline · Cancel anytime</p>
        </div>
      </section>
    </>
  );
}
