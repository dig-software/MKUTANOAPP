const DEMO_MODE_KEY = "mkutano_demo_mode";

export function isDemoModeAllowed(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

export function isDemoModeEnabled(): boolean {
  if (!isDemoModeAllowed()) {
    return false;
  }

  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(DEMO_MODE_KEY) === "true";
}

export function setDemoModeEnabled(enabled: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(DEMO_MODE_KEY, enabled ? "true" : "false");
}
