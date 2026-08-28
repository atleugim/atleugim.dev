import type { APIContext } from "astro";
import rss from "@astrojs/rss";

import { SITE_DESCRIPTION, SITE_TITLE } from "~/lib/const";
import { getPosts } from "~/lib/posts";

export const prerender = true;

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      categories: post.data.tags,
      link: `/blog/${post.id}`,
    })),
  });
}
