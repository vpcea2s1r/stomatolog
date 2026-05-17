import { execSync } from 'node:child_process';

const themes = ['medical', 'warm', 'premium', 'purple', 'experimental'];

for (const theme of themes) {
  execSync(`node scripts/build-theme.js ${theme}`, { stdio: 'inherit' });
}

console.log('\n✅ All themes built!');
console.log(themes.map(t => `  dist/${t}/`).join('\n'));
