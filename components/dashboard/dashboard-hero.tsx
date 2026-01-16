"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

interface Trip {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  imageUrl: string | null;
  segments: Array<{
    startTitle: string;
    endTitle: string;
  }>;
}

interface DashboardHeroProps {
  nextTrip: Trip | null;
  userName: string;
}

export function DashboardHero({ nextTrip, userName }: DashboardHeroProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
  } | null>(null);

  useEffect(() => {
    if (!nextTrip) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const tripDate = new Date(nextTrip.startDate);
      const difference = tripDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [nextTrip]);

  // No upcoming trip - inspirational hero
  if (!nextTrip) {
    return (
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src="/luxury-hotel-room.png"
          alt="Plan Your Next Journey"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--hero-overlay)" }}
        />
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
                Welcome back, {userName}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Your next extraordinary experience awaits
              </p>
              <Link href="/trips/new">
                <Button
                  size="lg"
                  className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 py-6 rounded-lg font-medium shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  Plan Your Next Journey
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Has upcoming trip - countdown hero
  const destinations = nextTrip.segments
    .map((s) => s.startTitle)
    .filter((title, index, arr) => arr.indexOf(title) === index)
    .slice(0, 3)
    .join(", ");

  return (
    <section className="relative h-[75vh] min-h-[600px] overflow-hidden">
      <Image
        src={nextTrip.imageUrl || "/luxury-hotel-room.png"}
        alt={nextTrip.title}
        fill
        className="object-cover"
        priority
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))",
        }}
      />
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                <Calendar className="w-4 h-4" />
                Your Next Adventure
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-4 leading-tight">
              {nextTrip.title}
            </h1>
            {destinations && (
              <div className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl text-white/90 mb-6">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>{destinations}</span>
              </div>
            )}

            {timeLeft && (
              <div className="mb-8">
                <div className="flex items-baseline gap-3 sm:gap-6 mb-3">
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                      {timeLeft.days}
                    </div>
                    <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wide">
                      Days
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl text-white/60 font-light">:</div>
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                      {timeLeft.hours}
                    </div>
                    <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wide">
                      Hours
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl text-white/60 font-light">:</div>
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                      {timeLeft.minutes}
                    </div>
                    <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wide">
                      Minutes
                    </div>
                  </div>
                </div>
                <p className="text-white/70 text-base sm:text-lg">
                  Departing{" "}
                  {new Date(nextTrip.startDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/trips/${nextTrip.id}`}>
                <Button
                  size="lg"
                  className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 py-4 rounded-lg font-medium shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  View Trip Details
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href={`/trips/${nextTrip.id}/edit`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 text-lg px-8 py-4 rounded-lg font-medium border border-white/30"
                >
                  <Pencil className="w-5 h-5" />
                  Edit Trip
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
