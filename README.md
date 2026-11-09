# Tuncafe

<p align="center">
  <img src="public/tuncafe-logo.png" alt="Tuncafe logo" width="240" />
</p>

<p align="center">
  A responsive café website and customer loyalty app for a family-owned café in Pattaya, Thailand.
</p>

Tuncafe introduces international visitors to Thai drinks, small-batch gelato, and homemade cakes. The app combines a bilingual product menu and café information with customer accounts, order history, and a Payload-backed loyalty program.

## Features

- Responsive landing page designed for mobile, tablet, and desktop
- Eight-item menu with English and Thai names, prices, product images, and category filters
- Thai iced tea Buy 1, Get 1 Half Price promotion for December 2026–January 2027
- Family story, café imagery, Pattaya location details, opening hours, and map/search links
- Shopping basket and demo checkout with Apple Pay or Google Pay selection
- Customer registration, login, logout, and protected account page
- Unique loyalty card number generated for each customer
- One welcome point on registration and one point for each drink purchased
- Current reward-cycle drink history
- Free drink reward at ten points, confirmed with staff credentials
- Staff-audited reward redemptions that reset points and the active drink history
- Payload Admin panel for authorized café administrators

> [!NOTE]
> Checkout currently records a demo order and does not charge a real payment method. Password-reset email delivery is also deferred until the café's email provider is configured.

## Application Routes

| Route              | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| `/`                | Café landing page, menu, promotion, cart, story, and location |
| `/register`        | Customer account registration                                 |
| `/login`           | Customer login                                                |
| `/forgot-password` | Password-reset information                                    |
| `/account`         | Protected loyalty card, points, reward, and drink history     |
| `/admin`           | Payload CMS administration                                    |

## Loyalty Flow

1. A customer registers and receives a unique Tuncafe card number and one welcome point.
2. Signed-in customers place demo orders from the menu.
3. Each drink in the order earns one point; gelato and cakes do not earn drink points.
4. At ten or more points, the account displays the free-drink reward flow.
5. A staff member confirms the in-store redemption using a staff account.
6. Payload records the redemption, resets the customer's points to zero, and closes the current drink-history cycle.

The server recalculates order prices and loyalty points from the trusted product catalog. Collection access rules prevent customers from modifying protected loyalty fields or viewing other customers' records.

## Tech Stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19
- [Payload CMS](https://payloadcms.com/) 4
- [Tailwind CSS](https://tailwindcss.com/) 4
- TypeScript 6
- Figma Make and `@payloadcms/figma`
- pnpm 10 and Node.js 24

## Project Structure

```text
src/
├── app/
│   ├── (frontend)/          # Public pages, account UI, and server actions
│   └── (payload)/           # Payload Admin and API routes
├── collections/
│   ├── Admins.ts            # CMS administrator accounts
│   ├── Media.ts             # Uploaded media
│   ├── Users.ts             # Customer and staff accounts
│   ├── Orders.ts            # Drink orders and loyalty points
│   └── RewardRedemptions.ts # Staff-confirmed free drinks
├── lib/
│   ├── app-auth.ts          # Customer session helpers
│   ├── payload.ts           # Payload client utilities
│   └── products.ts          # Product catalog and categories
└── payload.config.ts        # Figma-managed Payload configuration
```

## Getting Started

### Prerequisites

- Node.js `24.22.1`
- pnpm `10.34.3`
- Access to the Figma Make project for its managed Payload backend

The exact tool versions are declared in `.mise.toml`.

### Installation

```bash
git clone https://github.com/colourverse/tuncafe-dev.git
cd tuncafe-dev
pnpm install
```

Inside Figma Make, the development server is managed automatically and the preview updates as source files change. The platform also injects the Payload database, storage, authentication, and deployment environment.

If you run the app in another compatible environment, start it with:

```bash
pnpm dev
```

The development server uses `PORT` when provided and otherwise defaults to `3000`.

> [!IMPORTANT]
> The Payload/Figma backend variables are platform-managed. Do not add placeholder database credentials or replace `buildFigmaConfig()` with a standard Payload configuration when a normal shell does not contain those variables.

## Available Scripts

| Command                   | Purpose                                                    |
| ------------------------- | ---------------------------------------------------------- |
| `pnpm dev`                | Run the Next.js development server                         |
| `pnpm build`              | Build Payload and the Next.js application                  |
| `pnpm start`              | Serve a completed production build                         |
| `pnpm format`             | Format the codebase with Oxfmt                             |
| `pnpm payload`            | Run the project-installed Payload CLI                      |
| `pnpm generate:types`     | Regenerate Payload TypeScript types when explicitly needed |
| `pnpm generate:importmap` | Regenerate the Payload import map for recovery scenarios   |

## Data and Security

Payload provides separate collections for:

- **Admins** — Figma/Payload CMS editors
- **Users** — public customer accounts and staff accounts
- **Orders** — customer-owned order records with server-calculated totals and points
- **Reward redemptions** — staff-confirmed redemption audit records
- **Media, folders, and tags** — managed assets and organization

Customer sessions use an HTTP-only, same-site cookie. Public registration always creates a customer role, while server-owned fields such as card number, points, and role are protected by collection hooks and field-level access rules. Payload Admin accounts and public app accounts remain separate.

## Configuration Notes

- `FIGMA_PUBLIC_URL` is supplied by Figma Make and is used for preview origins and public metadata.
- The custom image loader in `figma-image-loader.ts` must remain enabled for Payload-managed media.
- Third-party credentials must stay in server-only environment variables and must never use a public client prefix.
- Planned password-reset email delivery will require `RESEND_API_KEY` and the configured sender identity before it is implemented.

## Known Follow-ups

- Connect a real payment provider; the current checkout is a demonstration flow.
- Implement password-reset email delivery after the Resend configuration is available.
- Replace footer social links with the official Tuncafe Facebook, Instagram, YouTube, and TikTok profile URLs.

## License

This project is available under the [MIT License](LICENSE).
