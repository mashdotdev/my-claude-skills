# Claude Code Skills Collection

Custom skills for [Claude Code](https://claude.ai/code) that extend functionality with domain-specific knowledge and patterns.

## Available Skills

### 🎨 gsap-animations

Create performant GSAP animations with ScrollTrigger, SplitText, and Lenis smooth scrolling in Next.js projects.

**Use when**: Building scroll animations, text reveals, parallax effects, or any GSAP-based motion

**Stack**: GSAP 3.14+, @gsap/react, Lenis, Next.js 16+, React 19, Tailwind CSS v4

## Installation

### Method 1: Direct Copy (Simplest)

```bash
# Navigate to your project's .claude directory
cd your-project/.claude

# Create skills directory if it doesn't exist
mkdir -p skills

# Clone this repo temporarily
git clone https://github.com/yourusername/my-claude-skills.git temp-skills

# Copy the skill you want
cp -r temp-skills/.claude/skills/gsap-animations skills/

# Clean up
rm -rf temp-skills
```

### Method 2: Git Submodule (Stays Updated)

```bash
# In your project root
git submodule add https://github.com/yourusername/my-claude-skills .claude/vendor/skills

# Symlink specific skills
cd .claude/skills
ln -s ../vendor/skills/.claude/skills/gsap-animations gsap-animations
```

### Method 3: NPM Package (Coming Soon)

```bash
npm install @yourusername/claude-skills-gsap
```

## Usage in Claude Code

Once installed, invoke the skill in Claude Code:

```
/gsap-animations
```

Or reference it in your requests:

```
"Create a hero section with scroll-triggered text reveal using GSAP"
```

Claude will automatically use the skill's patterns and best practices.

## Skill Structure

Each skill contains:

- **SKILL.md** - Main skill definition with frontmatter and core patterns
- **skill.json** - Metadata and requirements (for marketplace)
- **Supporting docs** - Extended recipes and patterns (RECIPES.md, SCROLLTRIGGER.md, etc.)

## Creating Your Own Skills

1. Create a directory: `.claude/skills/your-skill-name/`
2. Add `SKILL.md` with frontmatter:

```yaml
---
name: your-skill-name
description: What the skill does
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Your Skill Documentation

Provide patterns, examples, and best practices here.
```

3. (Optional) Add `skill.json` for marketplace compatibility

## GitHub Actions Integration

This repository includes GitHub Actions workflows for Claude Code:

- **claude.yml** - PR assistant triggered by @claude mentions
- **claude-code-review.yml** - Automatic code review on PRs

Copy these to your project's `.github/workflows/` to enable.

## Contributing

Contributions welcome! Please:

1. Follow existing skill structure
2. Include comprehensive examples
3. Document common mistakes
4. Add skill.json metadata

## License

MIT

## Resources

- [Claude Code Documentation](https://claude.ai/code)
- [GSAP Documentation](https://gsap.com/docs/)
- [Skills Guide](CLAUDE.md)
