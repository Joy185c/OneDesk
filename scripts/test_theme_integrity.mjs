import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('ONEDESK — THEME ENGINE PROGRAMMATIC VERIFICATION');
console.log('====================================================');

// 1. Check index.html anti-flash script and data-theme
const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf8');
const hasAntiFlashScript = indexHtml.includes('onedesk_theme') && indexHtml.includes('prefers-color-scheme');
const hasSvgGradient = indexHtml.includes('176B50') || indexHtml.includes('123D32');
console.log(`1. Anti-flash inline loader: ${hasAntiFlashScript ? '✅ PASS' : '❌ FAIL'}`);
console.log(`2. Brand favicon theme gradient: ${hasSvgGradient ? '✅ PASS' : '❌ FAIL'}`);

// 2. Check index.css variables for Alpine Sage & Obsidian Forest
const indexCss = fs.readFileSync(path.resolve('src/index.css'), 'utf8');
const hasAlpineSage = indexCss.includes('--brand-primary: #176B50;') && indexCss.includes('--bg-canvas: #F7F9F6;');
const hasObsidianForest = indexCss.includes('--brand-primary: #C5F277;') && indexCss.includes('--bg-canvas: #091B17;');
const hasCompatibilityAliases = indexCss.includes('--cu-purple: var(--brand-primary);') && indexCss.includes('--grad-signature: var(--brand-gradient);');
const hasChartTokens = indexCss.includes('--chart-1:') && indexCss.includes('--chart-6:');

console.log(`3. Alpine Sage Light Mode Tokens (:root / [data-theme="light"]): ${hasAlpineSage ? '✅ PASS' : '❌ FAIL'}`);
console.log(`4. Obsidian Forest Dark Mode Tokens ([data-theme="dark"]): ${hasObsidianForest ? '✅ PASS' : '❌ FAIL'}`);
console.log(`5. Backward-Compatibility Aliases: ${hasCompatibilityAliases ? '✅ PASS' : '❌ FAIL'}`);
console.log(`6. Harmonic Chart Palette Tokens: ${hasChartTokens ? '✅ PASS' : '❌ FAIL'}`);

// 3. Check ThemeContext existence and attributes
const themeContext = fs.readFileSync(path.resolve('src/context/ThemeContext.tsx'), 'utf8');
const setsDataTheme = themeContext.includes("document.documentElement.setAttribute('data-theme', theme)");
const usesLocalStorage = themeContext.includes("localStorage.setItem(THEME_STORAGE_KEY, theme)") || themeContext.includes("localStorage.setItem('onedesk_theme', theme)");
console.log(`7. ThemeContext sets document data-theme: ${setsDataTheme ? '✅ PASS' : '❌ FAIL'}`);
console.log(`8. ThemeContext persists to localStorage: ${usesLocalStorage ? '✅ PASS' : '❌ FAIL'}`);

// 4. Check App header toggle & profile theme modal
const workspaceApp = fs.readFileSync(path.resolve('src/components/dashboard/WorkspaceApp.tsx'), 'utf8');
const navbar = fs.readFileSync(path.resolve('src/components/Navbar.tsx'), 'utf8');
const profileToolsModal = fs.readFileSync(path.resolve('src/components/dashboard/ProfileToolsModal.tsx'), 'utf8');

const hasWorkspaceToggle = workspaceApp.includes('useTheme()') && workspaceApp.includes('toggleTheme');
const hasNavbarToggle = navbar.includes('useTheme()') && navbar.includes('toggleTheme');
const hasThemeSelectionModal = profileToolsModal.includes("activeModal === 'themes'") && profileToolsModal.includes('Alpine Sage') && profileToolsModal.includes('Obsidian Forest');

console.log(`9. Dashboard header theme toggle: ${hasWorkspaceToggle ? '✅ PASS' : '❌ FAIL'}`);
console.log(`10. Public Landing Navbar theme toggle: ${hasNavbarToggle ? '✅ PASS' : '❌ FAIL'}`);
console.log(`11. Profile Modal Theme Selector: ${hasThemeSelectionModal ? '✅ PASS' : '❌ FAIL'}`);

console.log('====================================================');
console.log('ALL 11 THEME ENGINE INTEGRITY CHECKS COMPLETED');
console.log('====================================================');
