"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Check } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  createSecretaryAccount,
  joinGroupWithCode,
} from "@/lib/accountManager";

const steps = ["Account Type", "Personal Details", "Group Setup", "Confirm"];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    role: "secretary",
    name: "",
    phone: "",
    email: "",
    password: "",
    nationalId: "",
    groupName: "",
    village: "",
    district: "",
    country: "Kenya",
    shareValue: "100",
    currency: "KES",
  });

  const next = () => setStep(s => Math.min(s + 1, 3));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (form.role === "secretary") {
        // Create secretary account with new group
        const result = createSecretaryAccount({
          name: form.name,
          phone: form.phone,
          email: form.email,
          password: form.password,
          groupName: form.groupName,
          village: form.village,
          district: form.district,
          country: form.country,
          shareValue: Number(form.shareValue),
          currency: form.currency,
        });

        // Store user in context
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        // Store group info
        localStorage.setItem("currentGroup", JSON.stringify(result.group));
      } else if (form.role === "member") {
        // Member joins with code
        const result = joinGroupWithCode({
          name: form.name,
          phone: form.phone,
          password: form.password,
          joinCode: form.groupName, // Using groupName field for code
          nationalId: form.nationalId,
        });

        localStorage.setItem("currentUser", JSON.stringify(result.user));
        localStorage.setItem("currentGroup", JSON.stringify(result.group));
      }

      // Redirect based on role
      if (form.role === "secretary" || form.role === "member") {
        router.push("/dashboard");
      } else {
        // NGO/Admin - just store and redirect
        const user = {
          id: `u_${Date.now()}`,
          name: form.name,
          phone: form.phone,
          email: form.email,
          role: form.role,
          avatarInitials: form.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
          joinedAt: new Date().toISOString().split("T")[0],
          isActive: true,
        };
        localStorage.setItem("currentUser", JSON.stringify(user));
        router.push("/dashboard");
      }
    } catch (error: any) {
      alert(error.message || "Failed to create account");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 bg-forest-600 rounded-xl flex items-center justify-center shadow">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gray-900">Mkutano</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-5">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Free to start · No credit card needed</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? "bg-forest-600 text-white" : i === step ? "bg-forest-600 text-white ring-4 ring-forest-100" : "bg-sand-200 text-gray-500"}`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${i === step ? "text-forest-700" : "text-gray-400"}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-6 h-0.5 ${i < step ? "bg-forest-600" : "bg-sand-200"}`} />}
            </div>
          ))}
        </div>

        <div className="card">
          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">I am joining as...</h2>
              <div className="space-y-3">
                {[
                  { value: "secretary", emoji: "📋", title: "Group Secretary", desc: "I run savings group meetings and manage records" },
                  { value: "member", emoji: "👩", title: "Group Member", desc: "I want to view my personal savings and loan balance" },
                  { value: "ngo", emoji: "🏢", title: "NGO / MFI Partner", desc: "I support or fund multiple savings groups" },
                  { value: "admin", emoji: "⚙️", title: "Platform Admin", desc: "I manage the Mkutano platform (admin only)" },
                ].map((role) => (
                  <label key={role.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.role === role.value ? "border-forest-500 bg-forest-50" : "border-sand-200 hover:border-sand-300"}`}>
                    <input type="radio" name="role" value={role.value} className="hidden" checked={form.role === role.value} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
                    <span className="text-2xl">{role.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{role.title}</p>
                      <p className="text-xs text-gray-500">{role.desc}</p>
                    </div>
                    {form.role === role.value && <Check className="w-5 h-5 text-forest-600 ml-auto" />}
                  </label>
                ))}
              </div>
              <Button className="w-full mt-6" onClick={next}>Continue →</Button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your personal details
              </h2>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Grace Wanjiku"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+254 7XX XXX XXX"
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
                <Input
                  label="Email (optional)"
                  type="email"
                  placeholder="grace@email.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
                {form.role === "member" && (
                  <Input
                    label="National ID (optional)"
                    placeholder="e.g. 12345678"
                    value={form.nationalId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, nationalId: e.target.value }))
                    }
                  />
                )}
                <Input
                  label="Password"
                  type="password"
                  placeholder="Choose a strong password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={back}>
                  ← Back
                </Button>
                <Button className="flex-1" onClick={next}>
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Set up your group
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {form.role === "member"
                  ? "Enter your group's join code provided by your secretary"
                  : "You can add members and settings after signing up."}
              </p>
              {form.role === "member" ? (
                <div className="space-y-4">
                  <Input
                    label="Group Join Code"
                    placeholder="e.g. MAE-X9K2"
                    required
                    value={form.groupName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, groupName: e.target.value }))
                    }
                    helpText="Ask your group secretary for the join code"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    label="Group Name"
                    placeholder="e.g. Maendeleo wa Wanawake"
                    required
                    value={form.groupName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, groupName: e.target.value }))
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Village / Ward"
                      placeholder="Kangemi"
                      value={form.village}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, village: e.target.value }))
                      }
                    />
                    <Input
                      label="District / County"
                      placeholder="Westlands"
                      value={form.district}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, district: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="currency-select" className="label">Currency</label>
                      <select
                        id="currency-select"
                        className="input-field"
                        value={form.currency}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, currency: e.target.value }))
                        }
                      >
                        <option>KES</option>
                        <option>UGX</option>
                        <option>TZS</option>
                        <option>GHS</option>
                        <option>RWF</option>
                      </select>
                    </div>
                    <Input
                      label="Share Value"
                      type="number"
                      placeholder="100"
                      value={form.shareValue}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, shareValue: e.target.value }))
                      }
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={back}>
                  ← Back
                </Button>
                <Button className="flex-1" onClick={next}>
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm & create your account
              </h2>
              <div className="space-y-2 bg-sand-50 rounded-xl p-4 mb-6 text-sm">
                {([
                  ["Role", form.role],
                  ["Name", form.name || "—"],
                  ["Phone", form.phone || "—"],
                  form.role === "member"
                    ? ["Group Code", form.groupName || "—"]
                    : ["Group Name", form.groupName || "—"],
                  form.role === "secretary" && [
                    "Share Value",
                    `${form.currency} ${form.shareValue}`,
                  ],
                  form.nationalId &&
                    form.role === "member" && ["National ID", form.nationalId],
                ] as Array<[string, string] | false>)
                  .filter((item) => item !== false)
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {v}
                      </span>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-gray-500 mb-4">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-forest-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-forest-600 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={back}>
                  ← Back
                </Button>
                <Button className="flex-1" loading={loading} onClick={handleSubmit}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-forest-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
