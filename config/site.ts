import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Moon Crypto",
  description:
    "Moon Crypto is a top crypto copy trading platform, enabling users to follow expert traders and grow their assets effortlessly. Join us and watch your investments soar!",
  url: site_url,
  ogImage: `${site_url}/_static/og.png`,
  links: {
    twitter: "https://twitter.com/miickasmt",
    github: "https://github.com/mickasmt/next-saas-stripe-starter",
  },
  mailSupport: "support@mooncryp.to",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      // { title: "About", href: "#" },
      // { title: "Disclaimer", href: "#" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Copy Trading", href: "/traders" },
      { title: "Trader Analysis", href: "/analysis" },
      // { title: "Customers", href: "#" },
      // { title: "Changelog", href: "#" },
    ],
  },
  {
    title: "Docs",
    items: [
      { title: "Introduction", href: "#" },
      // { title: "Installation", href: "#" },
      // { title: "Components", href: "#" },
      // { title: "Code Blocks", href: "#" },
    ],
  },
];
