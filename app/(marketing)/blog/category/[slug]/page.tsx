import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClient } from "@/sanity/lib/client";
import { BlogCard } from "@/components/blog/blog-card";
import PageHeader from "@/components/layout/page-header";
import ScrollReveal from "@/components/animations/scroll-reveal";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// Fetch category details
async function getCategory(slug: string) {
  const client = getClient();
  if (!client) return null;
  return client.fetch(
    `*[_type == "category" && slug.current == $slug][0] {
      _id,
      name,
      description
    }`,
    { slug }
  );
}

// Fetch posts for the category
async function getCategoryPosts(slug: string) {
  const client = getClient();
  if (!client) return [];
  return client.fetch(
    `*[_type == "post" && $slug in categories[]->slug.current] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      mainImage {
        asset->{
          _id,
          url
        },
        alt
      },
      author-> {
        _id,
        name,
        "slug": slug.current,
        image {
          asset->{
            _id,
            url
          }
        }
      },
      categories[]-> {
        _id,
        name,
        "slug": slug.current
      },
      publishedAt
    }`,
    { slug }
  );
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug);

  if (!category) {
    return {
      title: "Category Not Found | Hashtag Tech",
    };
  }

  return {
    title: `${category.name} - Blog Category | Hashtag Tech`,
    description: category.description || `Read the latest articles about ${category.name} at Hashtag Tech.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryPromise = getCategory(params.slug);
  const postsPromise = getCategoryPosts(params.slug);
  
  const [category, posts] = await Promise.all([categoryPromise, postsPromise]);

  if (!category) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={category.name}
        description={`Explore our latest thoughts and insights on ${category.name}.`}
        pill="Category"
        breadcrumb={[
          { label: "Blog", href: "/blog" },
          { label: category.name }
        ]}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any, index: number) => {
                // Adapt Sanity post to BlogCard props
                const adaptedPost = {
                   id: post._id,
                   title: post.title,
                   slug: post.slug,
                   excerpt: post.excerpt || "",
                   mainImage: post.mainImage?.asset?.url || "/placeholder.svg",
                   content: "",
                   author: {
                     id: post.author?._id || "unknown",
                     name: post.author?.name || "Unknown Author",
                     slug: post.author?.slug || "unknown",
                     image: post.author?.image?.asset?.url || "/placeholder.svg",
                     bio: "",
                   },
                   categories: post.categories?.map((cat: any) => ({
                     id: cat._id,
                     name: cat.name,
                     slug: cat.slug,
                   })) || [],
                   publishedAt: post.publishedAt,
                };

                return (
                  <ScrollReveal key={post._id || index} delay={index * 0.05}>
                    <BlogCard post={adaptedPost} />
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border border-border/50">
              <h3 className="text-2xl font-bold mb-4">No articles found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We haven't published any articles in the <span className="font-semibold text-foreground">{category.name}</span> category yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
