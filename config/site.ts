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
    twitter: "https://twitter.com/nosnos0408",
    github: "https://github.com/turing0/moon-crypto",
  },
  icons: {
    icon: "/_static/favicons/favicon.ico",
    shortcut: "/_static/favicons/favicon-16x16.png",
    apple: "/_static/favicons/apple-touch-icon.png",
  },
  mailSupport: "support@mooncryp.to",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      // { title: "About", href: "#" },
      // { title: "Disclaimer", href: "#" },
      { title: "Contact", href: "mailto:support@mooncryp.to" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Copy Trading", href: "/copy-trading" },
      { title: "Trader Analysis", href: "/analysis" },
      // { title: "Customers", href: "#" },
      // { title: "Changelog", href: "#" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Docs", href: "/docs" },
      { title: "Blog", href: "/blog" },
      { title: "Status", href: "https://status.mooncryp.to" },
      // { title: "Code Blocks", href: "#" },
    ],
  },
];
