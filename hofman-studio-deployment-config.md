# Hofman.studio - Cloudflare Pages Deployment Configuration

## Project Overview
- **Repository**: studiogig/hofman-studio
- **Platform**: Cloudflare Pages
- **Framework**: Next.js (static export)
- **Date**: January 15, 2026

---

## Cloudflare Pages Project

| Setting | Value |
|---------|-------|
| Project Name | hofman-studio |
| Pages URL | hofman-studio.pages.dev |
| Account ID | f38675b3f73bd8e2f8c2af82cee5b270 |
| GitHub Connection | studiogig/hofman-studio |
| Branch | main |
| Build Command | (default Next.js) |
| Output Directory | (default) |

---

## Custom Domains Status

| Domain | Status | SSL | Notes |
|--------|--------|-----|-------|
| hofman-studio.pages.dev | ✅ Active | ✅ Enabled | Default Pages URL |
| www.hofman.studio | ✅ Active | ✅ Enabled | Added as custom domain |
| hofman.studio | ⏳ Pending | ⏳ Pending | **NEEDS TO BE ADDED** in Cloudflare Pages |

---

## DNS Configuration (Cloudflare)

### Current DNS Records for hofman.studio

| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| CNAME | hofman.studio | hofman-studio.pages.dev | Proxied (orange) | Auto |
| CNAME | www | hofman-studio.pages.dev | Proxied (orange) | Auto |
| CNAME | _domainconnect | _domainconnect.domains.s... | Proxied | Auto |
| MX | hofman.studio | aspmx.l.google.com | DNS only | Auto |
| MX | hofman.studio | alt1.aspmx.l.google.com | DNS only | Auto |
| MX | hofman.studio | alt2.aspmx.l.google.com | DNS only | Auto |
| MX | hofman.studio | alt3.aspmx.l.google.com | DNS only | Auto |
| MX | hofman.studio | alt4.aspmx.l.google.com | DNS only | Auto |
| NS | hofman.studio | ns-cloud-a3.googledomains... | DNS only | Auto |
| NS | hofman.studio | ns-cloud-a4.googledomains... | DNS only | Auto |

### Deleted Records (Old GitHub Pages)
These A records were removed as they pointed to GitHub Pages:
- ~~A record: 185.199.108.153~~
- ~~A record: 185.199.109.153~~
- ~~A record: 185.199.110.153~~
- ~~A record: 185.199.111.153~~

---

## Next.js Configuration

**File: `next.config.ts`**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
};

export default nextConfig;
```

The `output: 'export'` setting enables static HTML export, which is required for Cloudflare Pages deployment.

---

## Remaining Steps

### 1. Add Apex Domain to Cloudflare Pages
The DNS CNAME record for `hofman.studio` → `hofman-studio.pages.dev` has been created, but the apex domain needs to be registered in Cloudflare Pages Custom Domains:

1. Go to: **Workers & Pages** → **hofman-studio** → **Custom domains**
2. Click **"Set up a custom domain"**
3. Enter: `hofman.studio`
4. Follow the prompts (DNS should auto-verify since it's already on Cloudflare)
5. Wait for SSL certificate to be issued

### 2. Verify Both Domains Work
After adding the apex domain:
- Test: https://hofman.studio
- Test: https://www.hofman.studio
- Both should load the Next.js site

---

## Useful Links

- **Cloudflare Dashboard**: https://dash.cloudflare.com/f38675b3f73bd8e2f8c2af82cee5b270
- **Pages Project**: https://dash.cloudflare.com/f38675b3f73bd8e2f8c2af82cee5b270/pages/view/hofman-studio
- **Custom Domains**: https://dash.cloudflare.com/f38675b3f73bd8e2f8c2af82cee5b270/pages/view/hofman-studio/domains
- **DNS Records**: https://dash.cloudflare.com/f38675b3f73bd8e2f8c2af82cee5b270/hofman.studio/dns/records
- **GitHub Repo**: https://github.com/studiogig/hofman-studio

---

## Troubleshooting

### If site shows GitHub Pages 404
- Check DNS records - ensure no A records pointing to GitHub Pages IPs (185.199.x.x)
- Verify CNAME records point to hofman-studio.pages.dev

### If SSL not working
- Cloudflare Pages handles SSL automatically when domain is added via Custom Domains
- May take a few minutes for certificate to provision
- Ensure proxy is enabled (orange cloud) in DNS settings

### DNS Propagation
- Changes may take up to 24 hours to propagate globally
- Usually much faster (minutes) when using Cloudflare proxy
