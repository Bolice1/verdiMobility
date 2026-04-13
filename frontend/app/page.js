import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Boxes,
  CalendarClock,
  CircleCheckBig,
  Phone,
  Route,
  ShieldCheck,
  Truck,
} from 'lucide-react';

import { FadeIn } from '@/components/animations/fade-in';
import { StaggerList } from '@/components/animations/stagger-list';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { siteImages } from '@/utils/site-images';

const whyChoose = [
  {
    title: 'Real-time visibility',
    text: 'Follow every shipment, delivery, and dispatch step without switching tools.',
    icon: ShieldCheck,
  },
  {
    title: 'Backend-ready workflows',
    text: 'Structured to connect cleanly to your logistics backend for orders, tracking, and status updates.',
    icon: Route,
  },
  {
    title: 'Professional operations',
    text: 'Built for companies that need a polished customer face and a serious internal dashboard.',
    icon: Boxes,
  },
];

const services = [
  {
    title: 'Ocean freight coordination',
    text: 'Plan container movement and monitor shipping activity with high-level route visibility.',
    image: siteImages.landingContainers,
  },
  {
    title: 'Road transport dispatch',
    text: 'Assign vehicles, optimize last-mile movement, and manage delivery execution with confidence.',
    image: siteImages.landingRoad,
  },
  {
    title: 'Air cargo monitoring',
    text: 'Track urgent cargo lanes and maintain premium communication across fast-moving operations.',
    image: siteImages.landingAir,
  },
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_24%),linear-gradient(180deg,#f1f7f1_0%,transparent_100%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_24%),linear-gradient(180deg,#07110a_0%,transparent_100%)]" />

      <header className="relative z-10 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-green-700 to-green-500 text-white shadow-lg shadow-green-700/30">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">verdiMobility</p>
              <h1 className="text-lg font-semibold">Logistics Platform</h1>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex dark:text-slate-300">
            <a href="#why">Why us</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#quote">Request quote</a>
            <Link href="/contact">Contact</Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/auth/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
<Link href="/">
              <Button>
                Explore Platform
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 md:px-6">
        <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.03fr_0.97fr] lg:py-16">
          <FadeIn className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/85 px-4 py-2 text-sm font-medium text-green-700 shadow-sm dark:border-green-900/60 dark:bg-slate-900/60 dark:text-green-300">
              <CalendarClock size={15} />
              Connect your logistics business to a world of possibilities
            </div>

            <div className="space-y-5">
              <h2 className="max-w-[11ch] font-[family:var(--font-display)] text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
                Logistics operations designed for trust, speed, and visibility.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                This platform is focused only on logistics. Manage transport requests, shipments,
                drivers, dispatch workflows, analytics, and business communication through a more
                professional, image-rich, and scalable frontend experience.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/auth/register">
                <Button className="min-w-44">Request a quote</Button>
              </Link>
<Link href="/">
                <Button variant="secondary" className="min-w-44">
                  Explore Services
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['24/7', 'Shipment monitoring'],
                ['16', 'Regional logistics hubs'],
                ['98%', 'Dispatch accuracy target'],
              ].map(([value, label]) => (
                <div key={label} className="glass rounded-[26px] px-5 py-4">
                  <p className="text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="relative">
              <div className="absolute -left-10 top-14 h-44 w-44 rounded-full bg-green-400/20 blur-3xl dark:bg-green-500/20" />
              <div className="absolute -right-8 bottom-10 h-48 w-48 rounded-full bg-green-700/20 blur-3xl" />
              <div className="glass relative overflow-hidden rounded-[42px] border border-white/40 p-3">
                <Image
                  src={siteImages.landingHero}
                  alt="Container ship, truck, and freight operations"
                  width={1600}
                  height={1100}
                  className="h-[560px] w-full rounded-[32px] object-cover"
                  priority
                />
                <div className="absolute inset-3 rounded-[32px] bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 rounded-[26px] bg-white/90 px-6 py-5 dark:bg-slate-950/75">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Integrated logistics</p>
                  <p className="mt-2 max-w-xs text-xl font-semibold">Freight, dispatch, fleet, and customer operations in one system.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        <section id="why" className="space-y-8 py-8">
          <FadeIn className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-700 dark:text-green-400">Why logistics teams choose us</p>
            <h3 className="mt-3 font-[family:var(--font-display)] text-4xl font-semibold tracking-tight">Why logistics teams choose us</h3>
          </FadeIn>
          <StaggerList className="grid gap-5 md:grid-cols-3">
            {whyChoose.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title}>
                  <div className="rounded-2xl bg-green-500/10 p-3 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                    <Icon size={18} />
                  </div>
                  <h4 className="mt-5 text-xl font-semibold">{item.title}</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.text}</p>
                </Card>
              );
            })}
          </StaggerList>
        </section>

        <section id="about" className="grid gap-6 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[34px]">
              <Image
                src={siteImages.landingContainers}
                alt="Container stacks in a shipping yard"
                width={1600}
                height={1200}
                className="h-[440px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 rounded-[24px] bg-white/90 px-5 py-4 dark:bg-slate-950/75">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">About us</p>
                <p className="mt-2 max-w-sm text-xl font-semibold">We design cleaner digital experiences for real logistics work.</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="glass rounded-[34px] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-700 dark:text-green-400">About us</p>
            <h3 className="mt-4 font-[family:var(--font-display)] text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              From shipment booking to route analytics, every screen is built for logistics clarity.
            </h3>
            <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
              The frontend is intentionally tailored to logistics only. That means shipment metrics,
              route visibility, fleet cards, delivery status, quote requests, contact flows, and
              strong operational presentation without generic business filler.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                'Shipment lifecycle visibility',
                'Fleet and driver management',
                'Professional quote and contact experience',
                'Analytics-ready interface patterns',
              ].map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-[22px] border border-slate-200/70 px-4 py-3 dark:border-slate-800">
                  <CircleCheckBig size={18} className="text-green-600" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{point}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        <section id="services" className="space-y-8 py-8">
          <FadeIn className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-700 dark:text-green-400">Wide variety of logistics services</p>
            <h3 className="mt-3 font-[family:var(--font-display)] text-4xl font-semibold tracking-tight">Logistics-only service presentation</h3>
          </FadeIn>
          <div className="grid gap-6 lg:grid-cols-3">
            {services.map((service, index) => (
              <FadeIn key={service.title} delay={0.06 + index * 0.04}>
                <Card className="overflow-hidden p-0">
                  <div className="relative">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={1600}
                      height={1200}
                      className="h-60 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                  </div>
                  <div className="p-6">
                    <h4 className="text-2xl font-semibold">{service.title}</h4>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{service.text}</p>
                    <Link href="/contact" className="mt-5 inline-flex items-center text-sm font-semibold text-green-700 dark:text-green-300">
                      Learn more
                      <ArrowRight size={15} className="ml-2" />
                    </Link>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="grid gap-6 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          <FadeIn className="glass rounded-[34px] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-700 dark:text-green-400">Your cargo is safe with us</p>
            <h3 className="mt-4 font-[family:var(--font-display)] text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Professional reassurance for customers, dispatchers, and fleet operators.
            </h3>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                ['Freight management', 'Structured shipment records and operator-friendly dashboards.'],
                ['Safe logistics', 'Clear status updates and route monitoring surfaces.'],
                ['Fast support', 'Contact and quote flows that actually look trustworthy.'],
                ['Data visibility', 'Metrics, activity tables, and delivery signals ready for growth.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-[24px] bg-slate-100/80 p-5 dark:bg-slate-900/70">
                  <p className="font-semibold">{title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="relative overflow-hidden rounded-[34px]">
              <Image
                src={siteImages.ordersVisual}
                alt="Truck and warehouse logistics scene"
                width={1600}
                height={1200}
                className="h-full min-h-[420px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-[26px] bg-white/88 p-6 dark:bg-slate-950/78">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Trusted experience</p>
                <p className="mt-2 text-2xl font-semibold">A logistics site should feel operational, not generic.</p>
              </div>
            </div>
          </FadeIn>
        </section>

        <section id="quote" className="grid gap-6 py-10 lg:grid-cols-[1fr_1fr]">
          <FadeIn className="glass rounded-[34px] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-700 dark:text-green-400">Request or call back</p>
            <h3 className="mt-4 font-[family:var(--font-display)] text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Request a quote or book a logistics conversation.
            </h3>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
              This section is inspired by the structure of the reference site, but tailored to your
              logistics product and future backend integration.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <input className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm dark:border-slate-800 dark:bg-slate-950/50" placeholder="Your name" />
              <input className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm dark:border-slate-800 dark:bg-slate-950/50" placeholder="Company email" />
              <input className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm dark:border-slate-800 dark:bg-slate-950/50" placeholder="Shipping route" />
              <input className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm dark:border-slate-800 dark:bg-slate-950/50" placeholder="Cargo type" />
            </div>
            <Button className="mt-6">Request quote</Button>
          </FadeIn>

          <FadeIn delay={0.08} className="overflow-hidden rounded-[34px]">
            <div className="relative">
              <Image
                src={siteImages.mapVisual}
                alt="Map and logistics route planning visual"
                width={1600}
                height={1200}
                className="h-full min-h-[420px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-[24px] bg-white/90 px-5 py-4 dark:bg-slate-950/78">
                <Phone size={18} className="text-green-700 dark:text-green-300" />
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Contact us</p>
                  <p className="font-semibold">+20 111 975 8633</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>
    </div>
  );
}
