"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, Mail, Lock } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

const MFI_DEMO_ACCOUNTS = [
  {
    email: "ulinzi@msmes.ke",
    password: "demo123",
    name: "Ulinzi MFI for MSMEs",
  },
  {
    email: "microlend@ashimacredit.org",
    password: "demo123",
    name: "Ashima Microfinance",
  },
];

export default function MFILoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Demo account check
      const demoAccount = MFI_DEMO_ACCOUNTS.find(
        (acc) =>
          acc.email.toLowerCase() === form.email.toLowerCase() &&
          acc.password === form.password
      );

      if (demoAccount) {
        const mockMfiUser = {
          id: `mfi_${Date.now()}`,
          name: demoAccount.name,
          email: demoAccount.email,
          phone: "+254700000003",
          role: "mfi",
          avatarInitials: demoAccount.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
          joinedAt: "2024-01-01",
          isActive: true,
        };

        localStorage.setItem("currentUser", JSON.stringify(mockMfiUser));
        router.push("/dashboard/mfi");
        return;
      }

      // Real Supabase login
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push("/dashboard/mfi");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-50 to-sand-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 bg-earth-600 rounded-xl flex items-center justify-center shadow">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gray-900">Mkutano</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-6">MFI Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Manage lending and portfolio performance</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="your@mfi.org"
              required
              leftIcon={<Mail className="w-4 h-4" />}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={error ? error : undefined}
            />

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPass ? "text" : "password"}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t border-sand-200">
            <p className="text-xs text-gray-500 font-medium mb-3">DEMO ACCOUNTS</p>
            <div className="space-y-2">
              {MFI_DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  onClick={() => {
                    setForm({ email: account.email, password: account.password });
                    setError("");
                  }}
                  className="w-full text-left p-3 rounded-lg bg-earth-50 hover:bg-earth-100 border border-earth-200 transition"
                >
                  <p className="font-medium text-gray-900 text-sm">{account.name}</p>
                  <p className="text-xs text-gray-500">{account.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Back to{" "}
          <Link href="/login" className="text-earth-600 hover:underline font-medium">
            Community Login
          </Link>
        </p>
      </div>
    </div>
  );
}
