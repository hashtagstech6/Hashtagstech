"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { BlogPost } from "@/types/blog";
import { BlogCard } from "@/components/blog/blog-card";
import ScrollReveal from "@/components/animations/scroll-reveal";
import { Skeleton } from "@/components/ui/skeleton";

export default function LatestInsights() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts?limit=3");
        if (response.ok) {
          const data = await response.json();
          // Convert Sanity data to BlogPost format
          const adaptedPosts = data.map((post: any) => ({
            id: post._id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || "",
            mainImage: post.mainImage?.asset?.url || "/images/blog/placeholder.jpg",
            content: "",
            author: {
              id: post.author._id,
              name: post.author.name,
              slug: post.author.slug,
              image: post.author.image?.asset?.url || "/images/authors/placeholder.jpg",
              bio: "",
            },
            categories: post.categories?.map((cat: any) => ({
              id: cat._id,
              name: cat.name,
              slug: cat.slug,
            })) || [],
            publishedAt: post.publishedAt,
          }));
          setPosts(adaptedPosts);
        }
      } catch (error) {
        console.error("[LatestInsights] Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
            <div className="max-w-2xl w-full">
               <Skeleton className="h-4 w-32 mb-2 bg-primary/20" />
               <Skeleton className="h-12 w-3/4 md:w-1/2" />
            </div>
            <Skeleton className="h-4 w-32 hidden md:block" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-4">
                 <Skeleton className="aspect-video w-full rounded-lg" />
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-primary/20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full opacity-80" />
                    <Skeleton className="h-4 w-2/3 opacity-80" />
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const latestPosts = posts.slice(0, 3);

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none fade-in-section" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
            <div className="max-w-2xl">
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">
                From Our Blog
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Latest Insights & News
              </h2>
            </div>
            
            <Link 
              href="/blog" 
              className="hidden md:inline-flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors group"
            >
              View All Posts
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post, index) => (
             <ScrollReveal key={post.id} delay={index * 0.1}>
                <BlogCard post={post} />
             </ScrollReveal>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
             <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors group"
            >
              View All Posts
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
        </div>
      </div>
    </section>
  );
}
