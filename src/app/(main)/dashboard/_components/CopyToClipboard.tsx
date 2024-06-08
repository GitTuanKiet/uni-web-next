"use client";

import { Input, Button } from "@/components";
import { cn } from "@/lib/utils";
import { ClipboardCopy, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use_toast";

export const CopyToClipboard = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    await navigator.clipboard.writeText(text);
    toast({
      icon: <ClipboardCopy className="h-4 w-4" />,
      title: "Copied to clipboard",
    });
  };
  return (
    <div className="flex justify-center gap-3">
      <Input readOnly value={text} className="bg-secondary text-muted-foreground" />
      <Button size="icon" onClick={() => copyToClipboard()}>
        {copied ? (
          <ClipboardCheck
            className={cn(
              copied ? "opacity-100" : "opacity-0",
              "h-5 w-5 transition-opacity duration-500",
            )}
          />
        ) : (
          <ClipboardCopy className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};
