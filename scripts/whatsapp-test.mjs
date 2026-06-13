// Standalone WhatsApp sender (Baileys) — proves real sending works.
//
// Usage:
//   node scripts/whatsapp-test.mjs <number> "<message>"
//   node scripts/whatsapp-test.mjs 03001234567 "Hello from Member Tracker"
//
// First run: a QR code prints in the terminal. Open WhatsApp on the SENDER
// phone (a spare number) → Settings → Linked Devices → Link a Device → scan.
// The login is saved in ./auth_session so you only scan once.
//
// Number format: Pakistani local numbers (03xx...) are auto-converted to
// international (92xx...). Pass a full international number for other countries.

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";

const [, , rawNumber, ...messageParts] = process.argv;
const message = messageParts.join(" ") || "Test message from Member Tracker ✅";

if (!rawNumber) {
  console.error('Usage: node scripts/whatsapp-test.mjs <number> "<message>"');
  process.exit(1);
}

// Convert a phone number to a WhatsApp JID. Pakistan default (92).
function toJid(raw) {
  let n = raw.replace(/\D/g, "");
  if (n.startsWith("0")) n = "92" + n.slice(1);
  return `${n}@s.whatsapp.net`;
}

async function main() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_session");
  const sock = makeWASocket({ auth: state });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\n📱 Scan this QR with the SENDER WhatsApp account:\n");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      const jid = toJid(rawNumber);
      console.log(`\n✅ Connected. Sending to ${jid} ...`);
      try {
        await sock.sendMessage(jid, { text: message });
        console.log("✅ Message sent!");
      } catch (e) {
        console.error("❌ Send failed:", e.message);
      }
      setTimeout(() => process.exit(0), 2000);
    }

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        console.error("❌ Logged out. Delete ./auth_session and re-scan.");
        process.exit(1);
      }
      console.log("Connection closed, reconnecting...");
      main();
    }
  });
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
