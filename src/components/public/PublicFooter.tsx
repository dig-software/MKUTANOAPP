import Link from "next/link";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Security", href: "/security" },
  ],
  "For Groups": [
    { label: "Secretaries", href: "/benefits#secretaries" },
    { label: "Group Members", href: "/benefits#members" },
    { label: "NGOs & MFIs", href: "/benefits#ngos" },
    { label: "Mobile App", href: "/mobile" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "FAQs", href: "/faqs" },
    { label: "News & Press", href: "/news" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function PublicFooter() {
  return (
    <footer className="gradient-footer text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-forest-500 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold">Mkutano</span>
            </div>
            <p className="text-forest-200 text-sm leading-relaxed max-w-xs">
              An offline-first savings group management system built for women's
              village savings and loan associations across Africa.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-forest-300">
                <Mail className="w-4 h-4" />
                <span>hello@mkutano.app</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-forest-300">
                <Phone className="w-4 h-4" />
                <span>+254 788191822</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-forest-300">
                <MapPin className="w-4 h-4" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-forest-300 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-forest-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-forest-400">
            © {new Date().getFullYear()} Mkutano. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-forest-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-forest-400 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
