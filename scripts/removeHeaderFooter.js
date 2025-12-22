const fs = require('fs');
const path = require('path');

const files = [
  './app/[locale]/about/page.tsx',
  './app/[locale]/account/page.tsx',
  './app/[locale]/admin/orders/page.tsx',
  './app/[locale]/admin/page.tsx',
  './app/[locale]/admin/products/page.tsx',
  './app/[locale]/admin/users/page.tsx',
  './app/[locale]/careers/page.tsx',
  './app/[locale]/cart/page.tsx',
  './app/[locale]/checkout/page.tsx',
  './app/[locale]/contact/page.tsx',
  './app/[locale]/cookies/page.tsx',
  './app/[locale]/deals/page.tsx',
  './app/[locale]/loyalty/page.tsx',
  './app/[locale]/messages/page.tsx',
  './app/[locale]/messages/[id]/page.tsx',
  './app/[locale]/orders/page.tsx',
  './app/[locale]/orders/[id]/page.tsx',
  './app/[locale]/privacy/page.tsx',
  './app/[locale]/products/page.tsx',
  './app/[locale]/referral/page.tsx',
  './app/[locale]/returns/page.tsx',
  './app/[locale]/seller/guide/page.tsx',
  './app/[locale]/sellers/[id]/page.tsx',
  './app/[locale]/shipping/page.tsx',
  './app/[locale]/support/page.tsx',
  './app/[locale]/support/[id]/page.tsx',
  './app/[locale]/terms/page.tsx',
];

let processedCount = 0;
let errorCount = 0;

files.forEach((filePath) => {
  try {
    const fullPath = path.resolve(filePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // Remove Header import
    if (content.includes("import Header from '@/components/layout/Header';")) {
      content = content.replace(/import Header from '@\/components\/layout\/Header';\n/g, '');
      modified = true;
    }

    // Remove Footer import
    if (content.includes("import Footer from '@/components/layout/Footer';")) {
      content = content.replace(/import Footer from '@\/components\/layout\/Footer';\n/g, '');
      modified = true;
    }

    // Remove <Header /> usage (with various whitespace patterns)
    if (content.includes('<Header />')) {
      content = content.replace(/<Header \/>\n/g, '');
      content = content.replace(/\s*<Header \/>\n/g, '');
      modified = true;
    }

    // Remove <Footer /> usage (with various whitespace patterns)
    if (content.includes('<Footer />')) {
      content = content.replace(/<Footer \/>\n/g, '');
      content = content.replace(/\s*<Footer \/>\n/g, '');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Cleaned: ${filePath}`);
      processedCount++;
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    errorCount++;
  }
});

console.log('\n📊 Summary:');
console.log(`   Processed: ${processedCount} files`);
console.log(`   Errors: ${errorCount} files`);
console.log(`   Total: ${files.length} files`);
