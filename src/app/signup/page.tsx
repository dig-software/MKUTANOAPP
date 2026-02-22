"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Check, AlertCircle, Copy } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

const steps = ["Secretary Details", "Group Setup", "Confirm"];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [groupCode, setGroupCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    groupName: "",
    village: "",
    district: "",
    country: "Kenya",
    shareValue: "100",
    currency: "KES",
  });

  const next = () => setStep(s => Math.min(s + 1, 2));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const copyCode = () => {
    navigator.clipboard.writeText(groupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Validate form
      if (!form.name || !form.email || !form.password || !form.phone) {
        throw new Error("Please fill in all secretary details");
      }
      if (!form.groupName || !form.village || !form.district) {
        throw new Error("Please fill in all group details");
      }

      // 1. Create Supabase auth account
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (signupError) throw signupError;
      if (!authData.user) throw new Error("Failed to create account");

      const userId = authData.user.id;
      const joinCode = `${form.groupName.slice(0, 3).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

      // 2. Create group in database
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: form.groupName,
          village: form.village,
          district: form.district,
          country: form.country,
          shareValue: Number(form.shareValue),
          currency: form.currency,
          secretaryId: userId,
          secretaryName: form.name,
          secretaryPhone: form.phone,
          joinCode: joinCode,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // 3. Create secretary user profile
      const { error: userError } = await supabase
        .from("users")
        .insert({
          id: userId,
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: "secretary",
          groupId: groupData.id,
          avatarInitials: form.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
          isActive: true,
        });

      if (userError) throw userError;

      setGroupCode(joinCode);
      setGroupName(form.groupName);
      setSuccess(true);
      
      // Auto-redirect after 5 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 5000);
    } catch (err: any) {
      setError(err.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center">
            <div className="w-10 h-10 bg-forest-600 rounded-xl flex items-center justify-center shadow">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gray-900">Mkutano</span>
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900 mt-6">Register Your Group</h1>
          <p className="text-gray-500 text-sm mt-2">Community Edition - Secretary-Led Group Management</p>
        </div>

        {/* Success State */}
        {success && (
          <div className="card bg-forest-50 border-2 border-forest-200 mb-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Check className="w-6 h-6 text-forest-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-forest-900 mb-2">✓ Group Created Successfully!</h3>
                <p className="text-forest-800 text-sm mb-4">
                  <strong>{groupName}</strong> is ready. Save this code for your group records:
                </p>
                <div className="bg-white rounded-lg p-4 font-mono text-lg font-bold text-center text-forest-600 border-2 border-dashed border-forest-300 mb-3">
                  {groupCode}
                </div>
                <button
                  onClick={copyCode}
                  className="text-sm text-forest-700 hover:text-forest-800 font-semibold flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy code"}
                </button>
                <p className="text-forest-700 text-sm mt-4">
                  Next: Add member phone numbers in your dashboard. Members will sign in with their phone number once created.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Steps Indicator */}
        {!success && (
          <div className="mb-8 flex gap-2 justify-center">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i === step
                      ? "bg-forest-600 text-white ring-4 ring-forest-100"
                      : i < step
                      ? "bg-forest-200 text-forest-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-12 h-1 transition-all ${i < step ? "bg-forest-200" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Form Card */}
        {!success && (
          <div className="card">
            {error && (
              <div className="mb-6 p-4 bg-terra-50 border border-terra-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-terra-600 flex-shrink-0 mt-0.5" />
                <p className="text-terra-800 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              {/* Step 1: Secretary Details */}
              {step === 0 && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-5">Your Information (Secretary)</h2>
                  
                  <Input
                    label="Full Name"
                    placeholder="Grace Wanjiku"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+254 712 345 678"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="grace@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                  
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  />

                  <p className="text-xs text-gray-500 mt-3">
                    You are registering as a Group Secretary. You will manage all group activities and add members.
                  </p>
                </>
              )}

              {/* Step 1: Group Setup */}
              {step === 1 && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-5">Your Group Information</h2>
                  
                  <Input
                    label="Group Name"
                    placeholder="e.g., Kibera Women's Savings"
                    value={form.groupName}
                    onChange={e => setForm(f => ({ ...f, groupName: e.target.value }))}
                  />
                  
                  <Input
                    label="Village / Community"
                    placeholder="e.g., Kibera"
                    value={form.village}
                    onChange={e => setForm(f => ({ ...f, village: e.target.value }))}
                  />
                  
                  <Input
                    label="District / County"
                    placeholder="e.g., Nairobi"
                    value={form.district}
                    onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Member Share Value</label>
                      <input
                        type="number"
                        className="input-field"
                        value={form.shareValue}
                        onChange={e => setForm(f => ({ ...f, shareValue: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="label">Currency</label>
                      <select
                        className="input-field"
                        value={form.currency}
                        onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                      >
                        <option>KES</option>
                        <option>UGX</option>
                        <option>TZS</option>
                        <option>GHS</option>
                        <option>RWF</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    These are the default settings for member contributions. You can change them later.
                  </p>
                </>
              )}

              {/* Step 3: Confirmation */}
              {step === 2 && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-5">Confirm Your Details</h2>
                  
                  <div className="space-y-4 bg-sand-50 rounded-xl p-5 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Secretary Name</p>
                      <p className="text-gray-900">{form.name}</p>
                    </div>
                    <div className="border-t border-sand-200 pt-4">
                      <p className="text-gray-600 font-medium">Phone</p>
                      <p className="text-gray-900">{form.phone}</p>
                    </div>
                    <div className="border-t border-sand-200 pt-4">
                      <p className="text-gray-600 font-medium">Email</p>
                      <p className="text-gray-900">{form.email}</p>
                    </div>
                    <div className="border-t border-sand-200 pt-4">
                      <p className="text-gray-600 font-medium">Group Name</p>
                      <p className="text-gray-900">{form.groupName}</p>
                    </div>
                    <div className="border-t border-sand-200 pt-4">
                      <p className="text-gray-600 font-medium">Location</p>
                      <p className="text-gray-900">{form.village}, {form.district}</p>
                    </div>
                    <div className="border-t border-sand-200 pt-4">
                      <p className="text-gray-600 font-medium">Member Share Value</p>
                      <p className="text-gray-900">{form.currency} {form.shareValue}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-forest-50 border border-forest-200 rounded-lg text-sm">
                    <p className="text-forest-800">
                      <strong>After Registration:</strong> You will receive a unique group code to share with members. Members can then sign in with their phone number.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8 justify-between">
              <button
                onClick={back}
                disabled={step === 0 || loading}
                className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>

              {step < 2 ? (
                <button onClick={next} disabled={loading} className="btn-primary">
                  Next Step →
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2">
                  {loading ? "Creating Group..." : "Create Group"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        {!success && (
          <p className="text-center text-sm text-gray-600 mt-6">
            Have a group account? <Link href="/login" className="text-forest-600 font-semibold hover:underline">Sign In</Link>
          </p>
        )}

        {success && (
          <div className="text-center mt-6">
            <button 
              onClick={() => router.push("/dashboard")}
              className="text-forest-600 font-semibold hover:underline"
            >
              Go to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
