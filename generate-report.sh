#!/bin/bash

OUTPUT="PROJECT_REPORT.md"
echo "" > "$OUTPUT"

echo "# 📦 PROJECT FULL REPORT" >> "$OUTPUT"
echo "Generated: $(date)" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# ═══ 1. هيكل المجلدات ═══
echo "## 📁 Directory Structure" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
find src -type f -name "*.tsx" -o -name "*.ts" | sort >> "$OUTPUT"
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

# ═══ 2. ملفات API والإعدادات ═══
echo "## 🔧 Core Files (api, settings, types)" >> "$OUTPUT"
for f in src/lib/api.ts src/lib/settings.ts src/lib/image.ts src/lib/colors.ts src/types/*.ts; do
  if [ -f "$f" ]; then
    echo "### 📄 $f" >> "$OUTPUT"
    echo '```tsx' >> "$OUTPUT"
    cat "$f" >> "$OUTPUT"
    echo '```' >> "$OUTPUT"
    echo "" >> "$OUTPUT"
  fi
done

# ═══ 3. ملفات SEO ═══
echo "## 🔍 SEO Files" >> "$OUTPUT"
for f in src/components/seo/*.tsx src/components/seo/*.ts; do
  if [ -f "$f" ]; then
    echo "### 📄 $f" >> "$OUTPUT"
    echo '```tsx' >> "$OUTPUT"
    cat "$f" >> "$OUTPUT"
    echo '```' >> "$OUTPUT"
    echo "" >> "$OUTPUT"
  fi
done

# ═══ 4. ملفات الصفحات (pages) ═══
echo "## 📄 Pages" >> "$OUTPUT"
find src/app -name "page.tsx" -o -name "layout.tsx" | sort | while read f; do
  echo "### 📄 $f" >> "$OUTPUT"
  echo '```tsx' >> "$OUTPUT"
  cat "$f" >> "$OUTPUT"
  echo '```' >> "$OUTPUT"
  echo "" >> "$OUTPUT"
done

# ═══ 5. ملف next.config ═══
echo "## ⚙️ Config Files" >> "$OUTPUT"
for f in next.config.js next.config.mjs next.config.ts tsconfig.json .env.local; do
  if [ -f "$f" ]; then
    echo "### 📄 $f" >> "$OUTPUT"
    echo '```' >> "$OUTPUT"
    if [ "$f" = ".env.local" ]; then
      # إخفاء القيم الحساسة
      sed 's/=.*/=***HIDDEN***/' "$f" >> "$OUTPUT"
    else
      cat "$f" >> "$OUTPUT"
    fi
    echo '```' >> "$OUTPUT"
    echo "" >> "$OUTPUT"
  fi
done

# ═══ 6. package.json (dependencies) ═══
echo "### 📄 package.json (deps only)" >> "$OUTPUT"
echo '```json' >> "$OUTPUT"
node -e "
const p = require('./package.json');
console.log(JSON.stringify({
  name: p.name,
  dependencies: p.dependencies,
  devDependencies: p.devDependencies
}, null, 2));
" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

# ═══ 7. أول 5 أسطر من كل component ═══
echo "## 🧩 Components (interface/props only)" >> "$OUTPUT"
find src/components -name "*.tsx" | sort | while read f; do
  echo "### 📄 $f" >> "$OUTPUT"
  echo '```tsx' >> "$OUTPUT"
  # استخرج الـ imports والـ interfaces والـ Props
  head -80 "$f" >> "$OUTPUT"
  echo "" >> "$OUTPUT"
  echo "// ... (rest of component)" >> "$OUTPUT"
  echo '```' >> "$OUTPUT"
  echo "" >> "$OUTPUT"
done

echo "✅ Report generated: $OUTPUT"
echo "📊 Total files: $(find src -type f -name '*.tsx' -o -name '*.ts' | wc -l)"
echo "📝 Report size: $(wc -l < $OUTPUT) lines"

