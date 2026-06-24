/**
 * Next.js App Router file map:
 *
 * app/blog/page.tsx:
 *   export default async function Page() {
 *     const posts = await fetch(API, { next: { revalidate: 300 } }).then(r => r.json());
 *     return posts.map(post => <Link href={`/blog/${post.slug}`}>{post.title}</Link>);
 *   }
 *
 * app/blog/[slug]/page.tsx:
 *   export async function generateMetadata({ params }) {
 *     const post = await getPost((await params).slug);
 *     return { title: post.title, description: post.excerpt };
 *   }
 *   export default async function Page({ params }) {
 *     const post = await getPost((await params).slug);
 *     if (!post) notFound();
 *     return <article><h1>{post.title}</h1><Image src={post.image} alt="" fill /></article>;
 *   }
 *
 * Add app/blog/loading.tsx, error.tsx, and app/blog/[slug]/not-found.tsx.
 */
export const blogListingDetailSolution = {
  strategy:
    "Server Components + dynamic route + cached fetch with revalidation",
  files: [
    "app/blog/page.tsx",
    "app/blog/[slug]/page.tsx",
    "loading.tsx",
    "error.tsx",
    "not-found.tsx",
  ],
};
