'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Battery, Book, Car, Cable, Clock, Gauge, GaugeCircle, PlugZap, Wrench } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { fetchPublicMetrics, type PublicMetrics } from '@/data/publicMetrics';

type ColorScheme = 'blue' | 'indigo' | 'purple' | 'emerald' | 'amber';

interface UpdateItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isLast?: boolean;
  colorScheme?: ColorScheme;
  highlight?: boolean;
}

function UpdateItem({ icon, title, description, isLast = false, colorScheme = 'blue', highlight = false }: UpdateItemProps) {
  const accentMap = {
    blue: 'bg-[rgba(55,86,132,0.22)] text-[hsl(var(--secondary))]',
    indigo: 'bg-[rgba(72,68,120,0.26)] text-[hsl(var(--secondary))]',
    purple: 'bg-[rgba(89,67,109,0.26)] text-[hsl(var(--secondary))]',
    emerald: 'bg-[rgba(38,83,77,0.26)] text-[hsl(var(--secondary))]',
    amber: 'bg-[rgba(104,78,38,0.28)] text-[#E31837]',
  };

  return (
    <div className={`rounded-sm px-4 py-4 ${highlight ? 'bg-[linear-gradient(135deg,rgba(227,24,55,0.14),rgba(19,27,46,0.9))]' : 'bg-[rgba(19,27,46,0.82)]'} ${!isLast ? 'mb-3' : ''}`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-sm ${accentMap[colorScheme]}`}>
          <div className="h-4 w-4">{icon}</div>
        </div>
        <div className="space-y-1">
          {highlight && (
            <p className="eyebrow-label text-[0.5rem] text-[#E31837]">Redline Moment</p>
          )}
          <h3 className={`font-[var(--font-display)] text-lg uppercase ${highlight ? 'text-[#ff6b81]' : 'text-foreground'}`}>{title}</h3>
          <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function PublicPage() {
  const [metrics, setMetrics] = useState<PublicMetrics>({
    hoursWorked: 0,
    partsInstalled: 0,
    totalParts: 0,
    progressPercentage: 0,
    taskProgress: {
      overallProgress: 0,
      totalTasks: 0,
      completedTasks: 0
    },
    altStats: {
      beersDrank: 0,
      cigarsSmoked: 0,
      lowesVisits: 0,
      hoursDriven: 0
    }
  });
  const [loading, setLoading] = useState(true);

  const latestUpdates = [
    {
      icon: <Award />,
      title: "Engine Turned On",
      description: "Completed first engine startup and brought the Roadster to life.",
      colorScheme: "amber" as ColorScheme
    },
    {
      icon: <GaugeCircle />,
      title: "Brakes Bled",
      description: "The brake system has been fully bled and is ready to go.",
      colorScheme: "emerald" as ColorScheme
    },
    {
      icon: <PlugZap />,
      title: "Wiring Harness Hooked Up",
      description: "The main wiring harness is hooked up and the electrical system is coming together.",
      colorScheme: "indigo" as ColorScheme
    },
    {
      icon: <Battery />,
      title: "Battery and Manual Disconnect Installed",
      description: "The battery is in place and the manual disconnect has been installed.",
      colorScheme: "purple" as ColorScheme
    },
    {
      icon: <Cable />,
      title: "Throttle Cable Attached",
      description: "The throttle cable is attached and connected up.",
      colorScheme: "blue" as ColorScheme
    }
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchPublicMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="app-card px-6 py-5 text-center">
          <p className="eyebrow-label text-[0.62rem] text-secondary">Initializing Dashboard</p>
          <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">Loading build statistics...</p>
        </div>
      </div>
    );
  }

  const completion = Math.round(metrics.taskProgress.overallProgress);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-2 py-4 text-foreground sm:px-4">
      <section>
        <Card className="app-section overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative p-6 sm:p-8">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "url('/images/background.JPEG')",
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,19,38,0.82),rgba(11,19,38,0.98))]" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-10">
                <div className="space-y-5">
                  <p className="eyebrow-label text-[0.68rem] text-secondary">Shelby Cobra Engineering</p>
                  <div className="max-w-2xl space-y-4">
                    <h1 className="text-4xl font-semibold uppercase leading-none text-foreground sm:text-6xl">
                      Factory Five
                      <br />
                      Mk5 Roadster
                      <br />
                      Build
                    </h1>
                    <div className="max-w-2xl space-y-4 text-sm leading-7 text-[hsl(var(--muted-foreground))] sm:text-base">
                      <p>
                        My brother Jared, my dad Donnie, and I are bringing a dream to life building a Factory Five MK5 Roadster, the ultimate modern tribute to the legendary 1965 Shelby Cobra.
                      </p>
                      <p>
                        This dashboard chronicles our family&apos;s journey as we transform boxes of parts into a hand-built, high-performance roadster. Two generations working side-by-side, we&apos;re documenting every triumph and challenge from that first exciting unboxing to the heart-pounding moment we fire up the engine for the first time.
                      </p>
                      <p>
                        Follow along as we create more than just a car. We&apos;re building memories, sharing knowledge, and crafting our own piece of automotive history one bolt at a time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
                  <div className="app-card p-4 sm:p-5">
                    <p className="eyebrow-label mb-3 text-[0.62rem] text-secondary">Dialed In</p>
                    <div className="mb-3 flex items-end justify-between gap-4">
                      <div>
                        <div className="font-[var(--font-display)] text-5xl leading-none text-[hsl(var(--secondary))]">
                          {completion}
                        </div>
                        <div className="mt-2 text-xs uppercase tracking-[0.28em] text-[hsl(var(--muted-foreground))]">
                          Percent Complete
                        </div>
                      </div>
                      <Gauge className="h-10 w-10 text-[#E31837]" />
                    </div>
                    <div className="progress-metal rounded-sm bg-[rgba(49,57,77,0.65)] p-[3px]">
                      <Progress
                        value={completion}
                        className="h-2 rounded-none bg-[rgba(11,19,38,0.9)] [&>div]:bg-[linear-gradient(90deg,#c0c0c2,#8893a8)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link href="/public/buildlog" className="glass-panel flex items-center justify-between rounded-sm px-4 py-4 transition-transform hover:-translate-y-0.5">
                      <div>
                        <p className="eyebrow-label text-[0.58rem] text-[hsl(var(--muted-foreground))]">Timeline</p>
                        <p className="mt-2 font-[var(--font-display)] text-xl uppercase text-foreground">Build Log</p>
                      </div>
                      <Car className="h-7 w-7 text-[hsl(var(--secondary))]" />
                    </Link>
                    <Link href="/public/guestbook" className="glass-panel flex items-center justify-between rounded-sm px-4 py-4 transition-transform hover:-translate-y-0.5">
                      <div>
                        <p className="eyebrow-label text-[0.58rem] text-[hsl(var(--muted-foreground))]">Community</p>
                        <p className="mt-2 font-[var(--font-display)] text-xl uppercase text-foreground">Guest Book</p>
                      </div>
                      <Book className="h-7 w-7 text-[hsl(var(--secondary))]" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 bg-[linear-gradient(180deg,rgba(39,10,18,0.92),rgba(10,18,34,0.96))] p-4 sm:p-5">
              <div className="space-y-2">
                <p className="eyebrow-label text-[0.62rem] text-[#E31837]">Redline Moment</p>
                <h2 className="text-2xl uppercase text-foreground">Engine Ignition</h2>
              </div>
              <div className="overflow-hidden rounded-sm bg-black shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                <div className="aspect-[9/16] w-full">
                  <iframe
                    className="h-full w-full"
                    src="https://www.youtube.com/embed/8SuuGKwHGGU?rel=0"
                    title="Factory Five Mk5 Roadster success video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6">
        <Card className="app-section overflow-hidden">
          <div className="grid gap-0 md:grid-cols-[0.8fr_1.2fr]">
            <div className="p-6 sm:p-8">
              <p className="eyebrow-label text-[0.62rem] text-secondary">Build Performance Overview</p>
              <h2 className="mt-3 text-3xl uppercase text-foreground">Spec HUD</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">
                A quick look at the numbers that show how far the build has come and how much work has gone into it.
              </p>
            </div>
            <div className="grid gap-px bg-[rgba(49,57,77,0.35)] p-px sm:grid-cols-3">
              <StatCard
                title="Hours Worked"
                value={metrics.hoursWorked}
                icon={<Clock className="text-[hsl(var(--secondary))]" size={22} />}
                unit="hrs"
                color="blue"
              />
              <StatCard
                title="Parts Installed"
                value={metrics.partsInstalled}
                icon={<Wrench className="text-[hsl(var(--secondary))]" size={22} />}
                secondaryText={`of ${metrics.totalParts} total parts`}
                color="indigo"
              />
              <StatCard
                title="Tasks Completed"
                value={metrics.taskProgress.completedTasks}
                icon={<Award className="text-[hsl(var(--secondary))]" size={22} />}
                secondaryText={`of ${metrics.taskProgress.totalTasks} total tasks`}
                color="emerald"
              />
            </div>
          </div>
        </Card>

        <Card className="app-card p-6 sm:p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-3 text-2xl uppercase text-foreground">
              <Clock className="h-5 w-5 text-[hsl(var(--secondary))]" />
              Latest Technical Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0 pt-6">
            {latestUpdates.map((update, index) => (
              <UpdateItem
                key={index}
                icon={update.icon}
                title={update.title}
                description={update.description}
                isLast={index === latestUpdates.length - 1}
                colorScheme={update.colorScheme}
                highlight={index === 0}
              />
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  unit,
  secondaryText,
  color = 'blue'
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  unit?: string;
  secondaryText?: string;
  color?: 'blue' | 'indigo' | 'purple' | 'emerald';
}) {
  const colorClasses = {
    blue: 'bg-[rgba(19,27,46,0.96)]',
    indigo: 'bg-[rgba(24,33,52,0.96)]',
    purple: 'bg-[rgba(31,38,57,0.96)]',
    emerald: 'bg-[rgba(18,29,43,0.96)]'
  };

  return (
    <div className={`p-5 ${colorClasses[color]}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="eyebrow-label text-[0.58rem] text-[hsl(var(--muted-foreground))]">{title}</h3>
        <div>{icon}</div>
      </div>
      <div className="flex flex-col">
        <div className="font-[var(--font-display)] text-4xl font-semibold text-foreground">
          {value.toLocaleString()}{unit ? ` ${unit}` : ''}
        </div>
        {secondaryText && (
          <div className="mt-2 text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
            {secondaryText}
          </div>
        )}
      </div>
    </div>
  );
}
