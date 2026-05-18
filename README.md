<div align="center">

  <h1>✨ Zenix Astro Theme</h1>

  <p>A hand-crafted, highly technical Astro theme built for Micro-SaaS founders who want to stand out from the generic "AI-generated" look.</p>

  <p>
    <a href="https://farrosfr.github.io/zenix/"><img src="https://img.shields.io/badge/View_Demo-Live_Preview-4F46E5?style=for-the-badge" alt="View Demo" /></a>
    <img src="https://img.shields.io/badge/Astro-v5.0-FF5D01?style=for-the-badge&logo=astro&logoColor=white" alt="Astro Version" />
    <img src="https://img.shields.io/badge/Tailwind-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind Version" />
  </p>

</div>

---

## 🚀 Why Zenix?

The market is flooded with standard, safe, centered layouts. Zenix breaks the mold. We built Zenix with aggressive architectural decisions to ensure your product looks **premium, hand-crafted, and technically sophisticated.**

*   **⚡️ Blazing Fast:** Built on Astro's islands architecture. Ships zero JavaScript by default.
*   **💅 "Anti-Generic" Design:** Features a complex asymmetrical "Bento Box" grid, subtle scroll-reveal animations, and bespoke typography (Space Grotesk + Inter).
*   **🌑 True Dark Mode:** Not just inverted colors. A dedicated OLED-optimized dark theme engine built natively with Tailwind `dark:` variants.
*   **🧠 SPA-like Routing:** Utilizes Astro's native `<ViewTransitions />` for instant, seamless page navigation.
*   **📝 Powerful Content Engine:** Write in MDX. Comes with a sticky, auto-updating Table of Contents and custom UI components (like `<Callout>`) out of the box.

## 🛠️ Quick Start

Get up and running in under 2 minutes.

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/zenix.git my-saas

# 2. Enter the directory
cd my-saas

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Visit `http://localhost:4321` to see your site live!

## ⚙️ Configuration (The `config.ts` File)

Zenix is designed to be customized from a single file. Open `src/config.ts` to instantly change the branding across the entire site:

```typescript
// src/config.ts
export const SITE_TITLE = 'Your App Name';
export const SITE_DESCRIPTION = 'The best solution for X.';

// Social Links (Updates the Footer instantly)
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/yourhandle',
  github: 'https://github.com/yourhandle',
};
```

## 🎨 Writing Content (Blog & Changelog)

Zenix utilizes the modern **Astro Content Layer API**. 

All content lives in the `src/content/` directory. You can write using standard Markdown (`.md`) or MDX (`.mdx`).

### Adding a new blog post:
Create a new `.mdx` file in `src/content/blog/`:

```mdx
---
title: "My First Post"
description: "A short summary."
pubDate: 2026-06-01
author: "Founder"
tags: ["update", "feature"]
---

# Hello World!

This is my first post. 

<Callout type="success" title="Success!">
  You can use custom MDX components right inside your writing!
</Callout>
```

## 🚢 Deployment

Zenix is a static site. You can deploy it for free anywhere!

### Vercel / Netlify / Cloudflare Pages
1. Push your code to a GitHub repository.
2. Import the repository into your preferred hosting provider.
3. The platform will automatically detect Astro and build your site.

### GitHub Pages
Zenix includes a pre-configured GitHub Actions workflow (`.github/workflows/deploy.yml`). Just push to your `main` or `master` branch, and the action will automatically build and deploy your site to GitHub Pages!

*(Note: Ensure you update the `site` and `base` properties in `astro.config.mjs` if using GitHub pages).*

## 📄 License

MIT License. Do whatever you want with it! (Just don't resell the theme itself).