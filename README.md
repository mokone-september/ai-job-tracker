# AI Job Tracker

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react)](https://react.dev/)
[![Strapi](https://img.shields.io/badge/Strapi-5-4945ff?logo=strapi)](https://strapi.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10-f69220?logo=pnpm)](https://pnpm.io/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

An AI-powered job application tracker built with Next.js, Strapi, TypeScript,
and pnpm Workspaces. The repository is a monorepo that separates the web
frontend from the CMS and API foundation.

> **Project status:** The repository is an early-stage product in active
> development. It currently includes authentication, user accounts, and an
> AI-assisted CV analysis flow backed by the Strapi API. The remaining planned
> capabilities are listed in the [roadmap](#roadmap).

## Table of Contents

- [Project Highlights](#project-highlights)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Available Scripts](#available-scripts)
- [Performance and SEO](#performance-and-seo)
- [Accessibility](#accessibility)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Author](#author)

## Project Highlights

- Monorepo managed with pnpm Workspaces.
- Next.js 16 frontend using the App Router and React 19.
- Strapi 5 CMS and REST API foundation.
- SQLite support for local development, with MySQL and PostgreSQL configuration
	available in the CMS.
- Chakra UI, Tailwind CSS, and responsive layout foundations in the web app.
- TypeScript across both applications.

## Features

The product is planned to support:

- Job application tracking.
- AI-assisted job application management.
- Company, application, and notes management.
- Authentication and user accounts.
- Dashboard and analytics.
- CV analysis, interview preparation, and resume management.
- Calendar integration and email reminders.
- Responsive web experiences.

The current implementation includes authentication, user accounts, CV analysis,
interview preparation, resume management, and the web application shell with
Strapi configuration.
The remaining product features are still in development.

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript |
| UI | Chakra UI, Tailwind CSS, Framer Motion, React Icons |
| Forms and validation | React Hook Form, Zod |
| Client data and state | TanStack Query, Axios, TinyBase |
| Backend | Strapi 5, REST API |
| Development database | SQLite with `better-sqlite3` |
| Optional database configuration | MySQL and PostgreSQL |
| Tooling | ESLint, pnpm Workspaces |

## Project Structure

```text
ai-job-tracker/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── app/                # App Router pages, layout, and global styles
│   │   ├── components/ui/      # Shared frontend UI providers and components
│   │   ├── public/             # Static frontend assets
│   │   └── package.json
│   └── cms/                    # Strapi CMS and REST API
│       ├── config/             # Server, database, API, and plugin settings
│       ├── database/migrations/ # Database migrations
│       ├── public/uploads/     # CMS upload directory
│       ├── src/api/            # Content types and API modules
│       └── package.json
├── .github/                    # Issue and pull request templates
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── package.json                # Root workspace scripts
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── SECURITY.md
```

The workspace is configured to include `packages/*` for future shared packages.
No shared packages are currently present in the repository.

## Prerequisites

- Node.js 22 or newer. The CMS supports Node.js 20 through 26 according to its
	package configuration; Node.js 22 is the recommended workspace version.
- pnpm 10 or newer.

Verify your installed versions:

```bash
node -v
pnpm -v
```

## Installation

Clone the repository, enter the project directory, and install dependencies:

```bash

cd ai-job-tracker
pnpm install
```

## Environment Variables

The CMS includes an example environment file at
`apps/cms/.env.example`. Copy it to `apps/cms/.env` for local development and
replace every placeholder secret with a securely generated value:

```bash
cp apps/cms/.env.example apps/cms/.env
```

| Variable | Purpose |
| --- | --- |
| `HOST` | CMS bind host. |
| `PORT` | CMS port; defaults to `1337`. |
| `APP_KEYS` | Strapi application keys. |
| `API_TOKEN_SALT` | Salt for Strapi API tokens. |
| `ADMIN_JWT_SECRET` | Secret for Strapi admin authentication. |
| `TRANSFER_TOKEN_SALT` | Salt for Strapi transfer tokens. |
| `JWT_SECRET` | Secret for JWT authentication. |
| `ENCRYPTION_KEY` | Strapi encryption key. |

The database configuration also supports `DATABASE_CLIENT`, `DATABASE_URL`,
and the `DATABASE_*` connection settings documented in
`apps/cms/config/database.ts` when using a database other than the default
SQLite setup. Never commit `.env` files or real credentials.

## Development

Start the Next.js application in one terminal:

```bash
pnpm dev:web
```

The web app runs at <http://localhost:3000>.

Start Strapi in a separate terminal:

```bash
pnpm dev:cms
```

The Strapi admin panel runs at <http://localhost:1337/admin>.

## Available Scripts

### Workspace scripts

| Command | Description |
| --- | --- |
| `pnpm install` | Install workspace dependencies. |
| `pnpm dev:web` | Start the Next.js development server. |
| `pnpm dev:cms` | Start Strapi in development mode. |
| `pnpm --filter web add package-name` | Add a dependency to the frontend. |
| `pnpm --filter cms add package-name` | Add a dependency to the CMS. |
| `pnpm add package-name -w` | Add a dependency to the workspace root. |

### Application scripts

| Command | Description |
| --- | --- |
| `pnpm --filter web build` | Build the Next.js application. |
| `pnpm --filter web start` | Start the built Next.js application. |
| `pnpm --filter web lint` | Run the frontend ESLint checks. |
| `pnpm --filter cms build` | Build the Strapi admin application. |
| `pnpm --filter cms start` | Start Strapi in production mode. |
| `pnpm --filter cms console` | Open the Strapi console. |

## Performance and SEO

- Next.js provides the production build and routing foundation.
- The frontend uses Next.js metadata with the title `AI Job Tracker` and a
	description for search and browser contexts.
- The frontend ESLint configuration includes Next.js Core Web Vitals rules.
- Production builds should be tested with Lighthouse or another performance
	tool after user-facing pages are implemented.

No performance score, sitemap, robots policy, structured data, or analytics
integration is currently claimed by this repository.

## Accessibility

- Chakra UI provides accessible component primitives and keyboard-friendly
	interaction patterns when used according to its guidance.
- The frontend sets the document language to English and uses responsive layout
	primitives.
- New pages should preserve semantic HTML, visible focus states, keyboard
	navigation, readable color contrast, and useful labels for form controls.

Accessibility should be verified with automated checks and keyboard or screen
reader testing as the product grows.

## Deployment

### Web application on Vercel

The Next.js application can be deployed to [Vercel](https://vercel.com/).
Configure the project root and build settings for `apps/web`, or configure the
equivalent pnpm workspace command in the Vercel project settings. Add any
frontend environment variables in the Vercel dashboard rather than committing
them to the repository.

### Strapi CMS

The CMS is a separate Strapi application and should be deployed to a host that
supports its Node.js runtime and database requirements. Configure its secrets,
port, and database connection using environment variables. The default local
SQLite configuration is intended for development, not production workloads.

## Roadmap

- [x] Authentication
- [x] User accounts
- [x] AI-powered CV analysis
- [x] AI interview preparation
- [x] Resume management
- [ ] Company tracker
- [ ] Job application dashboard
- [ ] Calendar integration
- [ ] Email reminders
- [ ] Analytics
- [ ] Dark mode
- [x] Docker support
- [ ] CI/CD with GitHub Actions
- [ ] Testing with Playwright

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

1. Fork the repository.
2. Create a focused feature branch.
3. Make and verify your changes.
4. Open a pull request using the repository template.

For security issues, follow [SECURITY.md](SECURITY.md) rather than opening a
public issue.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Strapi](https://strapi.io/)
- [Chakra UI](https://chakra-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [pnpm](https://pnpm.io/)

## Author

**Thabiso Kenneth Mokone**

- GitHub: https://github.com/mokone-september
- LinkedIn: https://www.linkedin.com/in/mokone-september/

Built with Next.js, Strapi, TypeScript, and pnpm Workspaces.
