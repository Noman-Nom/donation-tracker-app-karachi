"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Smartphone,
  CheckCircle2,
  XCircle,
  RefreshCw,
  QrCode,
  Terminal,
  Wifi,
  WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

type WorkerStatus = {
  connected: boolean;
  awaitingScan: boolean;
  offline?: boolean;
};

type Phase = "loading" | "offline" | "awaiting" | "connected" | "disconnected";

export default function WhatsAppPage() {
  const [status, setStatus] = useState<WorkerStatus | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/whatsapp/status");
      const data: WorkerStatus = await res.json();
      setStatus(data);
      setLastChecked(new Date());

      if (data.offline || res.status === 503) {
        setPhase("offline");
        setQrUrl(null);
      } else if (data.connected) {
        setPhase("connected");
        setQrUrl(null);
      } else if (data.awaitingScan) {
        setPhase("awaiting");
        // Fetch fresh QR
        const qrRes = await fetch("/api/whatsapp/qr");
        if (qrRes.ok) {
          const { qr } = (await qrRes.json()) as { qr: string | null };
          setQrUrl(qr);
        }
      } else {
        setPhase("disconnected");
        setQrUrl(null);
      }
    } catch {
      setPhase("offline");
      setStatus({ connected: false, awaitingScan: false, offline: true });
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 3000);
    return () => clearInterval(id);
  }, [fetchStatus]);

  const modeLabel =
    process.env.NEXT_PUBLIC_WHATSAPP_MODE === "live" ? "Live" : undefined;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
            <Smartphone className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-fg">WhatsApp Integration</h1>
        </div>
        <p className="text-sm text-muted pl-[52px]">
          Scan the QR code once to connect. Stay connected to send payment
          confirmations and reminders automatically.
        </p>
      </div>

      {/* Status card */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted uppercase tracking-wider">
            Connection Status
          </span>
          <button
            onClick={fetchStatus}
            aria-label="Refresh status"
            className="btn-ghost p-1.5 rounded-lg"
          >
            <RefreshCw
              className={cn(
                "h-4 w-4",
                phase === "loading" && "animate-spin",
              )}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Status indicator */}
        <StatusBadge phase={phase} />

        {/* Last checked */}
        {lastChecked && (
          <p className="text-xs text-muted/60">
            Last checked: {lastChecked.toLocaleTimeString()} · Auto-refreshes
            every 3 seconds
          </p>
        )}
      </div>

      {/* QR code panel — only when awaiting scan */}
      {phase === "awaiting" && (
        <div className="glass-card p-6 space-y-4" aria-live="polite">
          <div className="flex items-center gap-2 text-amber-400">
            <QrCode className="h-5 w-5" aria-hidden="true" />
            <h2 className="font-semibold">Scan to Connect</h2>
          </div>
          <p className="text-sm text-muted">
            Open WhatsApp on your phone → tap{" "}
            <span className="text-fg font-medium">Linked Devices</span> → tap{" "}
            <span className="text-fg font-medium">Link a Device</span> → scan
            the code below.
          </p>

          {qrUrl ? (
            <div className="flex justify-center">
              <div className="rounded-2xl bg-white p-4 shadow-xl shadow-black/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt="WhatsApp QR code — scan with your phone"
                  className="h-[280px] w-[280px]"
                />
              </div>
            </div>
          ) : (
            <div className="flex h-[312px] items-center justify-center rounded-2xl border border-white/10 text-muted text-sm">
              Generating QR code…
            </div>
          )}

          <p className="text-xs text-muted text-center">
            The QR code refreshes automatically. Once scanned, this page will
            update to &quot;Connected&quot; within a few seconds.
          </p>
        </div>
      )}

      {/* Connected panel */}
      {phase === "connected" && (
        <div
          className="glass-card p-6 border border-green-500/20"
          aria-live="polite"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
              <Wifi className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-green-400">
                WhatsApp is connected
              </p>
              <p className="text-sm text-muted">
                Payment confirmations and reminders will be delivered
                automatically. The worker must stay running in the background.
              </p>
              {modeLabel && (
                <span className="badge mt-1">Mode: {modeLabel}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Offline panel — worker not running */}
      {phase === "offline" && (
        <div
          className="glass-card p-6 border border-red-500/20 space-y-4"
          aria-live="polite"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
              <WifiOff className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-red-400">Worker not running</p>
              <p className="text-sm text-muted">
                The WhatsApp worker process is offline. Start it in a terminal
                and this page will connect automatically.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-black/40 border border-white/8 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted mb-2">
              <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
              Run in a terminal:
            </div>
            <code className="block text-sm text-emerald-400 font-mono select-all">
              npm run wa:worker
            </code>
          </div>

          <p className="text-xs text-muted">
            After starting the worker, scan the QR code that appears here. You
            only need to scan once — the session is saved permanently.
          </p>
        </div>
      )}

      {/* Disconnected panel — worker running but not connected */}
      {phase === "disconnected" && (
        <div className="glass-card p-6 border border-amber-500/20" aria-live="polite">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
              <XCircle className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-amber-400">Reconnecting…</p>
              <p className="text-sm text-muted">
                The worker is running but WhatsApp is not yet connected. It will
                reconnect automatically or show a QR code shortly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="glass-card p-6 space-y-3">
        <h2 className="font-semibold text-fg">How it works</h2>
        <ol className="space-y-2 text-sm text-muted list-none">
          {[
            {
              step: "1",
              text: "Run npm run wa:worker in a terminal to start the WhatsApp worker.",
            },
            {
              step: "2",
              text: "Scan the QR code above with your WhatsApp → Linked Devices.",
            },
            {
              step: "3",
              text: 'Set WHATSAPP_MODE="live" in your .env file and restart npm run dev.',
            },
            {
              step: "4",
              text: "Record a payment — the member gets a real WhatsApp confirmation instantly.",
            },
          ].map(({ step, text }) => (
            <li key={step} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold mt-0.5">
                {step}
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}

function StatusBadge({ phase }: { phase: Phase }) {
  if (phase === "loading") {
    return (
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-muted/40 animate-pulse" />
        <span className="text-muted text-sm">Checking…</span>
      </div>
    );
  }

  if (phase === "connected") {
    return (
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </span>
        <CheckCircle2 className="h-5 w-5 text-green-400" aria-hidden="true" />
        <span className="font-semibold text-green-400">Connected</span>
      </div>
    );
  }

  if (phase === "awaiting") {
    return (
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
        </span>
        <QrCode className="h-5 w-5 text-amber-400" aria-hidden="true" />
        <span className="font-semibold text-amber-400">
          Waiting for QR scan
        </span>
      </div>
    );
  }

  if (phase === "offline") {
    return (
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
        <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
        <span className="font-semibold text-red-400">Worker offline</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-40" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
      </span>
      <span className="font-semibold text-amber-400">Disconnected</span>
    </div>
  );
}
