'use client';

import { ArrowRight, Download, FileText, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-forest-50 to-forest-100 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-forest-900 mb-4">
            Documentation
          </h1>
          <p className="text-xl text-forest-700 mb-8">
            Complete guides and references for Mkutano&apos;s features, architecture, and deployment.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* HTML Documentation */}
          <div className="border-2 border-forest-200 rounded-lg p-8 hover:border-forest-400 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-forest-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-forest-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-forest-900">
                  Full Documentation
                </h3>
                <p className="text-sm text-forest-600">Print-ready HTML version</p>
              </div>
            </div>
            <p className="text-forest-700 mb-6">
              Complete 50+ page guide covering architecture, features, user roles, data model, deployment, and troubleshooting. Optimized for printing to PDF.
            </p>
            <a
              href="/docs/MKUTANO_DOCUMENTATION.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors"
            >
              <span>View HTML</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Markdown Documentation */}
          <div className="border-2 border-forest-200 rounded-lg p-8 hover:border-forest-400 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-forest-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-forest-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-forest-900">
                  Markdown Version
                </h3>
                <p className="text-sm text-forest-600">Source format for developers</p>
              </div>
            </div>
            <p className="text-forest-700 mb-6">
              Same comprehensive documentation in Markdown format. Best for version control, editing, and converting to other formats like PDF or EPUB.
            </p>
            <a
              href="/docs/COMPREHENSIVE_DOCUMENTATION.md"
              className="inline-flex items-center gap-2 px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors"
            >
              <span>Download MD</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Sections Overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-forest-900 mb-8">Documentation Sections</h2>
          <div className="space-y-4">
            {[
              {
                title: 'Application Overview',
                description: 'What Mkutano does, core mission, and key statistics'
              },
              {
                title: 'Core Features',
                description: 'Public marketing site, community dashboard, enterprise edition, offline capabilities'
              },
              {
                title: 'System Architecture',
                description: 'High-level architecture, data flow, security layers'
              },
              {
                title: 'Technology Stack',
                description: 'Frontend (Next.js, React, TypeScript), backend (Supabase), PWA, deployment'
              },
              {
                title: 'User Roles & Permissions',
                description: '5 roles (Secretary, Member, NGO, MFI, Admin) with detailed access control'
              },
              {
                title: 'Data Model',
                description: '12 database tables, relationships, RLS security policies'
              },
              {
                title: 'Application Structure',
                description: 'Complete directory layout and file organization'
              },
              {
                title: 'Key Features by Module',
                description: 'Detailed breakdown of each dashboard page and functionality'
              },
              {
                title: 'Enterprise Edition',
                description: 'NGO platform, MFI platform, funding flows, impact tracking'
              },
              {
                title: 'Authentication & Security',
                description: 'Phone/email auth, RLS policies, audit trails, encryption'
              },
              {
                title: 'Offline-First & PWA',
                description: 'Service workers, caching strategies, demo mode, sync manager'
              },
              {
                title: 'Getting Started',
                description: 'Installation, development server, production build, Vercel deployment'
              },
              {
                title: 'Demo Accounts',
                description: '5 pre-configured test accounts for community and enterprise platforms'
              },
              {
                title: 'API & Integration',
                description: 'Supabase integration, database queries, authentication methods'
              },
              {
                title: 'Deployment & Versioning',
                description: 'Current version, build output, browser support, recent changes'
              },
            ].map((section, idx) => (
              <div key={idx} className="border border-forest-100 rounded-lg p-6 hover:bg-forest-50 transition-colors">
                <h3 className="font-semibold text-forest-900 mb-1">{section.title}</h3>
                <p className="text-forest-700">{section.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PDF Instructions */}
        <div className="bg-forest-50 border-2 border-forest-200 rounded-lg p-8 mb-16">
          <h2 className="text-xl font-bold text-forest-900 mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            How to Generate PDF
          </h2>
          <ol className="space-y-4 text-forest-700">
            <li className="flex gap-4">
              <span className="font-bold text-forest-900 flex-shrink-0">1.</span>
              <span>
                <strong>Open HTML documentation:</strong> Click &quot;View HTML&quot; above or visit{' '}
                <code className="bg-white px-2 py-1 rounded border border-forest-200">/docs/MKUTANO_DOCUMENTATION.html</code>
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-forest-900 flex-shrink-0">2.</span>
              <span>
                <strong>Print to PDF:</strong> Press <code className="bg-white px-2 py-1 rounded border border-forest-200">Ctrl+P</code> (Windows) or{' '}
                <code className="bg-white px-2 py-1 rounded border border-forest-200">Cmd+P</code> (Mac)
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-forest-900 flex-shrink-0">3.</span>
              <span>
                <strong>Select printer:</strong> Choose &quot;Save as PDF&quot; from the printer dropdown
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-forest-900 flex-shrink-0">4.</span>
              <span>
                <strong>Save:</strong> Click &quot;Save&quot; to generate your professional PDF documentation
              </span>
            </li>
          </ol>
          <p className="text-sm text-forest-600 mt-6">
            ✓ All formatting preserved • ✓ Proper page breaks • ✓ Color-coded sections • ✓ Professional styling
          </p>
        </div>

        {/* Quick Reference */}
        <div className="bg-white border-2 border-forest-300 rounded-lg p-8">
          <h2 className="text-xl font-bold text-forest-900 mb-6">Quick Reference</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-forest-900 mb-3">Key Statistics</h3>
              <ul className="space-y-2 text-sm text-forest-700">
                <li>📄 <strong>33 Routes</strong> in production</li>
                <li>👥 <strong>5 User Roles</strong> with different dashboards</li>
                <li>📊 <strong>8+ Dashboard Modules</strong></li>
                <li>📱 <strong>100% PWA</strong> installable</li>
                <li>🔒 <strong>Row-Level Security</strong> for data isolation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-forest-900 mb-3">Tech Stack</h3>
              <ul className="space-y-2 text-sm text-forest-700">
                <li><strong>Frontend:</strong> Next.js 14, React, TypeScript</li>
                <li><strong>Styling:</strong> Tailwind CSS</li>
                <li><strong>Backend:</strong> Supabase (PostgreSQL)</li>
                <li><strong>Auth:</strong> Phone OTP + Email</li>
                <li><strong>Deployment:</strong> Vercel (auto)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-forest-900 mb-3">Demo Accounts</h3>
              <ul className="space-y-2 text-sm text-forest-700">
                <li>📞 <strong>Secretary:</strong> +254700000001</li>
                <li>👤 <strong>Member:</strong> +254700000003</li>
                <li>🏢 <strong>NGO:</strong> Maendeleo Foundation</li>
                <li>🏦 <strong>MFI:</strong> Ulinzi MFI for MSMEs</li>
                <li>✋ No password required</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-forest-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-forest-200 mb-8 max-w-2xl mx-auto">
            Access the documentation online, download for offline reference, or go straight to the app.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/docs/MKUTANO_DOCUMENTATION.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-forest-500 hover:bg-forest-600 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              View Docs
            </a>
            <Link
              href="/login"
              className="px-6 py-3 bg-white text-forest-900 hover:bg-forest-50 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Go to App
            </Link>
            <a
              href="/"
              className="px-6 py-3 border-2 border-forest-500 text-white hover:bg-forest-800 rounded-lg font-semibold transition-colors"
            >
              Back Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
