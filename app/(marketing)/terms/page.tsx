import { Metadata } from "next";
import { getClient } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import ScrollReveal from "@/components/animations/scroll-reveal";
import PageHeader from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Terms of Service | Hashtag Tech",
  description: "Guidelines and terms for using our services and website.",
};

export default async function TermsOfServicePage() {
  const client = getClient();
  let content = null;

  try {
    if (client) {
      const query = `*[_type == "siteSettings"][0].termsOfService`;
      content = await client.fetch(query, {}, { 
        next: { tags: ["siteSettings"] },
        useCdn: false 
      });
    }
  } catch (error) {
    console.error("Error fetching terms of service:", error);
  }

  return (
    <main className="min-h-screen pb-20">
      <PageHeader 
        title="Terms of Service" 
        description="Our rules of engagement. Please read carefully."
      />
      
      <div className="container mx-auto px-4 mt-16 max-w-4xl">
        <ScrollReveal>
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-li:text-foreground/80 prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline">
            {content ? (
              <PortableText 
                value={content} 
                components={{
                  block: {
                    h1: ({ children }) => <h1 className="text-4xl font-bold mb-8 mt-12">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-3xl font-bold mb-6 mt-10">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-2xl font-bold mb-4 mt-8">{children}</h3>,
                    normal: ({ children }) => <p className="mb-6 leading-relaxed">{children}</p>,
                  },
                  list: {
                    bullet: ({ children }) => <ul className="list-disc list-inside mb-8 space-y-3">{children}</ul>,
                    number: ({ children }) => <ol className="list-decimal list-inside mb-8 space-y-3">{children}</ol>,
                  },
                  listItem: {
                    bullet: ({ children }) => <li className="marker:text-primary">{children}</li>,
                    number: ({ children }) => <li className="marker:text-primary marker:font-bold">{children}</li>,
                  },
                  marks: {
                    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                    link: ({ value, children }) => (
                      <a href={value.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                        {children}
                      </a>
                    ),
                  },
                }}
              />
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                <p className="text-foreground/60 italic">Terms of Service content is being updated. Please check back soon.</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
