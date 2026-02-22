"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { mockMembers } from "@/lib/mockData";
import { formatCurrency, getInitials } from "@/lib/utils";
import { Calendar, MapPin, Users, Save, Check, X } from "lucide-react";

export default function NewMeetingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    venue: "Kangemi Community Hall",
    sessionNumber: "26",
  });
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [contributions, setContributions] = useState<Record<string, { amount: number }>>({});

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const handleSave = () => {
    alert("Meeting saved successfully!");
    router.push("/dashboard/meetings");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Start New Meeting</h1>
        <p className="text-sm text-gray-500 mt-1">Session #{form.sessionNumber}</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {["Session Info", "Attendance", "Contributions", "Review"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i + 1 < step ? "bg-forest-600 text-white" : i + 1 === step ? "bg-forest-600 text-white ring-4 ring-forest-100" : "bg-sand-200 text-gray-500"}`}>
              {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:inline ${i + 1 === step ? "text-forest-700" : "text-gray-400"}`}>{label}</span>
            {i < 3 && <div className={`w-6 h-0.5 ${i + 1 < step ? "bg-forest-600" : "bg-sand-200"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Session info */}
      {step === 1 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Meeting Session Details</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Session Number"
                type="number"
                value={form.sessionNumber}
                onChange={e => setForm(f => ({ ...f, sessionNumber: e.target.value }))}
                leftIcon={<Hash className="w-4 h-4" />}
              />
              <Input
                label="Meeting Date"
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                leftIcon={<Calendar className="w-4 h-4" />}
              />
            </div>
            <Input
              label="Venue"
              value={form.venue}
              onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
              leftIcon={<MapPin className="w-4 h-4" />}
            />
          </div>
          <Button className="w-full mt-6" onClick={next}>Continue →</Button>
        </Card>
      )}

      {/* Step 2: Attendance */}
      {step === 2 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mark Attendance</h2>
            <span className="badge-green">{Object.values(attendance).filter(Boolean).length} / {mockMembers.length} present</span>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {mockMembers.map((m) => (
              <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${attendance[m.id] ? "border-forest-500 bg-forest-50" : "border-sand-200 hover:border-sand-300"}`}>
                <input
                  type="checkbox"
                  checked={attendance[m.id] || false}
                  onChange={e => setAttendance(a => ({ ...a, [m.id]: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-300 text-forest-600 focus:ring-forest-500"
                />
                <div className="w-10 h-10 bg-earth-200 rounded-full flex items-center justify-center text-sm font-bold text-earth-800">
                  {getInitials(m.name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.phone}</p>
                </div>
                {attendance[m.id] && <Check className="w-5 h-5 text-forest-600" />}
              </label>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={back}>← Back</Button>
            <Button className="flex-1" onClick={next}>Continue →</Button>
          </div>
        </Card>
      )}

      {/* Step 3: Contributions */}
      {step === 3 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Record Contributions</h2>
          <p className="text-sm text-gray-500 mb-4">Enter the contribution amount for each member.</p>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mockMembers.filter(m => attendance[m.id]).map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3 bg-sand-50 rounded-xl">
                <div className="w-10 h-10 bg-earth-200 rounded-full flex items-center justify-center text-sm font-bold text-earth-800">
                  {getInitials(m.name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                </div>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  className="w-28 px-3 py-2 text-center rounded-lg border border-sand-200 focus:ring-2 focus:ring-forest-400 focus:border-transparent"
                  value={contributions[m.id]?.amount || ""}
                  onChange={e => {
                    const amount = parseInt(e.target.value) || 0;
                    setContributions(c => ({ ...c, [m.id]: { amount } }));
                  }}
                />
                <span className="text-sm font-bold text-forest-700 w-24 text-right">
                  {formatCurrency(contributions[m.id]?.amount || 0)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-forest-50 rounded-xl border border-forest-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-forest-800">Total Contributions:</span>
              <span className="text-xl font-bold text-forest-700">
                {formatCurrency(Object.values(contributions).reduce((s, c) => s + c.amount, 0))}
              </span>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={back}>← Back</Button>
            <Button className="flex-1" onClick={next}>Continue →</Button>
          </div>
        </Card>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Review & Confirm</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 p-4 bg-sand-50 rounded-xl">
              <div>
                <p className="text-xs text-gray-500">Session Number</p>
                <p className="text-sm font-semibold text-gray-900">#{form.sessionNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-semibold text-gray-900">{form.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Venue</p>
                <p className="text-sm font-semibold text-gray-900">{form.venue}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Attendance</p>
                <p className="text-sm font-semibold text-gray-900">{Object.values(attendance).filter(Boolean).length} / {mockMembers.length}</p>
              </div>
            </div>

            <div className="p-4 bg-forest-50 rounded-xl border border-forest-200">
              <p className="text-sm font-semibold text-forest-800 mb-2">Total Contributions</p>
              <p className="text-2xl font-bold text-forest-700">
                {formatCurrency(Object.values(contributions).reduce((s, c) => s + c.amount, 0))}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {Object.values(attendance).filter(Boolean).length} members contributed
              </p>
            </div>

            <div className="p-4 bg-earth-50 rounded-xl border border-earth-200">
              <p className="text-xs font-semibold text-earth-800 mb-2">⚠️ Dispute Prevention Check</p>
              <p className="text-xs text-earth-700">
                Before saving, all members should verify their contribution amounts shown above. Once confirmed, this session cannot be edited without admin approval.
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={back}>← Back</Button>
            <Button className="flex-1" onClick={handleSave}>
              <Save className="w-4 h-4" />
              Save Meeting
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function Hash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="9" y2="9" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" />
      <line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  );
}
