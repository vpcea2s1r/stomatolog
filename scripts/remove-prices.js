import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const pagesDir = 'src/pages/services';

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro'));

let changed = 0;

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // 1. Remove price="..." and priceNumeric={...} from ServiceArticle props
  content = content.replace(/^\s*price="[^"]*"\s*\n/gm, '');
  content = content.replace(/^\s*priceNumeric=\{[\d]+\}\s*\n/gm, '');

  // 2. Fix description that mentions price amounts (e.g. "Цена от 18000 рублей.")
  content = content.replace(/description="[^"]*?(?:Цена|цена|Стоимость|стоимость)[^.]*\.\s*"/g, (match) => {
    // If the desc still mentions price, remove the price sentence
    return match.replace(/\.?\s*(?:Цена|цена|Стоимость|стоимость)[^.]*\.\s*/g, '. ').trim();
  });
  content = content.replace(/description="[^"]*?(?:price|рублей|руб\.|₽)[^"]*"/g, (match) => {
    let cleaned = match.replace(/\.?\s*(?:Цена|цена|Стоимость|стоимость)[^.]*\.\s*/g, '. ').trim();
    cleaned = cleaned.replace(/\s+руб(?:лей|\.)?/gi, '');
    cleaned = cleaned.replace(/[\d\s]+\s*[₽]/, '');
    return cleaned;
  });

  // 3. Remove stat-card sections with price values
  content = content.replace(/<div class="stat-card">\s*<div class="stat(?:-card__)?value">[^<]*[₽руб][^<]*<\/div>\s*<div class="stat-(?:card__)?label">[^<]*<\/div>\s*(?:<div class="stat-(?:card__)?desc">[^<]*<\/div>)?\s*<\/div>/gi, '');

  // 4. Remove entire stats-grid containing price stat-cards
  content = content.replace(/<div class="stats-grid">[\s\S]*?(?:₽|руб)[\s\S]*?<\/div>\s*<\/div>/gi, (match) => {
    // Remove any stats-grid that has price references
    if (/[₽руб]/.test(match)) {
      return '';
    }
    return match;
  });

  // 5. Fix "низкая/высокая/доступная стоимость/цена" text mentions
  content = content.replace(/(?:Низкая|Высокая|Доступная|Невысокая|относительно невысокая|Доступный|Недорогой|низкая|высокая|доступная)\s+(?:стоимость|цена|вариант)/gi, (match) => {
    if (/стоимость/.test(match)) return 'Стоимость';
    if (/цена/.test(match)) return 'Цена';
    if (/вариант/.test(match)) return 'Вариант';
    return match;
  });

  // 6. Remove material-price divs that contain actual price (not labels)
  content = content.replace(/<div class="material-price">[^<]*[₽руб][^<]*<\/div>/gi, '');

  // 7. Remove price mentions in list items within material-cards
  content = content.replace(/<li>[^<]*?(?:₽|руб(?:лей|\.)?)[^<]*<\/li>/gi, (match) => {
    // Keep the list item but remove price info
    let cleaned = match.replace(/[,]?\s*[\d\s]+\s*(?:–|-)\s*[\d\s]+[₽руб]/, '');
    cleaned = cleaned.replace(/[,]?\s*(?:от\s+)?[\d\s]+[₽руб]/, '');
    cleaned = cleaned.replace(/\s*[,:]\s*$/, '');
    return cleaned;
  });

  // 8. Remove inline "дешевле на X%" mentions
  content = content.replace(/дешевле на [\d]+%/, 'доступнее');

  // 9. Replace "Доступная цена" in text
  content = content.replace(/Доступная цена/g, 'Доступность');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✓ ${file}`);
    changed++;
  }
}

console.log(`\n✅ Updated ${changed} of ${files.length} service files\n`);
