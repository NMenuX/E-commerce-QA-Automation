# ShopTest – E-commerce QA Automation Framework

Portfolio-ready browser automation for the Sauce Demo practice store, built with Playwright, TypeScript, Node.js, reusable Page Objects, and GitHub Actions.

## Coverage

The suite contains 38 named scenarios across authentication, product discovery, cart, and checkout. It includes positive and negative cases, data-driven product detail checks, sorting validation, form error checks, and end-to-end order confirmation. Each scenario runs in Chromium, Firefox, and WebKit.

## Requirements and setup

- Node.js 20+
- npm

```bash
npm install
npx playwright install --with-deps
npm test