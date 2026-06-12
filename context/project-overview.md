# Member & Contribution Tracker

## Overview

A web application for an organization to track its members and the
monthly contributions (payments) each member makes. An admin records
payments through a form; the system stores them per member per month,
sends a WhatsApp confirmation when a payment is recorded, and sends a
WhatsApp reminder to members who have not paid after the 15th of the
month. All data can be exported to Excel in a month-by-month layout.

It replaces a manual spreadsheet process with a faster, less error-prone
tool while keeping the familiar exported sheet format.

## Goals

1. Let an admin record a member's monthly payment in under 30 seconds.
2. Automatically confirm payments and chase unpaid members over WhatsApp.
3. Produce an Excel export that matches the organization's existing
   sheet format (one row per member, columns per month).

## Core User Flow

1. Admin opens the app.
2. Admin selects an existing member or adds a new one.
3. Admin selects department + month/year and enters the amount.
4. `Date Received` auto-fills to today but can be edited (offline payments).
5. Admin submits → the payment is saved to the correct member + month.
6. The system sends a WhatsApp confirmation (simulated by default).
7. Separately, a daily job checks for unpaid members after the 15th and
   sends a reminder, marking them as notified.

## Features

### Member Management

- Add a member: name, father name, address, WhatsApp no, SIM/text no,
  department.
- View and search members.

### Payment Entry

- Record a payment for a member for a given month.
- `Date Received` defaults to now, editable via date picker.
- One payment record per member per month.

### Messaging

- Payment confirmation message on entry.
- Reminder message after the 15th for unpaid members.
- Simulate mode (log only) by default; live mode via Baileys later.

### Reporting

- Filter by department, month, payment status, and date range.
- One-click Excel export in the wide month-column format.

## Scope

### In Scope

- Member CRUD, payment entry, monthly tracking.
- WhatsApp confirmation + reminder logic (simulate first).
- Filtering and Excel export.

### Out of Scope (for the demo)

- Multi-user roles / permissions (single admin assumed).
- Live WhatsApp Business API verification.
- Payment gateway / online collection.
- Mobile native app.

## Success Criteria

1. An admin can add a member and record a payment that persists in the DB.
2. Recording a payment produces a confirmation message (logged in simulate).
3. After the 15th, unpaid members are flagged and a reminder is produced.
4. The admin can export all data to an Excel file with month columns.
