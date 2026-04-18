'use client';

import Image from 'next/image';
import { Clock3, Mail, MapPinned, Phone } from 'lucide-react';

import { FadeIn } from '@/components/animations/fade-in';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { siteImages } from '@/utils/site-images';

const contactCards = [
  { icon: Mail, title: 'Mail us 24/7', text: 'support@verdimobility.com' },
  { icon: MapPinned, title: 'Our location', text: 'Cairo logistics corridor, Egypt' },
  { icon: Phone, title: 'Call us 24/7', text: '+20 111 975 8633' },
  { icon: Clock3, title: 'Working days', text: 'Mon - Sat / 8AM - 8PM' },
];

export default function ContactPage() {
  return (
    <AppShell eyebrow="Contact and support" title="Contact logistics operations">
      <div className="space-y-6">
        <FadeIn className="relative overflow-hidden rounded-[34px]">
          <Image
            src={siteImages.contactHero}
            alt="Cargo ship on the water"
            width={1600}
            height={1200}
            className="h-[360px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/25 to-transparent" />
          <div className="absolute left-8 top-1/2 max-w-xl -translate-y-1/2 text-white">
            <p className="text-xs uppercase tracking-[0.28em] text-white/60">Contact us</p>
            <h2 className="mt-3 font-[family:var(--font-display)] text-5xl font-semibold tracking-tight">Speak with our logistics team.</h2>
          </div>
        </FadeIn>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {contactCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <FadeIn key={card.title} delay={0.05 + index * 0.04}>
                <Card>
                  <div className="rounded-2xl bg-green-500/10 p-3 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{card.text}</p>
                </Card>
              </FadeIn>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <FadeIn>
            <Card>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-700 dark:text-green-400">Write us what you want to know</p>
              <h3 className="mt-4 font-[family:var(--font-display)] text-4xl font-semibold tracking-tight">Send a message to staff</h3>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <input className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm dark:border-slate-800 dark:bg-slate-950/50" placeholder="Your name" />
                <input className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm dark:border-slate-800 dark:bg-slate-950/50" placeholder="Your email" />
                <input className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm dark:border-slate-800 dark:bg-slate-950/50 sm:col-span-2" placeholder="Subject" />
                <textarea className="min-h-40 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950/50 sm:col-span-2" placeholder="Tell us about your shipment, route, or operational request" />
              </div>
              <Button className="mt-6">Contact us now</Button>
            </Card>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="relative overflow-hidden rounded-[34px]">
              <Image
                src={siteImages.mapVisual}
                alt="Map visualization for logistics service area"
                width={1600}
                height={1200}
                className="h-full min-h-[480px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 rounded-[24px] bg-white/90 px-5 py-4 dark:bg-slate-950/78">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Service map</p>
                <p className="mt-2 text-xl font-semibold">Regional service routes and response coverage.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </AppShell>
  );
}
