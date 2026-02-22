import Link from "next/link";
import { ArrowRight, ShieldCheck, WifiOff, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative gradient-hero overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-forest-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-earth-200/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest-100 text-forest-700 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-forest-500 rounded-full animate-pulse" />
              Offline-First · Made for VSLAs
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gray-900 leading-tight">
              Your group's money,{" "}
              <span className="text-gradient">managed with confidence</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
              Mkutano digitizes every savings meeting — contributions, loans, repayments, and reports — even without internet. Built for women's village savings groups across Africa.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="btn-primary text-base !px-7 !py-4">
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/#how-it-works" className="btn-outline text-base !px-7 !py-4">
                See How It Works
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap gap-5">
              {[
                { icon: ShieldCheck, label: "Encrypted & Secure" },
                { icon: WifiOff, label: "Works Offline" },
                { icon: Users, label: "18+ Members Per Group" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Icon className="w-4 h-4 text-forest-600" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard preview card */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl border border-sand-100 overflow-hidden">
              {/* Fake top bar */}
              <div className="bg-forest-700 px-5 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  {["bg-terra-400", "bg-earth-400", "bg-forest-400"].map((c, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${c}`} />
                  ))}
                </div>
                <span className="text-forest-200 text-xs font-medium">Mkutano — Session #25</span>
                <span className="ml-auto badge-green text-xs">● Synced</span>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">TOTAL CONTRIBUTIONS TODAY</p>
                    <p className="text-3xl font-display font-bold text-gray-900">KES 14,200</p>
                  </div>
                  <div className="w-14 h-14 bg-forest-100 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">🌿</span>
                  </div>
                </div>

                {/* Mini member list */}
                <div className="space-y-2">
                  {[
                    { name: "Mary Achieng", shares: 5, amount: "KES 500", done: true },
                    { name: "Alice Njeri", shares: 7, amount: "KES 700", done: true },
                    { name: "Christine Mwangi", shares: 4, amount: "KES 400", done: false },
                  ].map((m) => (
                    <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl bg-sand-50 border border-sand-100">
                      <div className="w-8 h-8 bg-earth-200 rounded-full flex items-center justify-center text-xs font-bold text-earth-700">
                        {m.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.shares} shares</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{m.amount}</p>
                        <span className={m.done ? "badge-green" : "badge-orange"}>
                          {m.done ? "Confirmed" : "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick totals */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { label: "Loans Out", val: "KES 8,000", color: "text-earth-600" },
                    { label: "Repaid", val: "KES 5,500", color: "text-forest-600" },
                    { label: "Attendance", val: "16/18", color: "text-gray-700" },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-2 bg-sand-50 rounded-xl">
                      <p className={`text-base font-bold ${s.color}`}>{s.val}</p>
                      <p className="text-xs text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating pill */}
            <div className="absolute -bottom-3 -right-3 bg-earth-500 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-lg">
              📄 Auto-generating report...
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
