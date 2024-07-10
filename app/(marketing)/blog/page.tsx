import { allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";

import { BlogPosts } from "@/components/content/blog-posts";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Blog – Moon Crypto",
  description: "Latest news and updates from Moon Crypto.",
});

export default async function BlogPage() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date));
    });

  return <BlogPosts posts={posts} />;
}
