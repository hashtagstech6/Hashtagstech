"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface JobShareButtonProps {
  slug: string;
}

export default function JobShareButton({ slug }: JobShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/career/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      className="w-full justify-center gap-2 group hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500 bg-white rounded-full p-0.5" />
      ) : (
        <Copy className="w-4 h-4 group-hover:text-white transition-colors" />
      )}
      <span className={copied ? "text-green-500 font-medium bg-white px-2 py-0.5 rounded" : "group-hover:text-white transition-colors"}>
        {copied ? "Link Copied!" : "Copy Job Link"}
      </span>
    </Button>
  );
}
