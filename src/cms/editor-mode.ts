import * as React from "react";

export type EditorMode = "simple" | "advanced";

const MODE_STORAGE_KEY = "smg_cms_editor_mode";

export function getInitialEditorMode(): EditorMode {
  if (typeof window === "undefined") return "simple";
  try {
    const saved = localStorage.getItem(MODE_STORAGE_KEY);
    return saved === "advanced" ? "advanced" : "simple";
  } catch {
    return "simple";
  }
}

export function setEditorMode(mode: EditorMode) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // Ignore storage errors
  }
  window.dispatchEvent(new CustomEvent("cms-mode-changed", { detail: mode }));
  updateDocumentModeClass(mode);
}

export function updateDocumentModeClass(mode: EditorMode) {
  if (typeof document === "undefined") return;
  if (mode === "simple") {
    document.documentElement.classList.add("cms-mode-simple");
    document.documentElement.classList.remove("cms-mode-advanced");
  } else {
    document.documentElement.classList.add("cms-mode-advanced");
    document.documentElement.classList.remove("cms-mode-simple");
  }
}

/**
 * React hook to subscribe to real-time editor mode changes
 */
export function useEditorMode(): [EditorMode, (mode: EditorMode) => void] {
  const [mode, setModeState] = React.useState<EditorMode>(getInitialEditorMode);

  React.useEffect(() => {
    updateDocumentModeClass(mode);

    const handleModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<EditorMode>;
      if (customEvent.detail) {
        setModeState(customEvent.detail);
      }
    };

    window.addEventListener("cms-mode-changed", handleModeChange);
    return () => window.removeEventListener("cms-mode-changed", handleModeChange);
  }, [mode]);

  const setMode = React.useCallback((newMode: EditorMode) => {
    setModeState(newMode);
    setEditorMode(newMode);
  }, []);

  return [mode, setMode];
}
