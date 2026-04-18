'use client';

import { Bell, Lock, Save, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, SectionTitle, StatusBadge } from '@/components/dashboard/cards';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    notifications: true,
    emailUpdates: true,
  });

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function saveSettings() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  return (
    <DashboardLayout
      title="Workspace Settings"
      subtitle="Adjust preview profile details, notification preferences, and your workspace defaults."
      actions={<Button className="h-12 px-5" onClick={saveSettings}><Save size={16} className="mr-2" />Save Changes</Button>}
    >
      <SectionTitle
        title="Account settings"
        subtitle="A cleaner settings page to match the rebuilt dashboards. These controls are currently local UI state until the backend profile APIs are added."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <DashboardCard title="Profile Details">
            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Full name</span>
                <input
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Email address</span>
                <input
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none"
                />
              </label>
              <div className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-600">Current role</p>
                <div className="mt-3">
                  <StatusBadge value={user?.role ?? 'user'} tone="dark" />
                </div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Notifications">
            <div className="space-y-4">
              <PreferenceRow
                icon={Bell}
                title="Push notifications"
                text="Receive shipment and dispatch alerts in your workspace."
                enabled={form.notifications}
                onToggle={() => updateField('notifications', !form.notifications)}
              />
              <PreferenceRow
                icon={Bell}
                title="Email updates"
                text="Receive operational summaries and shipment status updates by email."
                enabled={form.emailUpdates}
                onToggle={() => updateField('emailUpdates', !form.emailUpdates)}
              />
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Security">
            <div className="space-y-4">
              <FeatureCard icon={Lock} title="Password management" text="Backend reset flows already exist; wire this panel next to make it functional." />
              <FeatureCard icon={ShieldCheck} title="Two-factor authentication" text="Prepared as a professional placeholder to match the dashboard suite." />
            </div>
          </DashboardCard>

          <DashboardCard title="Save State">
            <div className="rounded-[24px] bg-slate-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Status</p>
              <p className="mt-2 text-xl font-semibold">{saved ? 'Preferences saved' : 'Changes not published yet'}</p>
              <p className="mt-2 text-sm text-white/65">
                These settings are currently local to the frontend while the profile update endpoints are still pending.
              </p>
            </div>
          </DashboardCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

function PreferenceRow({ icon: Icon, title, text, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[24px] bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700">
          <Icon size={18} />
        </div>
        <div>
          <p className="font-semibold text-slate-950">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{text}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative h-7 w-14 rounded-full transition ${enabled ? 'bg-green-500' : 'bg-slate-300'}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${enabled ? 'left-8' : 'left-1'}`}
        />
      </button>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[24px] bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700">
          <Icon size={18} />
        </div>
        <p className="font-semibold text-slate-950">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-500">{text}</p>
    </div>
  );
}
