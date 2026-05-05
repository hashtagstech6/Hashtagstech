import { Metadata } from "next";
import PageHeader from "@/components/layout/page-header";
import { getClient } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/ui/magnetic-button";

interface SuccessStory {
  _id: string;
  clientCompany: string;
  slug: { current: string };
  country?: string;
  featuredImage: {
    asset: { url: string };
    alt: string;
  };
  excerpt: string;
}

export const metadata: Metadata = {
  title: "Our Work | Hashtag Tech",
  description: "Explore our portfolio of successful AI-powered web and mobile applications. See how we help businesses transform digitally.",
};

export const revalidate = 3600;

export default async function WorkPage() {
  const client = getClient();
  let stories: SuccessStory[] = [];

  try {
    if (client) {
      stories = await client.fetch(`
        *[_type == "successStory" && (isActive == true)] | order(order asc) {
          _id,
          clientCompany,
          slug,
          country,
          featuredImage {
            asset->{ url },
            alt
          },
          excerpt
        }
      `, {}, { next: { tags: ["successStories"] } });
    }
  } catch (error) {
    console.error("Error fetching success stories:", error);
  }

  return (
    <main className="min-h-screen">
      <PageHeader
        title="Our Work"
        description="A showcase of our most impactful projects and success stories. From AI integration to global web platforms."
        pill="Portfolio"
        breadcrumb={[{ label: "Work" }]}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {stories.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {stories.map((story) => (
                <Link 
                  key={story._id} 
                  href={`/work/${story.slug.current}`}
                  className="group block no-underline hover:no-underline"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6 bg-muted">
                    <Image
                      src={story.featuredImage.asset.url}
                      alt={story.featuredImage.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                       <div className="bg-white text-black rounded-full px-6 py-3 font-bold flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          View Success Story <ArrowRight className="w-4 h-4" />
                       </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors no-underline">
                        {story.clientCompany}
                      </h3>
                      {story.country && (
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded">
                          {story.country}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground line-clamp-2 leading-relaxed no-underline">
                      {story.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">Coming soon! We're preparing some amazing stories to share.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
