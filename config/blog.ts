export const BLOG_CATEGORIES: {
  title: string;
  slug: "news" | "tips";
  description: string;
}[] = [
  {
    title: "News",
    slug: "news",
    description: "Updates and announcements from MoonCrypto.",
  },
  {
    title: "Tips",
    slug: "tips",
    description: "Crypto trading tips.",
  },
];

export const BLOG_AUTHORS = {
  mooncrypto: {
    name: "MoonCrypto",
    image: "/_static/avatars/mooncrypto.png",
    link: "/",
  },
  shadcn: {
    name: "shadcn",
    image: "/_static/avatars/shadcn.jpeg",
    link: "/",
  },
};
