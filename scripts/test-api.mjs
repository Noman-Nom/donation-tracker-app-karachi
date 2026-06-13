// Quick API smoke test. Start the dev server first (npm run dev),
// then in another terminal run:  node scripts/test-api.mjs
//
// It checks all four endpoints and prints a pass/fail summary.

const BASE = "http://localhost:3000";

function line(ok, label, extra = "") {
  console.log(`${ok ? "✅" : "❌"} ${label}${extra ? "  " + extra : ""}`);
}

async function main() {
  // 1. GET persons
  const personsRes = await fetch(`${BASE}/api/persons`);
  const persons = await personsRes.json();
  line(personsRes.ok, `GET  /api/persons → ${personsRes.status}`, `(${persons.data?.length ?? 0} members)`);

  // 2. POST a person
  const newPerson = await fetch(`${BASE}/api/persons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      fatherName: "Test Father",
      whatsappNo: "03001112222",
      department: "Testing",
    }),
  });
  const created = await newPerson.json();
  line(newPerson.status === 201, `POST /api/persons → ${newPerson.status}`, `(created ${created.data?.name ?? "?"})`);

  // 3. Validation should reject empty name
  const bad = await fetch(`${BASE}/api/persons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "", fatherName: "x", whatsappNo: "0300", department: "x" }),
  });
  const badBody = await bad.json();
  line(bad.status === 400, `POST /api/persons (invalid) → ${bad.status}`, `("${badBody.error}")`);

  // 4. POST a payment for the member we just created
  if (created.data?.id) {
    const pay = await fetch(`${BASE}/api/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId: created.data.id, month: "2026-06", amount: 1000 }),
    });
    const payBody = await pay.json();
    line(pay.status === 201, `POST /api/payments → ${pay.status}`, `(msgSent: ${payBody.data?.msgSent})`);
  }

  // 5. GET payments
  const paymentsRes = await fetch(`${BASE}/api/payments`);
  const payments = await paymentsRes.json();
  line(paymentsRes.ok, `GET  /api/payments → ${paymentsRes.status}`, `(${payments.data?.length ?? 0} payments)`);

  console.log("\nDone. Check the dev server terminal for the [WhatsApp SIMULATED] log line.");
}

main().catch((e) => {
  console.error("❌ Could not reach the API. Is `npm run dev` running?\n", e.message);
  process.exit(1);
});
