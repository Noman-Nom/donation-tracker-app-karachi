// Always-on WhatsApp worker.
//
// Keeps a single Baileys connection alive (scan the QR once — the login is
// saved in ./auth_session and reused forever) and exposes a tiny HTTP API the
// Next.js app calls to send messages:
//
//   GET  /status        -> { connected, awaitingScan }
//   GET  /qr            -> { qr: "<data-url>" }
//   POST /send {to,message}  -> sends a WhatsApp message
//
// Run it alongside the app:   npm run wa:worker
// Then set WHATSAPP_MODE=live in .env so the app routes sends here.

import { webcrypto } from "node:crypto";
// Baileys needs a global Web Crypto API on older Node versions.
if (!globalThis.crypto) globalThis.crypto = webcrypto;

import fs from "node:fs";
import http from "node:http";
import baileys from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import QRCode from "qrcode";

// Baileys is CommonJS — factory is the default export.
const makeWASocket = baileys.default;
const { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } =
  baileys;

const PORT = Number(process.env.WHATSAPP_WORKER_PORT ?? 4000);
const AUTH_DIR = "auth_session";

let sock = null;
let connected = false;
let lastQr = null;

// Convert a phone number to a WhatsApp JID. Pakistan default (92).
function toJid(raw) {
  let n = String(raw).replace(/\D/g, "");
  if (n.startsWith("0")) n = "92" + n.slice(1);
  return `${n}@s.whatsapp.net`;
}

// Wipe the auth folder and start a fresh connection so a new QR is generated.
function wipeAndRestart(reason) {
  console.log(`\n🔄 ${reason} — wiping session and restarting for a fresh QR…\n`);
  try { fs.rmSync(AUTH_DIR, { recursive: true, force: true }); } catch {}
  lastQr = null;
  connected = false;
  // Small delay so WhatsApp doesn't rate-limit back-to-back connections.
  setTimeout(startSocket, 3000);
}

async function startSocket() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({ version, auth: state, printQRInTerminal: false });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      lastQr = qr;
      console.log("\n📱 Scan this QR with WhatsApp → Linked Devices:\n");
      qrcode.generate(qr, { small: true });
      console.log("\n(QR also available at http://localhost:" + PORT + "/qr)\n");
    }

    if (connection === "open") {
      connected = true;
      lastQr = null;
      console.log("✅ WhatsApp connected — worker ready to send.");
    }

    if (connection === "close") {
      connected = false;
      lastQr = null;

      const code = lastDisconnect?.error?.output?.statusCode;
      const reason = lastDisconnect?.error?.message ?? "unknown";

      if (code === DisconnectReason.loggedOut) {
        // Check whether we ever successfully registered.
        // If registered=false, this is a failed fresh-login attempt, not a
        // real logout — wipe and retry so we get a new QR immediately.
        const credsPath = `${AUTH_DIR}/creds.json`;
        let registered = true;
        try {
          const creds = JSON.parse(fs.readFileSync(credsPath, "utf8"));
          registered = creds.registered !== false;
        } catch {
          registered = false; // no creds file → definitely not registered
        }

        if (!registered) {
          wipeAndRestart("Connection rejected before QR was scanned");
        } else {
          console.error(
            "❌ WhatsApp logged out this device. Delete ./auth_session and restart to re-pair.",
          );
        }
        return;
      }

      console.log(`Connection closed (${code ?? reason}), reconnecting in 3 s…`);
      setTimeout(startSocket, 3000);
    }
  });
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => resolve(data));
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/status") {
    res.end(JSON.stringify({ connected, awaitingScan: Boolean(lastQr) }));
    return;
  }

  if (req.method === "GET" && req.url === "/qr") {
    if (!lastQr) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "No QR code available yet" }));
      return;
    }
    try {
      const dataUrl = await QRCode.toDataURL(lastQr, { width: 300, margin: 2 });
      res.end(JSON.stringify({ qr: dataUrl }));
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (req.method === "POST" && req.url === "/send") {
    try {
      const body = JSON.parse((await readBody(req)) || "{}");
      const { to, message } = body;

      if (!to || !message) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "to and message are required" }));
        return;
      }
      if (!connected || !sock) {
        res.statusCode = 503;
        res.end(JSON.stringify({ error: "WhatsApp not connected yet" }));
        return;
      }

      await sock.sendMessage(toJid(to), { text: message });
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "not found" }));
});

server.listen(PORT, () => {
  console.log(`WhatsApp worker listening on http://localhost:${PORT}`);
});

startSocket().catch((e) => {
  console.error("Failed to start WhatsApp socket:", e);
  process.exit(1);
});
