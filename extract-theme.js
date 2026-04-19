/**
 * WHP Wellness Theme Extractor
 *
 * Instructions:
 * 1. Open https://www.whpwellness.com in Chrome
 * 2. Press F12 to open DevTools
 * 3. Go to the Console tab
 * 4. Paste this entire script and press Enter
 * 5. Copy the JSON output
 * 6. Replace the NEEDS_CONFIRMATION values in theme.json
 */

(function extractWixTheme() {
  const html = document.documentElement;
  const cs = getComputedStyle(html);

  // Extract color variables (Wix uses color_0 through color_65)
  const colors = {};
  for (let i = 0; i <= 65; i++) {
    const v = cs.getPropertyValue('--color_' + i).trim();
    if (v) {
      // Convert RGB triplet to hex
      const parts = v.split(',').map(Number);
      if (parts.length === 3 && parts.every(p => !isNaN(p))) {
        const hex = '#' + parts.map(p => p.toString(16).padStart(2, '0')).join('');
        colors['color_' + i] = { rgb: v, hex: hex };
      } else {
        colors['color_' + i] = { raw: v };
      }
    }
  }

  // Extract font variables (Wix uses font_0 through font_10)
  const fonts = {};
  for (let i = 0; i <= 10; i++) {
    const v = cs.getPropertyValue('--font_' + i).trim();
    if (v) {
      fonts['font_' + i] = v;
      // Try to extract font-family name
      const match = v.match(/([^/]+)$/);
      if (match) {
        const families = match[1].trim();
        fonts['font_' + i + '_family'] = families;
      }
    }
  }

  // Extract Wix Studio Theme (wst) variables
  const wstVars = {};
  const wstPrefixes = [
    '--wst-color-fill-background-primary',
    '--wst-color-fill-background-secondary',
    '--wst-color-text-primary',
    '--wst-color-text-secondary',
    '--wst-color-action',
    '--wst-color-title',
    '--wst-color-subtitle',
    '--wst-color-line',
    '--wst-accent-1-color',
    '--wst-font-style-h1',
    '--wst-font-style-h2',
    '--wst-font-style-h3',
    '--wst-font-style-h4',
    '--wst-font-style-h5',
    '--wst-font-style-h6',
    '--wst-font-style-body-large',
    '--wst-font-style-body-medium',
    '--wst-font-style-body-small',
  ];
  wstPrefixes.forEach(prop => {
    const v = cs.getPropertyValue(prop).trim();
    if (v) wstVars[prop] = v;
  });

  // Extract site width
  const siteWidth = cs.getPropertyValue('--site-width').trim();

  // Extract computed styles from key elements
  const elements = {};

  // Header
  const header = document.querySelector('#SITE_HEADER');
  if (header) {
    const hcs = getComputedStyle(header);
    elements.header = {
      backgroundColor: hcs.backgroundColor,
      height: hcs.height,
      color: hcs.color
    };
  }

  // First button found
  const btn = document.querySelector('[class*="StylableButton"]');
  if (btn) {
    const bcs = getComputedStyle(btn);
    elements.button = {
      backgroundColor: bcs.backgroundColor,
      color: bcs.color,
      borderRadius: bcs.borderRadius,
      padding: bcs.padding,
      fontFamily: bcs.fontFamily,
      fontSize: bcs.fontSize,
      fontWeight: bcs.fontWeight,
      textTransform: bcs.textTransform,
      border: bcs.border
    };
  }

  // Body text
  const body = document.body;
  const bodyCs = getComputedStyle(body);
  elements.body = {
    color: bodyCs.color,
    fontFamily: bodyCs.fontFamily,
    fontSize: bodyCs.fontSize,
    lineHeight: bodyCs.lineHeight,
    backgroundColor: bodyCs.backgroundColor
  };

  // First H1
  const h1 = document.querySelector('h1');
  if (h1) {
    const h1cs = getComputedStyle(h1);
    elements.h1 = {
      color: h1cs.color,
      fontFamily: h1cs.fontFamily,
      fontSize: h1cs.fontSize,
      fontWeight: h1cs.fontWeight,
      lineHeight: h1cs.lineHeight,
      letterSpacing: h1cs.letterSpacing,
      textTransform: h1cs.textTransform
    };
  }

  // First H2
  const h2 = document.querySelector('h2');
  if (h2) {
    const h2cs = getComputedStyle(h2);
    elements.h2 = {
      color: h2cs.color,
      fontFamily: h2cs.fontFamily,
      fontSize: h2cs.fontSize,
      fontWeight: h2cs.fontWeight,
      lineHeight: h2cs.lineHeight,
      letterSpacing: h2cs.letterSpacing,
      textTransform: h2cs.textTransform
    };
  }

  // First H3
  const h3 = document.querySelector('h3');
  if (h3) {
    const h3cs = getComputedStyle(h3);
    elements.h3 = {
      color: h3cs.color,
      fontFamily: h3cs.fontFamily,
      fontSize: h3cs.fontSize,
      fontWeight: h3cs.fontWeight
    };
  }

  // Links
  const link = document.querySelector('a[href]');
  if (link) {
    const lcs = getComputedStyle(link);
    elements.link = {
      color: lcs.color,
      textDecoration: lcs.textDecoration
    };
  }

  // Nav items
  const navItems = document.querySelectorAll('nav a, [data-testid="linkElement"]');
  const navTexts = [];
  navItems.forEach(n => {
    const text = n.textContent.trim();
    if (text && text.length < 50 && !navTexts.includes(text)) navTexts.push(text);
  });

  // Container/section backgrounds
  const sections = document.querySelectorAll('section, [data-mesh-id]');
  const sectionBgs = new Set();
  sections.forEach(s => {
    const bg = getComputedStyle(s).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)') sectionBgs.add(bg);
  });

  const result = {
    themeColors: colors,
    themeFonts: fonts,
    wstVariables: wstVars,
    siteWidth: siteWidth,
    computedElements: elements,
    navigationItems: navTexts,
    sectionBackgrounds: Array.from(sectionBgs)
  };

  // Output
  const output = JSON.stringify(result, null, 2);
  console.log(output);

  // Also copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(output).then(() => {
      console.log('\n--- Copied to clipboard! Paste into a file. ---');
    });
  }

  return result;
})();
