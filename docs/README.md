# Documentation Index

Central hub for all project documentation.

## 📖 Quick Start

- **[Main README](../README.md)** - Complete setup guide, running the app, useful commands

## 📚 Documentation Categories

### 📋 Planning & Requirements

- [`prd/`](./prd/) – Product Requirements Documents (updated Phase progress)
- [`stories/`](./stories/) – User Stories
- [`cards/`](./cards/) – Issue Cards

### 🧱 Foundation & Technical Guides

- [`foundation/`](./foundation/) – Phase outcome notes (CI/CD, testing)
- [`TESTING.md`](./TESTING.md) – Jest + Maestro implementation details
- [`MAESTRO_TESTING.md`](./MAESTRO_TESTING.md) – Flow authoring and CI guidance
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) – App layout, routing, and data flow
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) – EAS build + submission playbooks

## 🎯 For New Developers

1. Start with [Main README](../README.md) to set up your environment
2. Run `npm run validate-env` after creating a `.env` (see README snippet)
3. Review the updated [PRD](./prd/PRD_EXPO_COMPLETE_SETUP.md) for current scope

## 🎯 For Project Planning

1. Review [PRD](./prd/PRD_EXPO_COMPLETE_SETUP.md) for requirements and status
2. Check [User Stories](./stories/USER_STORIES.md) for feature backlog
3. Review [Foundation Progress](../FOUNDATION_PROGRESS.md) for milestone health

## 📁 Directory Structure

```
docs/
├── README.md                    # This file - Documentation index
├── prd/                         # Product requirements
│   └── PRD_EXPO_COMPLETE_SETUP.md
├── foundation/                  # Phase-by-phase notes
│   ├── code-quality.md
│   ├── ci-cd.md
│   ├── testing-infrastructure.md
│   └── testing-guide.md
├── stories/                     # User stories
│   └── USER_STORIES.md
├── cards/                       # Issue cards
│   └── ISSUE_CARDS.md
├── TESTING.md                   # Jest guide
├── MAESTRO_TESTING.md           # Maestro playbook
├── ARCHITECTURE.md              # System design
└── DEPLOYMENT.md                # EAS build/deploy
```
