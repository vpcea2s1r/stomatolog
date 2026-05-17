import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const theme = process.argv[2] || process.env.THEME || 'medical';
const themesDir = path.resolve('src/themes', theme);

if (!fs.existsSync(themesDir)) {
  console.error(`Theme "${theme}" not found at ${themesDir}`);
  process.exit(1);
}

console.log(`\n🎨 Building theme: ${theme}\n`);

const copy = (srcRel, dstRel) => {
  const src = path.resolve('src/themes', theme, srcRel);
  const dst = path.resolve('src', dstRel);
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    console.log(`  ✓ ${srcRel} → ${dstRel}`);
  }
};

copy('variables.css', 'styles/theme.css');
copy('Hero.astro', 'components/HeroActive.astro');
copy('config.json', 'themes/active.json');

console.log(`\n  Building...\n`);
const outDir = path.resolve(`dist/${theme}`);
execSync(`npx astro build --out-dir "${outDir}"`, {
  stdio: 'inherit',
  env: { ...process.env, THEME: theme, PUBLIC_THEME: theme },
});

console.log(`\n✅ Theme "${theme}" built → dist/${theme}/\n`);
