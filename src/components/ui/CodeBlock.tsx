import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="group relative my-6 rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm bg-surface-container-lowest animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface-container-low border-b border-outline-variant/10">
        <span className="text-xs font-label font-bold text-on-surface-variant uppercase tracking-widest">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all hover:bg-surface-container-high text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-[16px]">
            {copied ? "check" : "content_copy"}
          </span>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code Area */}
      <div className="relative text-sm font-mono overflow-auto max-h-[500px]">
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: "1.5rem",
            background: "transparent",
            fontSize: "13px",
            lineHeight: "1.6",
          }}
          codeTagProps={{
            style: {
              fontFamily: "var(--font-mono, 'JetBrains Mono', 'Fira Code', monospace)",
            },
          }}
        >
          {String(value).trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
