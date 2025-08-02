"use client"

import * as React from "react"
import {
  Command,
  HeartPulse,
  Apple,
  Wallet,
  CalendarDays,
  ClipboardList,
  LifeBuoy,
  Send,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavProjects } from "@/components/dashboard/nav-projects"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Money",
      url: "/dashboard/money",
      icon: Wallet,
      isActive: true,
      items: [
        { title: "Overview", url: "/dashboard/money" },
        { title: "Income", url: "/dashboard/money/income" },
        { title: "Expenses", url: "/dashboard/money/expenses" },
        { title: "Debts", url: "/dashboard/money/debts" },
      ],
    },
    {
      title: "Health",
      url: "/dashboard/health",
      icon: HeartPulse,
      items: [
        { title: "Overview", url: "/dashboard/health" },
        { title: "Doctor Visits", url: "/dashboard/health/visits" },
        { title: "Medications", url: "/dashboard/health/medications" },
        { title: "Sleep & Hygiene", url: "/dashboard/health/routines" },
      ],
    },
    {
      title: "Fitness & Food",
      url: "/dashboard/fitness",
      icon: Apple,
      items: [
        { title: "Meals", url: "/dashboard/food/meals" },
        { title: "Exercise", url: "/dashboard/fitness/exercise" },
        { title: "Shopping List", url: "/dashboard/food/shopping" },
      ],
    },
    {
      title: "Tasks",
      url: "/dashboard/tasks",
      icon: ClipboardList,
      items: [
        { title: "Daily Tasks", url: "/dashboard/tasks/daily" },
        { title: "Chores", url: "/dashboard/tasks/chores" },
        { title: "Kids’ Responsibilities", url: "/dashboard/tasks/kids" },
      ],
    },
    {
      title: "Calendar",
      url: "/dashboard/calendar",
      icon: CalendarDays,
      items: [
        { title: "Family Calendar", url: "/dashboard/calendar" },
        { title: "School Events", url: "/dashboard/calendar/school" },
        { title: "Appointments", url: "/dashboard/calendar/appointments" },
      ],
    },
    {
      title: "Family",
      url: "/dashboard/family",
      icon: Users,
      items: [
        { title: "Members", url: "/dashboard/family" },
        { title: "Roles", url: "/dashboard/family/roles" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
  projects: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Family Hive</span>
                  <span className="truncate text-xs">Back to home</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {data.projects.length > 0 && <NavProjects projects={data.projects} />}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  )
}
