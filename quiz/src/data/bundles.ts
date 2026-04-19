import type { BundleInfo, BundleKey } from '../types';

export const BUNDLES: Record<BundleKey, BundleInfo> = {
  gut: {
    key: 'gut',
    name: 'GI Restore Protocol',
    slug: 'gi-restore-protocol',
    tagline: 'Rebuild your gut from the ground up',
    description:
      'A comprehensive gut-healing protocol designed to restore digestive comfort, support a healthy microbiome, and strengthen your intestinal lining. Formulated by Dr. Nischal for patients with chronic digestive concerns.',
    price: 284,
    productSlugs: ['bio-spore', 'gi-rebuild', 'd-enzyme', 'fiber-fit', 'probiotic-100'],
    products: [
      { name: 'BioSpore Probiotic', description: 'Spore-based probiotic for microbiome diversity' },
      { name: 'GI Rebuild', description: 'L-glutamine and gut-lining repair nutrients' },
      { name: 'D-Enzyme', description: 'Full-spectrum digestive enzyme blend' },
      { name: 'Fiber Fit', description: 'Prebiotic fiber to feed beneficial bacteria' },
      { name: 'Probiotic 100B', description: 'High-potency multi-strain probiotic' },
    ],
  },
  stress: {
    key: 'stress',
    name: 'Adrenal Resilience Bundle',
    slug: 'adrenal-resilience-bundle',
    tagline: 'Calm your stress response naturally',
    description:
      'Targeted adaptogenic support to help your body manage stress, restore healthy cortisol rhythms, and improve sleep quality. Built for the wired-but-tired pattern Dr. Nischal sees most often in clinical practice.',
    price: 189,
    productSlugs: ['n-adrenal', 'calm', 'mag-threonate', 'l-theanine'],
    products: [
      { name: 'N-Adrenal', description: 'Adaptogenic blend with ashwagandha and rhodiola' },
      { name: 'Calm', description: 'GABA and magnesium for nervous system support' },
      { name: 'Mag Threonate', description: 'Brain-bioavailable magnesium for sleep and focus' },
      { name: 'L-Theanine', description: 'Calm alertness without drowsiness' },
    ],
  },
  immune: {
    key: 'immune',
    name: 'Immune Defense Protocol',
    slug: 'immune-defense-protocol',
    tagline: 'Strengthen your body\u2019s natural defenses',
    description:
      'Foundational immune support combining key vitamins, minerals, and botanical extracts to help your body defend against illness and recover faster when it does.',
    price: 103,
    productSlugs: ['immune', 'immune-pro', 'vita-c'],
    products: [
      { name: 'Immune Support', description: 'Zinc, vitamin D3, and elderberry complex' },
      { name: 'Immune Pro', description: 'Mushroom-based immune modulator' },
      { name: 'Vita-C', description: 'High-dose buffered vitamin C' },
    ],
  },
  liver: {
    key: 'liver',
    name: 'Liver Detox Protocol',
    slug: 'liver-detox-protocol',
    tagline: 'Support your body\u2019s detox pathways',
    description:
      'Liver-focused detoxification support to help your body process and eliminate toxins more efficiently. Ideal for brain fog, skin issues, and chemical sensitivities.',
    price: 156,
    productSlugs: ['liver-sauce-1', 'detox-2', 'n-a-c', 'glutathione-cacao-mint'],
    products: [
      { name: 'Liver Sauce Phase 1', description: 'Milk thistle, artichoke, and dandelion root' },
      { name: 'Detox Phase 2', description: 'Amino acid conjugation support' },
      { name: 'NAC', description: 'N-acetyl cysteine for glutathione production' },
      { name: 'Glutathione (Cacao Mint)', description: 'Liposomal glutathione \u2014 the master antioxidant' },
    ],
  },
  hormone: {
    key: 'hormone',
    name: "Women's Hormone Balance",
    slug: 'womens-hormone-balance',
    tagline: 'Restore hormonal harmony',
    description:
      'Comprehensive hormonal support for women at every stage \u2014 from PMS and painful periods to perimenopause and beyond. Formulated to address the root causes of hormonal imbalance.',
    price: 167,
    productSlugs: ['dim-cdg', 'estro-fem', 'menstracalm', 'hair-nails'],
    products: [
      { name: 'DIM + CDG', description: 'Supports healthy estrogen metabolism' },
      { name: 'EstroFem', description: 'Vitex, dong quai, and black cohosh blend' },
      { name: 'MenstraCalm', description: 'Cramp and PMS symptom relief' },
      { name: 'Hair & Nails', description: 'Biotin, collagen peptides, and silica' },
    ],
  },
  longevity: {
    key: 'longevity',
    name: 'Cellular Vitality Protocol',
    slug: 'cellular-vitality-protocol',
    tagline: 'Age well at the cellular level',
    description:
      'Cutting-edge longevity nutrients including NAD+ precursors, omega-3s, and powerful antioxidants to support cellular energy, reduce inflammation, and protect against age-related decline.',
    price: 212,
    productSlugs: ['nad-gold', 'omega-capsules', 'turmeric', 'redox-u'],
    products: [
      { name: 'NAD Gold', description: 'NMN-based NAD+ precursor for cellular energy' },
      { name: 'Omega Capsules', description: 'High-EPA/DHA fish oil for inflammation' },
      { name: 'Turmeric', description: 'Bioavailable curcumin with black pepper extract' },
      { name: 'Redox-U', description: 'CoQ10 and PQQ for mitochondrial support' },
    ],
  },
  metabolic: {
    key: 'metabolic',
    name: 'Metabolic Support Protocol',
    slug: 'metabolic-support-protocol',
    tagline: 'Balance blood sugar and metabolism',
    description:
      'Targeted support for healthy blood sugar, reduced cravings, and metabolic efficiency. Designed for people who feel like their metabolism is working against them.',
    price: 147,
    productSlugs: ['amp-k', 'inositol-blend', 'fiber-fit'],
    products: [
      { name: 'AMP-K', description: 'Berberine and alpha-lipoic acid for glucose metabolism' },
      { name: 'Inositol Blend', description: 'Myo and D-chiro inositol for insulin sensitivity' },
      { name: 'Fiber Fit', description: 'Prebiotic fiber to slow glucose absorption' },
    ],
  },
};

export const BUNDLE_KEYS: BundleKey[] = Object.keys(BUNDLES) as BundleKey[];
