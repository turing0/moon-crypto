import { DashboardConfig, SidebarNavItem } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Traders",
      href: "/traders",
    },
    {
      title: "Analysis",
      href: "/analysis",
    },
    {
      title: "Exchanges",
      href: "/exchanges",
    },
    {
      title: "Billing",
      href: "/billing",
    },
    // {
    //   title: "Documentation",
    //   href: "/docs",
    // },
    // {
    //   title: "Support",
    //   href: "/support",
    //   disabled: true,
    // },
  ],
  sidebarNav: [
    {
      title: "Panel",
      href: "/dashboard",
      icon: "post",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: "settings",
    },
  ],
}

export const settingConfig: SidebarNavItem[] = [
    {
      title: "Account",
      href: "/settings",
      icon: "post",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: "settings",
    },
  ]