"use client";
import Link from "next/link";
import { ArrowRight, Building2, Zap, TrendingUp, Users, DollarSign, BarChart3 } from "lucide-react";

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-white">
      {/* Navbar */}
      <nav className="border-b border-sand-200 sticky top-0 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-display font-bold text-forest-600">
            Mkutano Enterprise
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Community Login
            </Link>
            <Link href="/enterprise" className="text-forest-600 font-semibold">
              Enterprise
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-forest-100 text-forest-700 rounded-full mb-6">
            <Zap className="w-4 h-4" />
            <span className="font-medium">Financial Inclusion at Scale</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
            Empower Communities<br />
            <span className="text-gradient">Through Institutional Lending</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Connect NGO funding programs with microfinance institutions to reach grassroots savings groups and MSMEs across Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/enterprise/ngo-login" className="btn-primary text-base !px-8 !py-4 inline-flex items-center justify-center gap-2">
              NGO Platform
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/enterprise/mfi-login" className="btn-outline text-base !px-8 !py-4 inline-flex items-center justify-center gap-2">
              MFI Platform
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-display font-bold text-center mb-16">Our Enterprise Solutions</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* NGO Solution */}
            <div className="border-2 border-forest-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-forest-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For NGOs & Donors</h3>
              <p className="text-gray-600 mb-6">
                Manage outreach programs, track community impact, and distribute funding to partner institutions with full transparency.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-forest-600 mt-0.5 flex-shrink-0" />
                  <span>Real-time program monitoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-forest-600 mt-0.5 flex-shrink-0" />
                  <span>Community engagement tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-forest-600 mt-0.5 flex-shrink-0" />
                  <span>Impact reporting & audits</span>
                </li>
              </ul>
              <Link href="/enterprise/ngo-login" className="mt-8 inline-block btn-outline">
                NGO Login
              </Link>
            </div>

            {/* MFI Solution */}
            <div className="border-2 border-earth-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-earth-100 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-earth-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For MFIs & Lenders</h3>
              <p className="text-gray-600 mb-6">
                Access NGO-funded programs, manage lending portfolios, and support grassroots communities with digital-first solutions.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-earth-600 mt-0.5 flex-shrink-0" />
                  <span>Funding pool management</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-earth-600 mt-0.5 flex-shrink-0" />
                  <span>Loan portfolio tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-earth-600 mt-0.5 flex-shrink-0" />
                  <span>Repayment & performance analytics</span>
                </li>
              </ul>
              <Link href="/enterprise/mfi-login" className="mt-8 inline-block btn-outline">
                MFI Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Flow Diagram */}
      <section className="py-20 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-forest-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">NGO Allocates</h4>
              <p className="text-sm text-gray-600">NGO creates funding programs and distributes to MFIs</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <div className="w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-earth-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">MFI Receives</h4>
              <p className="text-sm text-gray-600">MFI receives funded amount in lending pool</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <div className="w-16 h-16 bg-forest-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-forest-700">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Lending Happens</h4>
              <p className="text-sm text-gray-600">MFI lends to communities and tracks repayments</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <div className="w-16 h-16 bg-forest-50 border-2 border-forest-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-forest-600">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Impact Tracked</h4>
              <p className="text-sm text-gray-600">NGO monitors performance and community growth</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-r from-forest-600 to-earth-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Financial Inclusion?</h2>
          <p className="text-lg mb-8 opacity-90">
            Connect with us to set up your enterprise account and start managing community lending at scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:enterprise@mkutano.app" className="bg-white text-forest-600 px-8 py-3 rounded-full font-semibold hover:bg-sand-50 transition">
              Contact Sales
            </a>
            <Link href="/enterprise" className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition">
              View Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
