"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, Lock, Phone } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
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
      // Sign in with Supabase
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
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 bg-forest-600 rounded-xl flex items-center justify-center shadow">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gray-900">Mkutano</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-6">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your group dashboard</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
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
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-sm text-forest-600 hover:underline">Forgot password?</Link>
            </div>

            {error && <p className="text-sm text-terra-600 font-medium">{error}</p>}

            <Button type="submit" className="w-full" loading={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-3 bg-earth-50 rounded-xl text-xs text-earth-700 border border-earth-100">
            <p className="font-semibold mb-2">🔑 Demo credentials (any password):</p>
            <div className="space-y-1 font-mono text-xs">
              <p><strong>Secretary:</strong> +254712345678</p>
              <p><strong>Admin:</strong> +254700000001</p>
              <p><strong>NGO / MFI:</strong> +254700000002</p>
              <hr className="border-earth-200 my-2" />
              <p className="font-semibold mb-1">Members (from secretary&apos;s group):</p>
              <p>+254711000001 (Mary Achieng)</p>
              <p>+254711000002 (Fatuma Hassan)</p>
              <p>+254711000003 (Alice Njeri)</p>
              <p>+254711000004 (Beatrice Otieno)</p>
              <p>+254711000005 (Christine Mwangi)</p>
              <p>+254711000006 (Dorah Kamau)</p>
              <p>+254711000007 (Esther Wambui)</p>
              <p>+254711000008 (Florence Adhiambo)</p>
              <p>+254711000009 (Gladys Mutua)</p>
              <p>+254711000010 (Hannah Chebet)</p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          New to Mkutano?{" "}
          <Link href="/signup" className="text-forest-600 font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
