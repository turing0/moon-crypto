import { DocsConfig } from "types";

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Guides",
      href: "/guides",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
        // {
        //   title: "Installation",
        //   href: "/docs/installation",
        // },
      ],
    },
    {
      title: "Exchanges",
      items: [
        {
          title: "Setup exchange API",
          href: "/docs/exchanges",
        },
        {
          title: "Connect to Binance",
          href: "/docs/exchanges/connect-to-binance",
        },
        {
          title: "Connect to Bitget",
          href: "/docs/exchanges/connect-to-bitget",
        },
        {
          title: "Connect to Bybit",
          href: "/docs/exchanges/connect-to-bybit",
        },
        {
          title: "Connect to OKX",
          href: "/docs/exchanges/connect-to-okx",
        },
        {
          title: "Connect to Bitfinex",
          href: "/docs/exchanges/connect-to-bitfinex",
        },
      ],
    },
    {
      title: "Copy Trading",
      items: [
        {
          title: "Introduction",
          href: "/docs/copy-trading",
        },
        {
          title: "Error Solutions",
          href: "/docs/copy-trading/error-solutions",
        },
      ],
    },
    // {
    //   title: "Configuration",
    //   items: [
    //     {
    //       title: "Authentification",
    //       href: "/docs/configuration/authentification",
    //     },
    //     {
    //       title: "Blog",
    //       href: "/docs/configuration/blog",
    //     },
    //     {
    //       title: "Components",
    //       href: "/docs/configuration/components",
    //     },
    //     {
    //       title: "Config files",
    //       href: "/docs/configuration/config-files",
    //     },
    //     {
    //       title: "Database",
    //       href: "/docs/configuration/database",
    //     },
    //     {
    //       title: "Email",
    //       href: "/docs/configuration/email",
    //     },
    //     {
    //       title: "Layouts",
    //       href: "/docs/configuration/layouts",
    //     },
    //     {
    //       title: "Markdown files",
    //       href: "/docs/configuration/markdown-files",
    //     },
    //     {
    //       title: "Subscriptions",
    //       href: "/docs/configuration/subscriptions",
    //     },
    //   ],
    // },
  ],
};
