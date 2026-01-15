#!/usr/bin/env node

/**
 * Install Claude Code skills from this repository
 * Usage: node install-skill.js <skill-name> <target-project-path>
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: node install-skill.js <skill-name> <target-project-path>');
  console.error('Example: node install-skill.js gsap-animations ~/my-project');
  process.exit(1);
}

const [skillName, targetPath] = args;
const sourceSkillPath = path.join(__dirname, '.claude', 'skills', skillName);
const targetSkillPath = path.join(targetPath, '.claude', 'skills', skillName);

// Check if source skill exists
if (!fs.existsSync(sourceSkillPath)) {
  console.error(`Error: Skill "${skillName}" not found in ${sourceSkillPath}`);
  console.error('Available skills:');
  const skillsDir = path.join(__dirname, '.claude', 'skills');
  if (fs.existsSync(skillsDir)) {
    fs.readdirSync(skillsDir).forEach(skill => {
      console.error(`  - ${skill}`);
    });
  }
  process.exit(1);
}

// Create target .claude/skills directory if it doesn't exist
const targetSkillsDir = path.join(targetPath, '.claude', 'skills');
if (!fs.existsSync(targetSkillsDir)) {
  fs.mkdirSync(targetSkillsDir, { recursive: true });
  console.log(`Created directory: ${targetSkillsDir}`);
}

// Copy skill directory recursively
function copyRecursive(src, dest) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(child => {
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  copyRecursive(sourceSkillPath, targetSkillPath);
  console.log(`✅ Successfully installed "${skillName}" skill to ${targetSkillPath}`);
  console.log('\nYou can now use this skill in Claude Code by invoking:');
  console.log(`  /${skillName}`);
} catch (error) {
  console.error(`Error installing skill: ${error.message}`);
  process.exit(1);
}
