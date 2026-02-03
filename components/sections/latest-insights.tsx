"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllBlogPosts } from "@/data/blog-posts";
import { BlogCard } from "@/components/blog/blog-card";
import ScrollReveal from "@/components/animations/scroll-reveal";

export default function LatestInsights() {
  const latestPosts = getAllBlogPosts().slice(0, 3);

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
