// import { DashboardConfig, SidebarNavItem } from "types"

// export const dashboardConfig: DashboardConfig = {
//   mainNav: [
//     {
//       title: "Dashboard",
//       href: "/dashboard",
//     },
//     {
//       title: "Copy-Trading",
//       href: "/positions",
//       dropdown: [
//         {
//           title: "Positions",
//           href: "/positions",
//         },
//         {
//           title: "Top Traders",
//           href: "/traders",
//         },
//         {
//           title: "Manage Copy-Trading",
//           href: "/copy-trading/manage",
//         },
//       ],
//     },
//     // {
//     //   title: "Traders",
//     //   href: "/traders",
//     // },
//     {
//       title: "Analysis",
//       href: "/analysis",
//     },
//     {
//       title: "Exchanges",
//       href: "/exchanges",
//     },
//     {
//       title: "Billing",
//       href: "/billing",
//     },
//     // {
//     //   title: "Documentation",
//     //   href: "/docs",
//     // },
//     // {
//     //   title: "Support",
//     //   href: "/support",
//     //   disabled: true,
//     // },
//   ],
//   sidebarNav: [
//     {
//       title: "Dashboard",
//       href: "/dashboard",
//       icon: "post",
//     },
//     {
//       title: "Billing",
//       href: "/billing",
//       icon: "billing",
//     },
//     {
//       title: "Settings",
//       href: "/settings",
//       icon: "settings",
//     },
//   ],
// }

// export const settingConfig: SidebarNavItem[] = [
//     {
//       title: "Account",
//       href: "/settings",
//       icon: "user",
//     },
//     {
//       title: "Billing",
//       href: "/billing",
//       icon: "billing",
//     },
//     {
//       title: "Exchanges",
//       href: "/exchanges",
//       icon: "arrowRightLeft",
//     },
//   ]

import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      {
        href: "/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.USER,
      },
      { href: "/dashboard/charts", icon: "lineChart", title: "Charts" },
      {
        href: "/admin/orders",
        icon: "package",
        title: "Orders",
        badge: 2,
        authorizeOnly: UserRole.ADMIN,
      },
      { href: "/analysis", icon: "lineChart", title: "Analysis" },

      // {
      //   href: "#/dashboard/posts",
      //   icon: "post",
      //   title: "User Posts",
      //   authorizeOnly: UserRole.USER,
      //   disabled: true,
      // },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/settings", icon: "settings", title: "Settings" },
      // { href: "/", icon: "home", title: "Homepage" },
      // { href: "/docs", icon: "bookOpen", title: "Documentation" },
      // {
      //   href: "#",
      //   icon: "messages",
      //   title: "Support",
      //   authorizeOnly: UserRole.USER,
      //   disabled: true,
      // },
    ],
  },
];
