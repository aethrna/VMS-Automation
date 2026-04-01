# 🛂 Lazy VMS

A Firefox Android extension that automates visitor registration at Cyber 2 Tower — one tap to submit your KTP, selfie, and get your QR code.

---

## How It Works

The extension sends your visitor data directly to the VMS server via the same API the website uses, then opens the access page with your QR code ready to scan. No typing, no form filling at the gate.

---

## Files

| File | Purpose |
|---|---|
| `manifest.json` | Extension config, permissions, entry points |
| `popup.html / popup.js` | The main UI — shows data status and the Register button |
| `options.html / options.js` | Setup page — enter your info and upload photos |
| `background.js` | Handles the POST request to the VMS server |
| `content.js` | Injects the registration ID into the access page localStorage |

---

## Requirements

- **Firefox Nightly** for Android
- Debug menu enabled (tap the Firefox logo 5× in About Firefox Nightly)
- `xpinstall.signatures.required` set to `false` in `about:config`

---

## Installation

1. Transfer `lazy_vms.xpi` to your phone
2. In Firefox Nightly: **Settings → Install add-on from file**
3. Locate the `.xpi` and tap it
4. Accept the permissions prompt

---

## First-Time Setup

1. Tap the extension icon in the Firefox menu
2. Tap **⚙ Setup** — this opens a full-page settings tab
3. Fill in your **Name**, **Company ID**, and **Phone**
4. Upload your **KTP photo** and **selfie** — these save automatically on selection
5. Tap **Save All Settings** — the tab closes and returns you to the popup
6. All three status rows should now show green ✓

---

## Daily Use

1. Open Firefox Nightly
2. Tap the **⋮** menu → scroll down → tap **Lazy VMS**
3. Tap **REGISTER & GET QR**
4. A new tab opens with your QR code — show it at the gate

---

## Building the XPI

From the project folder, zip the files directly (not the folder):

```bash
zip -j lazy_vms.xpi manifest.json background.js content.js popup.html popup.js options.html options.js
```

The `.xpi` format is just a renamed `.zip`.

---

## Payload Reference

The extension posts the following JSON to `/VisitorRequest/SaveVisitorRequestGeneral`:

```json
{
  "Name": "string",
  "CompanyId": "string",
  "Reason": "Intern",
  "PhoneNumber": "string",
  "IdBase64": "base64 string (no data:image prefix)",
  "FaceBase64": "base64 string (no data:image prefix)"
}
```

On success the server returns `{ success: true, id: "..." }` and the extension opens the access page with the ID as a query parameter. `content.js` picks this up, writes it to `localStorage`, and redirects to the clean URL so the site renders the QR.

---

## Known Limitations

- **Firefox Nightly only** — sideloaded unsigned extensions are not supported in standard Firefox for Android
- The extension is personal-use only — credentials are stored in the browser's local extension storage and are not synced
- If the VMS server changes its API the extension will need to be updated manually
