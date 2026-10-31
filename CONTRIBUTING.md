# Contributing to SuperSvelte

First off, thank you for considering contributing to SuperSvelte! It's people like you who make open source such a wonderful place to build.

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please be respectful, constructive, and kind in all interactions.

## Reporting Issues

- **Found a bug?** Please submit an issue using our [Bug Report Template](https://github.com/FunctionalFrost/supersvelte/issues/new?template=bug_report.yml).
- **Security concerns?** Please review our [Security Policy](SECURITY.md) and report vulnerabilities confidentially via email.

---

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v22+ recommended)
- [pnpm](https://pnpm.io/) (v10+ or v12+)

### Local Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/FunctionalFrost/supersvelte.git
   cd supersvelte
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Fill in your local database connection and auth secrets. SuperSvelte uses:
   - [Neon](https://neon.tech) (PostgreSQL) or local Postgres
   - [Better Auth](https://www.better-auth.com)
   - [Upstash Redis](https://upstash.com) & [QStash](https://upstash.com/docs/qstash/overall/getstarted)
   - [Resend](https://resend.com) (Transactional Email)
   - [Polar.sh](https://polar.sh) (Sandbox credentials for SaaS billing demo)

4. **Run migrations / push schema:**

   ```bash
   pnpm db:push
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```

---

## Guidelines for Code Contributions

### Branching & Commits

- Create a feature branch from `main`:
  ```bash
  git checkout -b feat/your-feature-name
  # or
  git checkout -b fix/issue-description
  ```
- Keep commits focused and descriptive, preferably following [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `docs:`, `refactor:`).

### Coding Standards

- **Svelte 5**: Use modern Svelte 5 Runes (`$state`, `$derived`, `$props`, `$effect`).
- **Styling**: Tailwind CSS v4 & Yaxa UI components.
- **Type Safety**: TypeScript in strict mode. Run `pnpm check` before opening a PR.
- **Formatting & Linting**: SuperSvelte uses Prettier and ESLint.

### Pre-PR Checklist

Before submitting your pull request, verify that all checks pass:

```bash
# Format code
pnpm format

# Run linting, type-checking, and unit tests
pnpm validate

# Verify production build
pnpm build
```

---

## Submitting a Pull Request

1. Push your branch to your fork on GitHub.
2. Open a Pull Request targeting the `main` branch.
3. Fill out the pull request template with a summary of the changes, related issue numbers, and any screenshots for visual updates.
4. Ensure CI checks pass. Maintainers will review your PR as soon as possible.
