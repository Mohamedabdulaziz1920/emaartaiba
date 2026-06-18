#!/bin/bash

OUTPUT="MINI_REPORT.md"
echo "" > "$OUTPUT"

echo "# 🔑 ESSENTIAL FILES REPORT" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# هيكل الملفات
echo "## 📁 All Files" >> "$OUTPUT"
echo '```' >> "$OUTPUT"
find src -type f \( -name "*.tsx" -o -name "*.ts" \) | sort >> "$OUTPUT"
echo '```' >> "$OUTPUT"
echo "" >> "$OUTPUT"

# الملفات الأساسية
for f in \
  src/lib/api.ts \
  src/lib/settings.ts \
  src/lib/image.ts \
  src/app/layout.tsx \
  src/app/page.tsx \
  src/app/services/page.tsx \
  src/app/services/\[slug\]/page.tsx \
  src/app/projects/page.tsx \
  src/app/projects/\[slug\]/page.tsx \
  src/app/gallery/page.tsx \
  src/app/gallery/\[slug\]/page.tsx \
  src/app/blog/page.tsx \
  src/app/blog/\[slug\]/page.tsx \
  src/app/about/page.tsx \
  src/app/contact/page.tsx \
  src/components/seo/LocalBusinessSchema.tsx \
  src/components/seo/ServiceSchema.tsx \
  src/components/seo/ProjectSchema.tsx \
  src/components/seo/BlogSchema.tsx \
  src/components/seo/GallerySchema.tsx; do
  if [ -f "$f" ]; then
    echo "### 📄 $f" >> "$OUTPUT"
    echo '```tsx' >> "$OUTPUT"
    cat "$f" >> "$OUTPUT"
    echo '```' >> "$OUTPUT"
    echo "" >> "$OUTPUT"
  else
    echo "### ❌ $f (NOT FOUND)" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
  fi
done

echo "✅ Mini report generated!"
echo "📝 Size: $(wc -l < $OUTPUT) lines"
echo "📊 Total project files: $(find src -type f \( -name '*.tsx' -o -name '*.ts' \) | wc -l)"

