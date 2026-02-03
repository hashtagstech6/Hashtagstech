"use client";

import Link from "next/link";
import ScrollReveal from "@/components/animations/scroll-reveal";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbItem[];
  pill?: string;
}

export default function PageHeader({
  title,
  description,
  breadcrumb = [],
  pill,
}: PageHeaderProps) {
  return (
    <section className="bg-black py-20 md:py-28 relative overflow-hidden">
        {/* Background Gradients for subtle depth */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary-deep/10 rounded-full blur-[120px]" />
        </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="max-w-4xl text-center mx-auto space-y-6">
            {/* Pill / Breadcrumb */}
            <div className="flex justify-center items-center gap-2 mb-6">
               <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white shadow-sm">
                   <Link href="/" className="text-[10px] md:text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest no-underline hover:no-underline leading-none">
                       HASHTAG TECH
                   </Link>
                   <span className="mx-2 w-3 h-[1.5px] bg-primary block rounded-full"></span>
                   
                   {/* Current Page Label */}
                   {breadcrumb && breadcrumb.length > 0 ? (
                       <span className="text-[10px] md:text-xs font-black text-foreground uppercase tracking-widest leading-none">
                           {breadcrumb[breadcrumb.length - 1]?.label}
                       </span>
                   ) : pill ? (
                       <span className="text-[10px] md:text-xs font-black text-foreground uppercase tracking-widest leading-none">
                           {pill}
                       </span>
                   ) : null}
               </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight" style={{ textShadow: "none" }}>
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
