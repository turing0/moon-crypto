import { DashboardConfig, SidebarNavItem } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Copy-Trading",
      href: "/positions",
      dropdown: [
        {
          title: "Positions",
          href: "/positions",
        },
        {
          title: "Top Traders",
          href: "/traders",
        },
      ],
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
      title: "Dashboard",
      href: "/dashboard",
      icon: "post",
    },
    {
      title: "Billing",
      href: "/billing",
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
      icon: "user",
    },
    {
      title: "Billing",
      href: "/billing",
      icon: "billing",
    },
    {
      title: "Exchanges",
      href: "/exchanges",
      icon: "arrowRightLeft",
    },
  ]