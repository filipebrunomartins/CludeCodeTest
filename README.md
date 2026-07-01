# UIGen

AI-powered React component generator with a live, in-browser preview — chat with Claude to describe a component and watch it render instantly, no bundler or file system required.

## Prerequisites

- Node.js 18+
- npm

## Setup

1. **Optional** Edit `.env` and replace `your-api-key-here` with your Anthropic API key from [console.anthropic.com](https://console.anthropic.com/settings/keys):

```
ANTHROPIC_API_KEY=sk-ant-...
```

The project runs without an API key — it falls back to a mock provider that returns canned components instead of calling Claude. If you leave the placeholder unchanged, you'll get the mock.

2. Install dependencies and initialize the database:

```bash
npm run setup
```

> **Don't run `npm audit fix`.** Dependencies are pinned to specific versions that work together, and `audit fix` can bump packages past compatible versions and break the app. Known security issues are addressed by updating the pinned versions directly — most recently, Next.js was bumped to a patched release to fix the React2Shell vulnerability (CVE-2025-55182 / CVE-2025-66478). If your scanner still flags something, raise it rather than running `audit fix`.

This command will:

- Install all dependencies
- Generate Prisma client
- Run database migrations

## Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Other commands

```bash
npm run build       # production build
npm run lint         # next lint
npm test             # run the vitest test suite
npm run db:reset     # reset the SQLite dev database (destructive)
```

## Usage

1. Sign up or continue as an anonymous user
2. Describe the React component you want to create in the chat
3. Watch it render in the live preview as the AI generates it
4. Switch to Code view to inspect and edit the generated files directly
5. Keep chatting with the AI to iterate on and refine your components

## Features

- AI-powered component generation using Claude
- Live, in-browser preview with no bundler and no files written to disk
- Virtual file system with a Monaco-based code editor and file tree
- Component and chat history persistence for registered users
- Anonymous usage supported, with work carried over on sign-up

## Tech Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Prisma with SQLite
- Anthropic Claude AI
- Vercel AI SDK
