import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import dynamic from "next/dynamic";

// Dynamically import Chat Widget for code splitting
const ChatWidget = dynamic(
  () => import("@/components/widgets/chat-widget").then((mod) => mod.ChatWidget),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
