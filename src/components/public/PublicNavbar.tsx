"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Leaf } from "lucide-react";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/benefits", label: "Who It's For" },
  { href: "/enterprise", label: "Enterprise" },
  { href: "/news", label: "News" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sand-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-forest-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-forest-700 transition-colors">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-gray-900">
              Mkutano
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-forest-700 hover:bg-forest-50 transition-all duration-150"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">Sign In</Link>
            <Link href="/signup" className="btn-primary text-sm !px-5 !py-2.5">
              Get Started Free
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {open && (
          <div className="md:hidden pb-4 border-t border-sand-100 pt-3 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-forest-50 hover:text-forest-700 transition-all"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-sand-100 mt-2">
              <Link href="/login" className="btn-ghost justify-center text-sm">Sign In</Link>
              <Link href="/signup" className="btn-primary justify-center text-sm">Get Started Free</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
