"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Family Hive
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Manage your family’s money, health, meals, schedules, and tasks — all in one easy app.
        </p>
        <Button size="lg" className="mt-4" onClick={() => window.location.href = "/register"}>
          Get Started Free
        </Button>
      </section>

      {/* Features Section */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Money Management",
            description:
              "Track incomes, expenses, and budgets to keep your family finances on point.",
          },
          {
            title: "Health & Wellness",
            description:
              "Monitor health metrics, appointments, and reminders for every family member.",
          },
          {
            title: "Food & Meals",
            description:
              "Plan meals, track groceries, and make healthy eating easy and fun.",
          },
          {
            title: "Scheduling & Time",
            description:
              "Coordinate calendars, events, and reminders to stay organized as a family.",
          },
          {
            title: "Tasks & Chores",
            description:
              "Assign, track, and complete chores and tasks with clear accountability.",
          },
        ].map(({ title, description }) => (
          <Card key={title} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Testimonials / Social Proof (Optional) */}
      {/* You can add a carousel or quotes here */}

      {/* Footer */}
      <footer className="mt-20 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Family Hive. All rights reserved.
      </footer>
    </main>
  );
}
