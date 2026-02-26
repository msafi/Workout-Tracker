import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isIosSafari() {
  const ua = window.navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua);
  const isWebKit = /safari/.test(ua) && !/crios|fxios|edgios|opr\//.test(ua);
  return isIos && isWebKit;
}

function isInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const isIos = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return isIosSafari();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || isInstalled()) {
      return;
    }

    if (isIos) {
      setIsVisible(true);
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [isIos]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-lg border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur sm:left-auto sm:w-[360px]">
      <h2 className="text-sm font-semibold text-slate-900">Install Workout Tracker</h2>
      {isIos ? (
        <p className="mt-2 text-sm text-slate-700">
          On iPhone Safari, tap Share, then choose Add to Home Screen.
        </p>
      ) : (
        <p className="mt-2 text-sm text-slate-700">Install this app for quick access from your home screen.</p>
      )}
      <div className="mt-3 flex gap-2">
        {!isIos && deferredPrompt ? (
          <button
            className="inline-flex h-9 items-center justify-center rounded-md bg-slate-900 px-3 text-sm font-medium text-white"
            onClick={async () => {
              await deferredPrompt.prompt();
              await deferredPrompt.userChoice;
              setDeferredPrompt(null);
              setIsVisible(false);
            }}
          >
            Install
          </button>
        ) : null}
        <button
          className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-700"
          onClick={() => setIsVisible(false)}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
