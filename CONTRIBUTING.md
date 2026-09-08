# Contributing to AI Job Tracker

Thank you for contributing. Please read this guide before opening an issue or
pull request.

## Development Setup

Requirements:

- Node.js 22 or newer
- pnpm 10 or newer

Install dependencies from the repository root:

```bash
pnpm install
```

Run the frontend:

```bash
pnpm dev:web
```

Run the CMS in a separate terminal:

```bash
pnpm dev:cms
```

## Issues

Use the bug report template for reproducible problems and the feature request
template for proposed improvements. Search existing issues first and remove
any secrets or personal data from logs and screenshots.

## Pull Requests

1. Create a focused branch from the default branch.
2. Make the smallest change that solves the problem.
3. Update documentation when behavior or setup changes.
4. Run the relevant lint, build, or test commands.
5. Complete the pull request template and explain the verification performed.

Keep pull requests focused. Unrelated formatting changes make review harder
and should be submitted separately.

## Code Style

Follow the existing TypeScript, Next.js, Strapi, and Chakra UI patterns in the
area you are changing. Prefer clear names and small components. Do not commit
environment files, credentials, generated build output, or database contents.

## Code of Conduct

Participation in this project is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
