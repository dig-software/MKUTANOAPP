"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, Calendar, Wallet, FileText, BarChart2,
  Settings, LogOut, Bell, Menu, X, Leaf, RefreshCw, ChevronDown, User
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { mockNotifications } from "@/lib/mockData";
import { getInitials } from "@/lib/utils";
import { useCurrentUser } from "@/lib/UserContext";
import { supabase } from "@/lib/supabase";

const navSections = {
  secretary: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Meetings", href: "/dashboard/meetings" },
    { icon: Wallet, label: "Contributions", href: "/dashboard/contributions" },
    { icon: FileText, label: "Loans", href: "/dashboard/loans" },
    { icon: Users, label: "Members", href: "/dashboard/members" },
    { icon: BarChart2, label: "Reports", href: "/dashboard/reports" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  member: [
    { icon: Wallet, label: "My Wallet", href: "/dashboard/wallet" },
    { icon: FileText, label: "My Contributions", href: "/dashboard/my-contributions" },
    { icon: FileText, label: "My Loans", href: "/dashboard/my-loans" },
    { icon: Calendar, label: "Meeting History", href: "/dashboard/meeting-history" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  ngo: [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Users, label: "Groups", href: "/dashboard/ngo/groups" },
    { icon: BarChart2, label: "Impact", href: "/dashboard/ngo/impact" },
    { icon: FileText, label: "Loans", href: "/dashboard/ngo/loans" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "All Groups", href: "/dashboard/all-groups" },
    { icon: User, label: "Users", href: "/dashboard/users" },
    { icon: FileText, label: "Audit Log", href: "/dashboard/audit" },
    { icon: Settings, label: "System", href: "/dashboard/system" },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { currentUser, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser) {
    return null; // Will redirect via useEffect
  }

  const syncStatus: "synced" | "pending" | "offline" = "synced";
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  const navItems = navSections[currentUser.role as keyof typeof navSections] || navSections.secretary;

  const handleLogout = async () => {
    localStorage.removeItem("currentUser");
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-sand-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-sand-200 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-sand-200">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-gray-900">Mkutano</span>
            </Link>
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              title="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? "sidebar-link-active" : "sidebar-link"}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sync status */}
          <div className="p-4 border-t border-sand-200">
            <div className="flex items-center gap-2 text-xs">
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === "synced" ? "text-forest-500" : "text-earth-500 animate-spin"}`} />
              <Badge status={syncStatus} className="text-xs" />
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-sand-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              title="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 capitalize">
                {currentUser.role === "secretary" ? "Group Secretary" : currentUser.role === "ngo" ? "NGO Partner" : currentUser.role}
              </h1>
              <p className="text-xs text-gray-500">{currentUser.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-terra-500 rounded-full" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-sand-200 max-h-96 overflow-auto">
                  <div className="p-3 border-b border-sand-100 flex items-center justify-between">
                    <span className="text-sm font-semibold">Notifications</span>
                    <Badge label={`${unreadCount} new`} className="badge-orange" />
                  </div>
                  {mockNotifications.slice(0, 5).map((n) => (
                    <div key={n.id} className={`p-3 border-b border-sand-100 hover:bg-sand-50 cursor-pointer ${!n.isRead ? "bg-forest-50/30" : ""}`}>
                      <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                    </div>
                  ))}
                  <Link href="/dashboard/notifications" className="block p-3 text-center text-xs font-semibold text-forest-600 hover:bg-sand-50">
                    View All
                  </Link>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button className="flex items-center gap-2 p-1.5 pr-3 hover:bg-gray-100 rounded-lg" onClick={() => setProfileOpen(!profileOpen)}>
                <div className="w-8 h-8 bg-forest-200 rounded-full flex items-center justify-center text-xs font-bold text-forest-800">
                  {getInitials(currentUser.name)}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-sand-200">
                  <div className="p-3 border-b border-sand-100">
                    <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.phone}</p>
                  </div>
                  <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-sand-50">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-terra-600 hover:bg-terra-50 rounded-b-xl">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
