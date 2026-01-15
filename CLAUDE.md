# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Claude Code Skills Repository** that provides custom skills/plugins to extend Claude Code functionality. Skills are specialized command packages that Claude Code can invoke to perform domain-specific tasks with context-aware guidance.

## Repository Structure

```
.claude/
  settings.json           # Claude Code configuration and hooks
  skills/
    gsap-animations/      # GSAP animation skill for Next.js projects
      SKILL.md           # Skill definition and core patterns
      RECIPES.md         # Extended animation recipes
      SCROLLTRIGGER.md   # Advanced ScrollTrigger patterns

.github/
  workflows/
    claude.yml                # Claude Code PR assistant (triggered by @claude mentions)
    claude-code-review.yml    # Automatic code review on PRs
```

## Skills Architecture

### What is a Skill?

A skill is a specialized knowledge package that provides:

- Domain-specific patterns and best practices
- Tool permissions (Read, Write, Edit, Glob, Grep)
- Structured documentation (SKILL.md + supporting files)
- Context-aware guidance for specific tasks

### Skill File Structure

Each skill lives in `.claude/skills/<skill-name>/` with:

- `SKILL.md` - Main skill definition (frontmatter + documentation)
  - Frontmatter: name, description, allowed-tools
  - Core patterns and setup instructions
  - File structure and common mistakes
- Additional markdown files for extended documentation (optional)

### Current Skills

#### gsap-animations

**Purpose**: Create performant GSAP animations with ScrollTrigger, SplitText, and Lenis in Next.js projects

**Stack Requirements**:

- GSAP 3.14+ with ScrollTrigger, SplitText plugins
- @gsap/react (useGSAP hook)
- Lenis (smooth scrolling)
- Next.js 16+ App Router with React 19
- Tailwind CSS v4

**Key Patterns**:

- All components must be client components (`"use client"`)
- Register GSAP plugins at module level: `gsap.registerPlugin(ScrollTrigger, SplitText)`
- Use `useGSAP` hook for animations (not useEffect)
- Always cleanup SplitText instances in useGSAP return function
- Prefer transforms (x, y, scale, rotate) over layout properties for performance
- Use refs for element targeting, never direct DOM queries

**Critical Rules**:

1. SplitText cleanup is mandatory: always call `.revert()` in useGSAP return
2. Guard against null refs before animating
3. Use `scrub: 1` (not `scrub: true`) for smoother scroll animations
4. Lenis handles scroll - don't fight it with GSAP scroll methods

## GitHub Actions Integration

### Claude PR Assistant (claude.yml)

**Triggers**: Issue/PR comments or reviews containing `@claude`

**Capabilities**:

- Responds to @claude mentions in issues, PRs, and review comments
- Can read CI results with `actions: read` permission
- Uses `CLAUDE_CODE_OAUTH_TOKEN` secret for authentication

**Usage**: Comment `@claude <your request>` in any issue or PR

### Claude Code Review (claude-code-review.yml)

**Triggers**: PR opened, synchronize, ready_for_review, reopened

**Capabilities**:

- Automatic code review on all PRs (can be filtered by author or file paths)
- Uses the code-review plugin from claude-code-plugins marketplace
- Provides inline PR review comments

**Customization**:

- Uncomment `if:` conditions to filter by PR author
- Uncomment `paths:` to only review specific file types

## Development Workflow

### Working with Skills

1. **Creating a New Skill**:
   - Create directory: `.claude/skills/<skill-name>/`
   - Create `SKILL.md` with frontmatter (name, description, allowed-tools)
   - Document core patterns, setup, and common mistakes
   - Add supporting documentation files as needed

2. **Skill Frontmatter Format**:

```yaml
---
name: skill-name
description: Brief description shown in skill list
allowed-tools: Read, Write, Edit, Glob, Grep
---
```

1. **Skill Documentation Best Practices**:
   - Start with project stack requirements
   - Provide required component setup patterns
   - Show core patterns with code examples
   - Include common mistakes section
   - Cross-reference supporting documentation files

### Hooks System

The repository uses Claude Code hooks (defined in `.claude/settings.json`):

**SessionStart Hook**: Automatically displays project structure at session start using PowerShell

- Shows directory tree (max depth: 3)
- Excludes: node_modules, .next, .git, bun.lockb
- Helps Claude understand project layout immediately

### GitHub Integration Secrets

Required secret: `CLAUDE_CODE_OAUTH_TOKEN`

- Set in repository settings → Secrets and variables → Actions
- Required for both GitHub Actions workflows
- Authenticates Claude Code operations

## Best Practices

### Skill Documentation

- Keep SKILL.md focused on core patterns and setup
- Use separate files (RECIPES.md, etc.) for extended examples
- Always include "Common Mistakes to Avoid" section
- Provide copy-paste ready code examples
- Document cleanup requirements (especially for libraries with state)

### GitHub Actions

- Test workflows with @claude mentions in draft PRs first
- Use `allowed_domains` in claude_args to restrict tool access if needed
- Filter automatic reviews by author to avoid reviewing maintainer PRs

### Repository Maintenance

- Keep skills focused on single domains (don't mix unrelated patterns)
- Update skill documentation when stack versions change
- Document required package versions in SKILL.md frontmatter area
