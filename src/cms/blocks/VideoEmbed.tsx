import * as React from "react";
import {
  type BlockStyleProps,
  type Responsive,
  type Align,
  buildStyleClasses,
} from "../style";
import { Video, AlertTriangle, ExternalLink, Play } from "lucide-react";

import { buildSizeStyles, type SizeControlConfig } from "../fields/SizeControls";
import { buildElementStyleObject, type StyleControlConfig } from "../fields/StyleControls";
import { buildAnimationClasses, buildAnimationStyles, type AnimationConfig } from "../fields/AnimationControls";
import { buildAdvancedLayoutClasses, type AdvancedLayoutConfig } from "../fields/AdvancedLayout";

export type VideoAspectRatio = "16:9" | "4:3";

export interface VideoEmbedProps extends BlockStyleProps {
  url: string;
  title: string;
  aspectRatio?: VideoAspectRatio;
  caption?: string;
  sizePercent?: number;
  sizeControls?: SizeControlConfig;
  styleControls?: StyleControlConfig;
  animation?: AnimationConfig;
  advancedLayout?: AdvancedLayoutConfig;
}

export const defaultVideoEmbedProps: VideoEmbedProps = {
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  title: "SMG Advisory & Client Success Overview",
  aspectRatio: "16:9",
  caption: "Learn how SMG's proactive accounting framework drives tangible enterprise value.",
  sizePercent: 100,
  marginTop: { base: "md", md: "lg", lg: "xl" },
  marginBottom: { base: "md", md: "lg", lg: "xl" },
  paddingTop: { base: "none" },
  paddingBottom: { base: "none" },
};

const ALLOWED_VIDEO_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "vimeo.com",
  "www.vimeo.com",
  "player.vimeo.com",
]);

export function parseVideoEmbedUrl(rawUrl: string): {
  embedUrl: string;
  provider: "youtube" | "vimeo" | "unknown";
  valid: boolean;
  error?: string;
} {
  if (!rawUrl || typeof rawUrl !== "string") {
    return {
      embedUrl: "",
      provider: "unknown",
      valid: false,
      error: "Please enter a valid video URL.",
    };
  }

  const trimmed = rawUrl.trim();
  try {
    const fullUrl =
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`;
    const parsed = new URL(fullUrl);
    const hostname = parsed.hostname.toLowerCase();

    if (!ALLOWED_VIDEO_HOSTS.has(hostname)) {
      return {
        embedUrl: "",
        provider: "unknown",
        valid: false,
        error: `Host "${hostname}" is rejected for security. Allowed hosts: YouTube (youtube.com, youtu.be) and Vimeo (vimeo.com).`,
      };
    }

    // YouTube parsing
    if (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com" ||
      hostname === "youtube-nocookie.com" ||
      hostname === "www.youtube-nocookie.com"
    ) {
      let videoId = parsed.searchParams.get("v");
      if (!videoId) {
        const parts = parsed.pathname.split("/").filter(Boolean);
        if (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "v") {
          videoId = parts[1];
        }
      }
      if (videoId && /^[\w-]{6,20}$/.test(videoId)) {
        return {
          embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
          provider: "youtube",
          valid: true,
        };
      }
    } else if (hostname === "youtu.be") {
      const parts = parsed.pathname.split("/").filter(Boolean);
      const videoId = parts[0];
      if (videoId && /^[\w-]{6,20}$/.test(videoId)) {
        return {
          embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
          provider: "youtube",
          valid: true,
        };
      }
    }

    // Vimeo parsing
    if (hostname === "vimeo.com" || hostname === "www.vimeo.com") {
      const parts = parsed.pathname.split("/").filter(Boolean);
      const lastPart = parts[parts.length - 1];
      if (lastPart && /^\d+$/.test(lastPart)) {
        return {
          embedUrl: `https://player.vimeo.com/video/${lastPart}`,
          provider: "vimeo",
          valid: true,
        };
      }
    } else if (hostname === "player.vimeo.com") {
      return {
        embedUrl: trimmed,
        provider: "vimeo",
        valid: true,
      };
    }

    return {
      embedUrl: "",
      provider: "unknown",
      valid: false,
      error: "Could not extract video ID. Please check the URL format.",
    };
  } catch {
    return {
      embedUrl: "",
      provider: "unknown",
      valid: false,
      error: "Malformed video URL.",
    };
  }
}

function useIsInPuckEditor(): boolean {
  const [inEditor, setInEditor] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const isEditor = Boolean(
      document.querySelector("[data-puck-drop-zone]") ||
      document.querySelector("[data-puck-component]") ||
      document.querySelector(".puck") ||
      (window.self !== window.top && (window.top?.location?.pathname?.includes("/cms/") || window.top?.location?.pathname?.includes("/internal/pages/")))
    );
    if (isEditor) {
      setInEditor(true);
    }
  }, []);
  return inEditor;
}

export function VideoEmbedRender(props: VideoEmbedProps) {
  const {
    url = defaultVideoEmbedProps.url,
    title = defaultVideoEmbedProps.title,
    aspectRatio = "16:9",
    caption = defaultVideoEmbedProps.caption,
    sizePercent = 100,
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
    align,
  } = props;
  const isEditor = useIsInPuckEditor();

  const normalizedAlign: Responsive<Align> =
    typeof align === "string" ? { base: align } : align || { base: "center" };

  const styleClasses = buildStyleClasses(
    {
      align: normalizedAlign,
      marginTop,
      marginBottom,
      paddingTop,
      paddingBottom,
    },
    {
      defaultMarginTop: "md",
      defaultMarginBottom: "md",
    },
  );

  const computedSizeStyles = buildSizeStyles(props.sizeControls, sizePercent);
  const elementCustomStyles = buildElementStyleObject(props.styleControls);
  const animationClasses = buildAnimationClasses(props.animation);
  const animationStyles = buildAnimationStyles(props.animation);

  const containerStyle: React.CSSProperties = {
    ...computedSizeStyles,
    ...elementCustomStyles,
    ...animationStyles,
    ...(computedSizeStyles.maxWidth && computedSizeStyles.maxWidth !== "100%"
      ? { margin: "0 auto" }
      : {}),
  };

  const { embedUrl, provider, valid, error } = parseVideoEmbedUrl(url);

  const aspectClass = aspectRatio === "4:3" ? "aspect-4/3" : "aspect-video";

  const isInline = props.advancedLayout?.display === "inline";
  const advClasses = buildAdvancedLayoutClasses(props.advancedLayout);
  const wrapperDisplayClass = isInline ? "inline-flex items-center align-middle" : "w-full";

  return (
    <div className={`${wrapperDisplayClass} ${advClasses} ${styleClasses}`}>
      <div style={containerStyle} className={`w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${animationClasses}`}>
        {!valid ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-xs sm:text-sm text-destructive shadow-xs">
            <AlertTriangle className="size-8 mx-auto mb-2 text-destructive" />
            <p className="font-bold">Invalid Video Embed URL</p>
            <p className="mt-1 text-slate-600">{error}</p>
            <p className="mt-2 text-[11px] text-slate-500">
              Supported examples: <code>https://www.youtube.com/watch?v=...</code>, <code>https://youtu.be/...</code>, <code>https://vimeo.com/...</code>
            </p>
          </div>
        ) : isEditor ? (
          <div className={`w-full ${aspectClass} rounded-2xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-slate-900 to-[#0f2142] p-6 text-white flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden`}>
            <div className="size-16 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center mb-3 text-white border border-white/20 shadow-md">
              <Play className="size-7 fill-white ml-0.5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200 border border-blue-400/30 uppercase tracking-wider mb-2">
              <Video className="size-3.5" />
              <span>{provider.toUpperCase()} Embed ({aspectRatio})</span>
            </span>
            <h4 className="font-serif-hero text-lg sm:text-xl font-bold max-w-lg">{title}</h4>
            <p className="mt-1 text-xs text-slate-300 font-mono truncate max-w-md">{embedUrl}</p>
            <span className="mt-4 text-[11px] text-slate-400">
              Live player active on public page
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className={`w-full ${aspectClass} overflow-hidden rounded-2xl bg-black shadow-xl border border-slate-200/50 relative`}>
              <iframe
                src={embedUrl}
                title={title || "Embedded video player"}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            {caption && (
              <p className="mt-3 text-center text-xs sm:text-sm text-slate-500 italic max-w-2xl">
                {caption}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoEmbedRender;
