import * as React from "react";

export interface CmsRootProps {
  title?: string;
  children?: React.ReactNode;
}

export function CmsRoot({ children }: CmsRootProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      {children}
    </div>
  );
}
