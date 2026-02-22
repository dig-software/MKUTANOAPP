"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, Lock, Phone } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { getUserByPhone, mockUser } from "@/lib/mockData";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<"phone" | "email">("phone");
  const [form, setForm] = useState({ credential: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const getRedirectPath = (role?: string) =>
      role === "member" ? "/dashboard/wallet" : "/dashboard";

    try {
      if (loginType === "phone") {
        const demoUser = getUserByPhone(form.credential);
        if (demoUser) {
          localStorage.setItem("currentUser", JSON.stringify(demoUser));
          router.push(getRedirectPath(demoUser.role));
          return;
        }
      }

      if (loginType === "email" && form.credential.toLowerCase() === mockUser.email?.toLowerCase()) {
        localStorage.setItem("currentUser", JSON.stringify(mockUser));
        router.push(getRedirectPath(mockUser.role));
        return;
      }

      let emailToUse = form.credential;

      if (loginType === "phone") {
        const { data: userData, error: lookupError } = await supabase
          .from("users")
          .select("email")
          .eq("phone", form.credential)
          .single();

        if (lookupError || !userData) {
          setError("Phone number not found. Ask your secretary for help.");
          setLoading(false);
          return;
        }

        emailToUse = userData.email;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: form.password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .single();
        router.push(getRedirectPath(profile?.role));
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
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Enterprise Links */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/enterprise/ngo-login" className="p-3 rounded-lg border-2 border-forest-100 hover:border-forest-300 hover:bg-forest-50 transition text-center">
            <div className="text-lg mb-1">🏢</div>
            <p className="text-xs font-semibold text-gray-900">NGO Portal</p>
            <p className="text-xs text-gray-500">Programs & Funding</p>
          </Link>
          <Link href="/enterprise/mfi-login" className="p-3 rounded-lg border-2 border-earth-100 hover:border-earth-300 hover:bg-earth-50 transition text-center">
            <div className="text-lg mb-1">💼</div>
            <p className="text-xs font-semibold text-gray-900">MFI Portal</p>
            <p className="text-xs text-gray-500">Lending & Portfolio</p>
          </Link>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-sand-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-sand-50 text-gray-500">Community & Groups</span>
          </div>
        </div>

        <div className="card">
          {/* Login Type Toggle */}
          <div className="mb-6 grid grid-cols-2 gap-2 bg-sand-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginType("phone")}
              className={`py-2 rounded-md font-medium text-sm transition-all ${
                loginType === "phone"
                  ? "bg-forest-600 text-white shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Phone
            </button>
            <button
              type="button"
              onClick={() => setLoginType("email")}
              className={`py-2 rounded-md font-medium text-sm transition-all ${
                loginType === "email"
                  ? "bg-forest-600 text-white shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Email
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={loginType === "phone" ? "Phone Number" : "Email"}
              type={loginType === "phone" ? "tel" : "email"}
              placeholder={loginType === "phone" ? "+254 712 345 678" : "your@email.com"}
              required
              leftIcon={loginType === "phone" ? <Phone className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              value={form.credential}
              onChange={e => setForm(f => ({ ...f, credential: e.target.value }))}
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

            <Button type="submit" className="w-full" loading={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-5 p-3 bg-earth-50 rounded-xl text-xs text-earth-700 border border-earth-100">
            <p className="font-semibold mb-2">🔑 Demo Accounts (Community Edition):</p>
            <div className="space-y-1 font-mono text-xs">
              <p><strong>Secretary:</strong> grace@maendeleo.ke | demo123</p>
              <p><strong>Admin (phone):</strong> +254700000001</p>
              <p><strong>NGO/MFI (phone):</strong> +254700000002</p>
              <p><strong>Member (phone):</strong> +254711000001</p>
              <p><strong>Member (phone):</strong> +254711000002</p>
              <hr className="border-earth-200 my-2" />
              <p className="text-xs">
                Secretary uses email + password. Others sign in with phone only.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          New secretary?{" "}
          <Link href="/signup" className="text-forest-600 font-semibold hover:underline">Register your group</Link>
        </p>
      </div>
    </div>
  );
}
