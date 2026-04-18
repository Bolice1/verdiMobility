'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

import { FadeIn } from '@/components/animations/fade-in';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginRequest } from '@/services/auth';
import { useAuthStore } from '@/store/auth-store';
import { siteImages } from '@/utils/site-images';

export default function LoginPage() {
  const router = useRouter();
  const { setSession, setAuthLoading, setAuthError, loading, error } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });

  const validation = useMemo(() => {
    if (!form.email || !form.password) return null;
    if (!form.email.includes('@')) return 'Enter a valid email address.';
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
      const response = await loginRequest(form);
      setSession({
        token: response.accessToken ?? null,
        user: response.user ?? {
          name: 'Platform User',
          email: form.email,
          role: 'user',
        },
      });
      router.push('/dashboard');
    } catch (err) {
      setAuthError(err.response?.data?.error ?? err.message ?? 'Unable to sign in.');
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex items-center px-4 py-10 md:px-8 lg:px-12">
          <FadeIn className="glass w-full rounded-[36px] p-8 sm:p-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-2xl bg-green-500/10 p-3 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Secure access</p>
                <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
              </div>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Email address</label>
                <Input
                  placeholder="ops@verdimobility.com"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </div>

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
                {loading ? 'Signing in...' : 'Login to platform'}
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </form>

            <div className="mt-8 flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span>New here?</span>
              <Link href="/auth/register" className="font-semibold text-green-700 dark:text-green-300">
                Create an account
              </Link>
            </div>
          </FadeIn>
        </div>

        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-green-500" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_20%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.22),transparent_18%)]" />
          <div className="relative z-10 flex w-full flex-col justify-between px-14 py-14 text-white">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Modern logistics UX</p>
              <h2 className="mt-4 max-w-md font-[family:var(--font-display)] text-5xl font-semibold leading-tight">
                Navigate operations with cinematic clarity.
              </h2>
            </div>
            <div className="glass overflow-hidden rounded-[34px] border border-white/20 bg-white/10 p-4">
              <div className="relative overflow-hidden rounded-[24px]">
                <Image
                  src={siteImages.loginVisual}
                  alt="Logistics warehouse operations"
                  width={1600}
                  height={1200}
                  className="h-[420px] w-full rounded-[24px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
