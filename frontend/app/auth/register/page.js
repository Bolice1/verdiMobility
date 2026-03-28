'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

import { FadeIn } from '@/components/animations/fade-in';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerRequest } from '@/services/auth';
import { useAuthStore } from '@/store/auth-store';
import { siteImages } from '@/utils/site-images';

export default function RegisterPage() {
  const router = useRouter();
  const { setSession, setAuthLoading, setAuthError, loading, error } = useAuthStore();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    licenseNumber: '',
    companyName: '',
    companyEmail: '',
  });

  const validation = useMemo(() => {
    if (!form.name || !form.email || !form.password) return 'Complete all fields.';
    if (form.password.length < 10) return 'Password should be at least 10 characters.';
    if (form.role === 'driver' && !form.licenseNumber.trim()) {
      return 'License number is required for driver registration.';
    }
    if (form.role === 'company' && (!form.companyName.trim() || !form.companyEmail.trim())) {
      return 'Company name and company email are required for company registration.';
    }
    return null;
  }, [form]);

  async function onSubmit(event) {
    event.preventDefault();
    if (validation) {
      setAuthError(validation);
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await registerRequest(form);
      setSession({
        token: response.accessToken ?? null,
        user: response.user ?? {
          name: form.name,
          email: form.email,
          role: form.role,
        },
      });
      router.push('/dashboard');
    } catch (err) {
      const apiMessage =
        err.response?.data?.details?.map?.((item) => item.message).join(' ') ??
        err.response?.data?.error ??
        err.message ??
        'Unable to create account.';
      setAuthError(apiMessage);
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-green-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.18),transparent_20%),radial-gradient(circle_at_80%_80%,rgba(21,128,61,0.16),transparent_24%)]" />
          <div className="relative z-10 flex w-full flex-col justify-between px-14 py-14 text-white">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Scalable foundation</p>
              <h2 className="mt-4 max-w-lg font-[family:var(--font-display)] text-5xl font-semibold leading-tight">
                Build every role on one polished platform.
              </h2>
            </div>
            <div className="glass overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-5">
              <div className="relative overflow-hidden rounded-[24px]">
                <Image
                  src={siteImages.registerVisual}
                  alt="Cargo truck and freight yard"
                  width={1600}
                  height={1200}
                  className="h-[420px] w-full rounded-[24px] object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center px-4 py-10 md:px-8 lg:px-12">
          <FadeIn className="glass w-full rounded-[36px] p-8 sm:p-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-2xl bg-green-500/10 p-3 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Create workspace</p>
                <h1 className="text-3xl font-semibold tracking-tight">Open a new account</h1>
              </div>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <Input placeholder="Full name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
              <Input placeholder="Work email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
              <Input type="password" placeholder="Create password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {['user', 'driver', 'company'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          role,
                          companyEmail:
                            role === 'company' && !prev.companyEmail ? prev.email : prev.companyEmail,
                        }))
                      }
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        form.role === role
                          ? 'border-green-600 bg-green-600 text-white'
                          : 'border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-900/50'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {form.role === 'driver' ? (
                <div className="space-y-2">
                  <Input
                    placeholder="Driver license number"
                    value={form.licenseNumber}
                    onChange={(event) => setForm((prev) => ({ ...prev, licenseNumber: event.target.value }))}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Driver accounts require a valid license number.
                  </p>
                </div>
              ) : null}

              {form.role === 'company' ? (
                <div className="grid gap-3">
                  <Input
                    placeholder="Company name"
                    value={form.companyName}
                    onChange={(event) => setForm((prev) => ({ ...prev, companyName: event.target.value }))}
                  />
                  <Input
                    placeholder="Company email"
                    value={form.companyEmail}
                    onChange={(event) => setForm((prev) => ({ ...prev, companyEmail: event.target.value }))}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Company accounts require both a company name and company email.
                  </p>
                </div>
              ) : null}

              {error ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300"
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              ) : null}

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Register now'}
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </form>

            <div className="mt-8 flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span>Already have an account?</span>
              <Link href="/auth/login" className="font-semibold text-green-700 dark:text-green-300">
                Sign in
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
