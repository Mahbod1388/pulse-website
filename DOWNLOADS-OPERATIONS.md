# PULSE Downloads — publishing and operations

## What is included
- `/downloads/` is the public download center.
- `/downloads/releases.json` is the versioned public manifest. It is intentionally empty until a release is approved.
- The page renders only releases with `status: "published"` and valid HTTPS or same-origin file URLs.
- SHA-256 values are displayed only when they are exactly 64 hexadecimal characters.
- `_headers` applies baseline security headers on Cloudflare Pages.

## Recommended production storage
Use Cloudflare R2 (or another object store) for installer binaries; do not commit large `.exe`, `.msi`, `.zip`, or `.7z` files to the website repository. Put the bucket behind a dedicated downloads hostname/custom domain, enable HTTPS, and keep write credentials private. Public website code must never contain R2 access keys or upload credentials.

Suggested object key convention:
`pulse/<product>/<version>/<filename>`

Keep published object keys immutable. For a corrected build, publish a new version/build identifier rather than silently replacing a binary at the same URL. Enable object versioning/retention where appropriate.

## Publishing a release
1. Build and test the installer on a clean Windows environment.
2. Scan the artifact and sign Windows executables with the project's code-signing certificate when available.
3. Calculate SHA-256 locally: `certutil -hashfile PULSE-Setup-x64.exe SHA256` (Windows) or `sha256sum PULSE-Setup-x64.exe` (Linux/macOS).
4. Upload the artifact to the private publishing workflow / R2 bucket using an authorized operator.
5. Verify the public HTTPS URL, content length, MIME type, and downloaded file hash.
6. Add a release entry to `releases.json`, set `status` to `published`, and deploy the site.
7. Verify the release appears on `/downloads/` and the checksum matches the downloaded artifact.

## Manifest schema (example only — do not publish placeholder URLs)
```json
{
  "schemaVersion": 1,
  "updatedAt": "2026-11-22T00:00:00Z",
  "releases": [{
    "id": "pulse-desktop-2.45.0",
    "name": "PULSE Desktop",
    "version": "2.45.0",
    "platform": "Windows 10/11 · x64",
    "channel": "Stable",
    "releaseDate": "2026-11-22",
    "status": "published",
    "notes": "Release notes go here.",
    "files": [{
      "label": "Windows x64 Installer",
      "name": "PULSE-Setup-x64.exe",
      "url": "https://downloads.example.com/pulse/desktop/2.45.0/PULSE-Setup-x64.exe",
      "sizeBytes": 123456789,
      "sha256": "REPLACE_WITH_64_HEX_CHARACTERS"
    }]
  }]
}
```
The example URL and hash are placeholders and must be replaced with verified production values. The frontend currently shows version, platform, release date, channel, notes and SHA-256; file size metadata is reserved in the schema for a later UI addition.

## Important limitations
This is a static publishing workflow, not an upload portal. Uploading files is intentionally an authenticated operator/deployment task; no public upload endpoint or secret is shipped to visitors. Download counts/analytics are not enabled yet and should be added only with a privacy-conscious analytics choice.

## Cloudflare Pages
Keep the existing static settings: no build command, output directory `.`. Ensure `_headers`, `downloads/`, and `DOWNLOADS-OPERATIONS.md` are included in the deployed output.
