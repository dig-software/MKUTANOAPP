"use client";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      <div className="py-16 bg-white text-center border-b border-sand-100">
        <div className="max-w-2xl mx-auto px-4">
          <span className="badge-green mb-4 inline-flex">Get in Touch</span>
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle text-center mx-auto mt-3">
            Questions, feedback, or partnership inquiries — our team responds within 24 hours.
          </p>
        </div>
      </div>

      <section className="py-16 bg-sand-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">How to reach us</h2>
            <div className="space-y-5">
              {[
                { icon: Mail, label: "Email", value: "hello@mkutano.app", sub: "For general inquiries and support" },
                { icon: Phone, label: "Phone / WhatsApp", value: "+254788191822", sub: "Monday – Friday, 8am – 6pm EAT" },
                { icon: MapPin, label: "Office", value: "We're currently online-based, offering solutions remotely.", sub: "Remote" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-forest-100 rounded-xl flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-forest-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{c.label}</p>
                    <p className="text-sm text-forest-700 font-medium">{c.value}</p>
                    <p className="text-xs text-gray-500">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-forest-50 border border-forest-100 rounded-2xl">
              <h4 className="text-sm font-semibold text-forest-800 mb-1">NGO & MFI Partnerships</h4>
              <p className="text-sm text-forest-700">
                Want to roll out Mkutano across all your groups? Email{" "}
                <span className="font-semibold">partners@mkutano.app</span> for bulk licensing and integration support.
              </p>
            </div>

            <div className="mt-8 card p-6">
              <p className="text-xs uppercase tracking-widest text-forest-600 font-semibold">About the developers</p>
              <h2 className="text-xl font-display font-bold text-gray-900 mt-2">Prototype disclosure</h2>
              <p className="text-sm text-gray-600 mt-3">
                Developed by BESPOKE GROUP, AfricameetsBavaria program, DigitalProductSchool, Mount Kenya University.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-forest-100 text-forest-700 px-3 py-1 text-xs font-semibold">
                Prototype only · For demonstration purposes
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card">
            {sent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Message sent!</h3>
                <p className="text-sm text-gray-500">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Send us a message</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Your Name" placeholder="Grace Wanjiku" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  <Input label="Email Address" type="email" placeholder="grace@email.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <Input label="Phone (optional)" type="tel" placeholder="+254 7XX XXX XXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                <div>
                  <label className="label" htmlFor="contact-subject">Subject</label>
                  <select
                    id="contact-subject"
                    className="input-field"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  >
                    <option value="">Select a topic...</option>
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>NGO / MFI Partnership</option>
                    <option>Pricing & Plans</option>
                    <option>Press & Media</option>
                  </select>
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea
                    className="input-field resize-none"
                    rows={4}
                    placeholder="Tell us how we can help..."
                    required
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
