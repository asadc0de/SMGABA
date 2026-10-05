import * as React from "react";

export interface RichTextProps {
  content: string;
  align: "left" | "center" | "right";
}

const alignClasses: Record<RichTextProps["align"], string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function RichTextRender({ content, align = "left" }: RichTextProps) {
  const alignmentClass = alignClasses[align] || "text-left";

  return (
    <div className={`w-full my-4 ${alignmentClass}`}>
      <p className="font-sans text-base md:text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}
