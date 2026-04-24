"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { backendRequest, clearAuthToken } from "@/lib/backend"
import { Spinner } from "@/components/ui/spinner"
import {
  Shield,
  PawPrint,
  LogOut,
  LayoutDashboard,
  Settings,
  Bell,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string; role?: string; fullName?: string } | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const check = async () => {
      try {
        const data = await backendRequest("/api/auth/me")
        const userData = data?.user ?? data
        const role = userData?.role
        if (role !== "admin") {
          router.replace("/auth/admin-login")
          return
        }
        setUser(userData)
      } catch {
        router.replace("/auth/admin-login")
      } finally {
        setChecking(false)
      }
    }
    check()
  }, [router])

  const handleSignOut = () => {
    clearAuthToken()
    router.replace("/auth/admin-login")
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f1e]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <Spinner className="h-6 w-6 text-indigo-400" />
          <p className="text-sm text-slate-400">Verifying admin access…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0d1428]/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-md shadow-indigo-500/40">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Link href="/" className="text-slate-400 hover:text-slate-200 transition-colors">
                <PawPrint className="inline h-3.5 w-3.5 mr-1" />
                PawFinder
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
              <span className="font-semibold text-white">Admin Panel</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
              <Bell className="h-4 w-4" />
            </button>

            {/* User pill */}
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-slate-300 hidden sm:block">
                {user?.email}
              </span>
              <span className="text-[10px] rounded-full bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 font-semibold uppercase tracking-wider">
                Admin
              </span>
            </div>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero banner */}
      <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-r from-indigo-950/60 via-[#0d1428] to-violet-950/40">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="relative px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
                  <LayoutDashboard className="h-3 w-3" />
                  Control Center
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage pets, veterinarians, and users from one place.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <Settings className="h-3.5 w-3.5" />
              <span>System Administrator</span>
            </div>
          </div>

          {/* Stat Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { label: "Pets Module", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20" },
              { label: "Vets Module", color: "bg-blue-500/15 text-blue-300 border-blue-500/20" },
              { label: "Users Module", color: "bg-violet-500/15 text-violet-300 border-violet-500/20" },
            ].map((pill) => (
              <span
                key={pill.label}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${pill.color}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                {pill.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="admin-panel-content">
          <AdminDashboard />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/5 px-6 py-4">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>PawFinder Admin Panel — Restricted Access</span>
          <span>© {new Date().getFullYear()} PawFinder</span>
        </div>
      </footer>

      {/* Global admin dark-mode overrides for the dashboard component */}
      <style jsx global>{`
        .admin-panel-content .rounded-lg,
        .admin-panel-content .rounded-xl {
          border-color: rgba(255,255,255,0.07) !important;
        }
        .admin-panel-content [class*="bg-card"],
        .admin-panel-content [data-slot="card"] {
          background-color: #111827 !important;
          border-color: rgba(255,255,255,0.07) !important;
          color: #e2e8f0 !important;
        }
        .admin-panel-content [data-slot="card-header"],
        .admin-panel-content [data-slot="card-content"] {
          color: inherit !important;
        }
        .admin-panel-content [role="tablist"] {
          background-color: #1a2235 !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
        }
        .admin-panel-content [role="tab"] {
          color: #94a3b8 !important;
        }
        .admin-panel-content [role="tab"][data-state="active"] {
          background-color: #312e81 !important;
          color: #c7d2fe !important;
          box-shadow: none !important;
        }
        .admin-panel-content input,
        .admin-panel-content textarea,
        .admin-panel-content select {
          background-color: #1e293b !important;
          border-color: rgba(255,255,255,0.1) !important;
          color: #e2e8f0 !important;
        }
        .admin-panel-content button[type="submit"],
        .admin-panel-content button[class*="bg-primary"] {
          background-color: #4f46e5 !important;
          color: white !important;
        }
        .admin-panel-content h2,
        .admin-panel-content h3 {
          color: #f1f5f9 !important;
        }
        .admin-panel-content p,
        .admin-panel-content span:not([class*="badge"]):not([class*="Badge"]) {
          color: #94a3b8;
        }
        .admin-panel-content .text-muted-foreground {
          color: #64748b !important;
        }
        .admin-panel-content strong {
          color: #cbd5e1 !important;
        }
      `}</style>
    </div>
  )
}