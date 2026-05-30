export type ProductCategory = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  cardImage: string;
  eyebrow: string;
  features: string[];
  materials: string[];
  sizes: { label: string; cm: string; inches: string }[];
  gsmRange: string;
  customization: string[];
  packaging: string[];
  idealFor: string[];
  leadTime: string;
  moq: string;
};

export const productCategories: ProductCategory[] = [
  {
    slug: "bath-towels",
    name: "Bath Towels",
    eyebrow: "Signature Collection",
    shortDescription:
      "Plush, absorbent bath towels engineered for luxury hospitality and premium retail.",
    description:
      "Our signature bath towels combine long-staple cotton with precision terry construction for exceptional loft, absorbency, and durability through commercial laundering cycles. Designed for five-star hotels, boutique resorts, and discerning retail brands across North America.",
    heroImage: "https://picsum.photos/seed/bath-towels/1400/900",
    cardImage: "https://picsum.photos/seed/bath-towels-card/800/600",
    features: [
      "Double-loop terry for superior absorbency",
      "Pre-shrunk and colour-fast through 200+ wash cycles",
      "Reinforced hems with double-needle stitching",
      "Low-lint finish for commercial laundry compatibility",
    ],
    materials: [
      "100% long-staple combed cotton",
      "Premium cotton-poly blends (70/30, 80/20)",
      "Organic cotton (GOTS certified upon request)",
      "Zero-twist construction for ultra-plush hand-feel",
    ],
    sizes: [
      { label: "Standard Bath", cm: "70 × 140 cm", inches: '27.5" × 55"' },
      { label: "Oversized Bath", cm: "80 × 160 cm", inches: '31.5" × 63"' },
      { label: "Bath Sheet", cm: "90 × 180 cm", inches: '35.5" × 71"' },
    ],
    gsmRange: "500–700 GSM",
    customization: [
      "Dobby borders and satin stripes",
      "Embroidery up to 15,000 stitches",
      "Custom dye matching (Pantone)",
      "Woven labels and hang tags",
    ],
    packaging: [
      "Individual polybag with branded insert",
      "Bulk cartons (12–24 units)",
      "Retail-ready gift sets",
      "Custom branded packaging upon MOQ",
    ],
    idealFor: ["Luxury hotels", "Resort chains", "Premium home retailers"],
    leadTime: "45–60 days FOB",
    moq: "500 units per size/colour",
  },
  {
    slug: "hand-towels",
    name: "Hand Towels",
    eyebrow: "Essentials",
    shortDescription:
      "Refined hand towels with consistent weight and finish for guest bathrooms and retail sets.",
    description:
      "Hand towels that balance softness with quick-drying performance. Each piece is calibrated for uniform GSM across production runs—critical for hospitality procurement and private label consistency.",
    heroImage: "https://picsum.photos/seed/hand-towels/1400/900",
    cardImage: "https://picsum.photos/seed/hand-towels-card/800/600",
    features: [
      "Uniform GSM tolerance ±5%",
      "Quick-dry loop construction",
      "Reinforced header tape",
      "Colour-matched to bath towel collections",
    ],
    materials: [
      "100% combed cotton terry",
      "Bamboo-cotton blend (50/50)",
      "Recycled cotton blend options",
    ],
    sizes: [
      { label: "Standard Hand", cm: "40 × 70 cm", inches: '16" × 28"' },
      { label: "Guest Hand", cm: "50 × 90 cm", inches: '20" × 35"' },
    ],
    gsmRange: "400–550 GSM",
    customization: [
      "Contrast border or self-border dobby",
      "Logo embroidery (chest or corner)",
      "Custom sizes for ADA-compliant dispensers",
    ],
    packaging: [
      "Sleeve-wrapped pairs",
      "Bulk packs of 24",
      "Matched set packaging with bath towels",
    ],
    idealFor: ["Hotels", "Spas", "Bathroom accessory brands"],
    leadTime: "40–55 days FOB",
    moq: "1,000 units per colour",
  },
  {
    slug: "face-towels",
    name: "Face Towels & Washcloths",
    eyebrow: "Guest Comfort",
    shortDescription:
      "Soft, gentle face towels and washcloths for spa, hospitality, and skincare retail.",
    description:
      "Face towels crafted with a tighter loop for a smoother surface against skin. Ideal for facial care routines, spa treatments, and premium guest amenities where tactile quality defines the brand experience.",
    heroImage: "https://picsum.photos/seed/face-towels/1400/900",
    cardImage: "https://picsum.photos/seed/face-towels-card/800/600",
    features: [
      "Gentle loop for sensitive skin",
      "Bleach-safe white and custom colours",
      "Consistent sizing for amenity kits",
      "Low-pilling finish",
    ],
    materials: [
      "100% cotton velour face",
      "Organic cotton terry",
      "Micro-cotton for ultra-softness",
    ],
    sizes: [
      { label: "Washcloth", cm: "30 × 30 cm", inches: '12" × 12"' },
      { label: "Face Towel", cm: "33 × 33 cm", inches: '13" × 13"' },
      { label: "Guest Face", cm: "40 × 40 cm", inches: '16" × 16"' },
    ],
    gsmRange: "350–450 GSM",
    customization: [
      "Spa logo embroidery",
      "Custom weave patterns",
      "Scented packaging partnerships",
    ],
    packaging: [
      "Individual wrap for amenity trays",
      "Sets of 6 or 12 in display boxes",
      "Bulk cartons for institutional buyers",
    ],
    idealFor: ["Spas", "Skincare brands", "Boutique hotels"],
    leadTime: "35–50 days FOB",
    moq: "2,000 units",
  },
  {
    slug: "bath-mats",
    name: "Bath Mats",
    eyebrow: "Floor Collection",
    shortDescription:
      "Non-slip, highly absorbent bath mats built for daily commercial use.",
    description:
      "Bath mats with dense pile construction and reinforced backing options. Engineered to withstand heavy foot traffic in hotel bathrooms while maintaining shape and absorbency over thousands of wash cycles.",
    heroImage: "https://picsum.photos/seed/bath-mats/1400/900",
    cardImage: "https://picsum.photos/seed/bath-mats-card/800/600",
    features: [
      "High-density pile for water retention",
      "Anti-skid latex or TPR backing options",
      "Quick-dry core construction",
      "Reinforced binding on all edges",
    ],
    materials: [
      "100% cotton tufted pile",
      "Cotton with latex backing",
      "Microfiber top with cotton base",
    ],
    sizes: [
      { label: "Standard Mat", cm: "50 × 80 cm", inches: '20" × 32"' },
      { label: "Large Mat", cm: "60 × 90 cm", inches: '24" × 36"' },
      { label: "Contour Mat", cm: "50 × 70 cm", inches: '20" × 28"' },
    ],
    gsmRange: "600–800 GSM",
    customization: [
      "Logo tufting or embroidery",
      "Custom shapes and sizes",
      "Colour-coordinated to towel collections",
    ],
    packaging: [
      "Rolled and banded",
      "Flat-fold retail packaging",
      "Bulk cartons (10–20 units)",
    ],
    idealFor: ["Hotels", "Senior living", "Home goods retailers"],
    leadTime: "45–60 days FOB",
    moq: "500 units",
  },
  {
    slug: "hotel-linen",
    name: "Hotel Linen Programs",
    eyebrow: "Hospitality",
    shortDescription:
      "Complete linen programs with matched weights, colours, and replenishment planning.",
    description:
      "End-to-end hotel linen sourcing: bath towels, hand towels, face cloths, bath mats, and pool towels in coordinated palettes. We support par-level planning, seasonal refreshes, and brand-standard compliance for multi-property groups.",
    heroImage: "https://picsum.photos/seed/hotel-linen/1400/900",
    cardImage: "https://picsum.photos/seed/hotel-linen-card/800/600",
    features: [
      "Matched GSM across entire program",
      "Par-level and replenishment support",
      "Brand-standard colour libraries",
      "Commercial laundry tested",
    ],
    materials: [
      "Institutional-grade combed cotton",
      "Blended options for cost optimization",
      "Premium white and custom colour programs",
    ],
    sizes: [
      { label: "Full Program", cm: "Custom per property", inches: "Custom per property" },
      { label: "Standard Bath Set", cm: "70 × 140 cm bath + accessories", inches: '27.5" × 55" bath + accessories' },
    ],
    gsmRange: "400–650 GSM (program-dependent)",
    customization: [
      "Property-specific embroidery",
      "Custom dobby borders per brand tier",
      "Seasonal colour rotations",
      "Dedicated account management",
    ],
    packaging: [
      "Property-coded bulk cartons",
      "Amenity kit assembly",
      "Direct-to-warehouse shipping (FOB/CIF)",
    ],
    idealFor: ["Hotel groups", "Management companies", "Franchise operators"],
    leadTime: "60–90 days for full program rollout",
    moq: "Program-based (typically 5,000+ units)",
  },
  {
    slug: "bath-robes",
    name: "Bath Robes",
    eyebrow: "Spa & Suite",
    shortDescription:
      "Kimono, shawl, and hooded robes in terry and waffle weaves for hospitality and retail.",
    description:
      "Luxury bath robes with tailored fit, reinforced seams, and premium finishing. Available in terry, waffle, and microfiber constructions for spa, suite, and retail channels across North America.",
    heroImage: "https://picsum.photos/seed/bath-robes/1400/900",
    cardImage: "https://picsum.photos/seed/bath-robes-card/800/600",
    features: [
      "Double-stitched seams and reinforced shoulders",
      "Generous sizing with belt loops",
      "Patch or shawl collar options",
      "Colour-fast through commercial care",
    ],
    materials: [
      "100% cotton terry (400 GSM)",
      "Cotton waffle weave",
      "Microfiber with cotton lining",
      "Organic cotton terry",
    ],
    sizes: [
      { label: "S/M", cm: "Chest 110–120 cm", inches: '43"–47" chest' },
      { label: "L/XL", cm: "Chest 125–140 cm", inches: '49"–55" chest' },
      { label: "XXL", cm: "Chest 145–160 cm", inches: '57"–63" chest' },
    ],
    gsmRange: "350–450 GSM (terry); waffle by weave",
    customization: [
      "Embroidered monograms and logos",
      "Custom collar and pocket styles",
      "Branded hang tags and gift boxes",
    ],
    packaging: [
      "Individual polybag with hanger",
      "Gift box sets for retail",
      "Bulk cartons (12–24 units)",
    ],
    idealFor: ["Resorts", "Spa brands", "Luxury retail"],
    leadTime: "55–75 days FOB",
    moq: "300 units per style/size",
  },
  {
    slug: "kitchen-towels",
    name: "Kitchen Towels",
    eyebrow: "Culinary",
    shortDescription:
      "Absorbent, lint-free kitchen towels for hospitality kitchens and gourmet retail.",
    description:
      "Flat-weave and terry kitchen towels designed for professional kitchens and premium home goods. Striped, checked, and solid patterns with excellent absorbency and minimal lint transfer.",
    heroImage: "https://picsum.photos/seed/kitchen-towels/1400/900",
    cardImage: "https://picsum.photos/seed/kitchen-towels-card/800/600",
    features: [
      "Lint-free flat weave options",
      "High absorbency terry variants",
      "Colour-fast through bleach cycles",
      "Hanging loops on select styles",
    ],
    materials: [
      "100% cotton herringbone",
      "Terry velour kitchen towels",
      "Linen-cotton blends",
    ],
    sizes: [
      { label: "Standard", cm: "45 × 70 cm", inches: '18" × 28"' },
      { label: "Oversized", cm: "50 × 80 cm", inches: '20" × 32"' },
    ],
    gsmRange: "300–400 GSM",
    customization: [
      "Custom stripe and check patterns",
      "Logo jacquard weaving",
      "Private label packaging",
    ],
    packaging: [
      "Sets of 3 or 6 with belly band",
      "Bulk cartons (48–96 units)",
      "Retail-ready display boxes",
    ],
    idealFor: ["Restaurant groups", "Culinary retail", "Corporate gifting"],
    leadTime: "40–55 days FOB",
    moq: "1,000 units per pattern",
  },
  {
    slug: "beach-towels",
    name: "Beach Towels",
    eyebrow: "Resort",
    shortDescription:
      "Vibrant, quick-dry beach towels for resort retail and hospitality pool programs.",
    description:
      "Large-format beach towels with reactive dye prints, velour finishes, and sand-resistant construction. Built for resort boutiques, pool cabanas, and seasonal retail across coastal markets.",
    heroImage: "https://picsum.photos/seed/beach-towels/1400/900",
    cardImage: "https://picsum.photos/seed/beach-towels-card/800/600",
    features: [
      "Reactive dye for colour longevity",
      "Sand shakes off easily",
      "Oversized coverage",
      "Quick-dry fiber technology",
    ],
    materials: [
      "100% cotton velour",
      "Cotton-poly blend for weight reduction",
      "Recycled cotton options",
    ],
    sizes: [
      { label: "Standard Beach", cm: "75 × 150 cm", inches: '30" × 60"' },
      { label: "Oversized Beach", cm: "90 × 180 cm", inches: '35" × 71"' },
      { label: "Round Beach", cm: "150 cm diameter", inches: '59" diameter' },
    ],
    gsmRange: "400–500 GSM",
    customization: [
      "All-over print (screen or digital)",
      "Resort logo placement",
      "Custom colourways per season",
    ],
    packaging: [
      "Rolled with branded band",
      "Individual polybags",
      "Display-ready hook packaging",
    ],
    idealFor: ["Beach resorts", "Pool retail", "Tourism merchandise"],
    leadTime: "50–65 days FOB",
    moq: "500 units per design",
  },
  {
    slug: "pool-towels",
    name: "Pool Towels",
    eyebrow: "Aquatic",
    shortDescription:
      "Durable, chlorine-resistant pool towels for hotels, clubs, and aquatic centres.",
    description:
      "Pool towels engineered for chlorine exposure, sun fading, and high-volume laundering. Lighter weight than bath towels with faster dry times—ideal for pool decks and fitness facilities.",
    heroImage: "https://picsum.photos/seed/pool-towels/1400/900",
    cardImage: "https://picsum.photos/seed/pool-towels-card/800/600",
    features: [
      "Chlorine-resistant dye systems",
      "Lightweight quick-dry construction",
      "High-volume laundry durability",
      "Vivid colour retention",
    ],
    materials: [
      "100% ring-spun cotton",
      "Cotton-poly blends (60/40)",
      "Solution-dyed acrylic options",
    ],
    sizes: [
      { label: "Standard Pool", cm: "70 × 140 cm", inches: '27.5" × 55"' },
      { label: "Compact Pool", cm: "60 × 120 cm", inches: '24" × 47"' },
    ],
    gsmRange: "350–450 GSM",
    customization: [
      "Property logo dobby or print",
      "Colour-coded by pool zone",
      "Numbered inventory systems",
    ],
    packaging: [
      "Bulk cartons (24–48 units)",
      "Laundry bag compatible sizing",
      "RFID tagging upon request",
    ],
    idealFor: ["Hotels with pools", "Country clubs", "Aquatic centres"],
    leadTime: "45–60 days FOB",
    moq: "1,000 units per colour",
  },
  {
    slug: "spa-towels",
    name: "Spa Towels",
    eyebrow: "Wellness",
    shortDescription:
      "Ultra-soft spa towels in white and natural tones for treatment rooms and wellness brands.",
    description:
      "Spa-grade towels with exceptional softness, consistent white brightness, and gentle loop construction. Designed for treatment tables, relaxation lounges, and premium wellness retail.",
    heroImage: "https://picsum.photos/seed/spa-towels/1400/900",
    cardImage: "https://picsum.photos/seed/spa-towels-card/800/600",
    features: [
      "Optical white brightness maintained",
      "Extra-soft zero-twist options",
      "Treatment table sizing available",
      "Hypoallergenic finishing",
    ],
    materials: [
      "100% combed cotton (spa white)",
      "Bamboo-cotton blend",
      "Organic cotton (certified)",
    ],
    sizes: [
      { label: "Spa Hand", cm: "40 × 70 cm", inches: '16" × 28"' },
      { label: "Spa Bath", cm: "70 × 140 cm", inches: '27.5" × 55"' },
      { label: "Treatment Wrap", cm: "100 × 180 cm", inches: '39" × 71"' },
    ],
    gsmRange: "450–600 GSM",
    customization: [
      "Spa logo embroidery",
      "Natural dye colour palettes",
      "Aromatherapy-compatible packaging",
    ],
    packaging: [
      "Wellness kit assembly",
      "Eco-friendly paper wrap",
      "Retail gift sets",
    ],
    idealFor: ["Day spas", "Wellness resorts", "Beauty brands"],
    leadTime: "45–60 days FOB",
    moq: "500 units per size",
  },
  {
    slug: "private-labeling",
    name: "Private Label Manufacturing",
    eyebrow: "Your Brand",
    shortDescription:
      "Full private label programs—from product development to packaging and export logistics.",
    description:
      "Partner with Deepam Textiles to launch or scale your towel and linen brand. We offer end-to-end private label services: product development, sampling, custom weaving, branding, packaging, and FOB/CIF export to USA and Canada.",
    heroImage: "https://picsum.photos/seed/private-label/1400/900",
    cardImage: "https://picsum.photos/seed/private-label-card/800/600",
    features: [
      "Dedicated product development team",
      "Sampling within 2–3 weeks",
      "Full brand compliance documentation",
      "Flexible MOQs for growing brands",
    ],
    materials: [
      "Full material library access",
      "Custom blend development",
      "Sustainable fiber options",
    ],
    sizes: [
      { label: "Custom Development", cm: "Any specification", inches: "Any specification" },
    ],
    gsmRange: "300–700+ GSM (custom)",
    customization: [
      "Logo weaving and embroidery",
      "Custom packaging and inserts",
      "Brand guidelines implementation",
      "Exclusive colour development",
    ],
    packaging: [
      "Retail-ready packaging design",
      "E-commerce friendly formats",
      "Bulk and mixed-SKU cartons",
    ],
    idealFor: ["Emerging brands", "Retail chains", "Amazon/e-commerce sellers"],
    leadTime: "60–90 days (including sampling)",
    moq: "Flexible — from 500 units per SKU",
  },
  {
    slug: "promotional-towels",
    name: "Promotional Towels",
    eyebrow: "Branded",
    shortDescription:
      "Custom-branded towels for corporate gifting, events, and promotional campaigns.",
    description:
      "Cost-effective promotional towels with screen printing, embroidery, or jacquard logo placement. Ideal for corporate gifts, golf tournaments, fitness brands, and trade show giveaways targeting North American markets.",
    heroImage: "https://picsum.photos/seed/promotional/1400/900",
    cardImage: "https://picsum.photos/seed/promotional-card/800/600",
    features: [
      "Multi-colour screen printing",
      "Embroidery up to 12 colours",
      "Fast turnaround on standard sizes",
      "Bulk pricing tiers",
    ],
    materials: [
      "100% cotton velour (print-friendly)",
      "Microfiber sports towels",
      "Cotton terry promotional weights",
    ],
    sizes: [
      { label: "Sports Towel", cm: "40 × 80 cm", inches: '16" × 32"' },
      { label: "Golf Towel", cm: "40 × 60 cm", inches: '16" × 24"' },
      { label: "Full Size Promo", cm: "70 × 140 cm", inches: '27.5" × 55"' },
    ],
    gsmRange: "300–450 GSM",
    customization: [
      "Full-colour screen print",
      "Embroidered logos",
      "Custom pantone colours",
      "Individual name personalization",
    ],
    packaging: [
      "Individual polybag with logo sticker",
      "Bulk cartons",
      "Gift box upgrades",
    ],
    idealFor: ["Corporate gifting", "Sports events", "Marketing agencies"],
    leadTime: "30–45 days FOB",
    moq: "250 units per design",
  },
];

export function getCategoryBySlug(slug: string): ProductCategory | undefined {
  return productCategories.find((c) => c.slug === slug);
}

export function getAllCategorySlugs(): string[] {
  return productCategories.map((c) => c.slug);
}

export const productInterestOptions = productCategories.map((c) => ({
  value: c.slug,
  label: c.name,
}));

export const whyChooseUsFeatures = [
  {
    title: "Export-Ready Documentation",
    description:
      "Complete commercial invoices, packing lists, and certificates of origin prepared for USA and Canada customs clearance.",
  },
  {
    title: "Consistent GSM Tolerance",
    description:
      "±5% weight consistency across production runs—critical for hospitality procurement and private label quality standards.",
  },
  {
    title: "In-House Quality Lab",
    description:
      "Absorbency, shrinkage, colour-fastness, and tensile testing on every production batch before shipment.",
  },
  {
    title: "Flexible MOQs",
    description:
      "Scalable minimum orders from 250 promotional units to full hotel linen programs at 5,000+ pieces.",
  },
  {
    title: "Dedicated Export Team",
    description:
      "English-speaking account managers aligned to North American business hours for seamless communication.",
  },
  {
    title: "Sustainable Options",
    description:
      "Organic cotton, recycled blends, and eco-packaging available with third-party certification support.",
  },
  {
    title: "Private Label Expertise",
    description:
      "End-to-end brand development from sampling to retail-ready packaging for emerging and established labels.",
  },
  {
    title: "40+ Years Manufacturing",
    description:
      "Deepam Textiles heritage in Solapur—India's premier terry towel manufacturing hub since 1982.",
  },
];

export type Certification = {
  name: string;
  description: string;
  certificateNumber?: string;
  pdfUrl?: string;
};

export const certifications: Certification[] = [
  {
    name: "ISO 9001:2015",
    description:
      "Quality management systems certification for consistent production standards.",
    certificateNumber: "QMS-DT-ISO9001-2015-IN-2847",
    pdfUrl: "/certificates/iso-9001-2015.pdf",
  },
  {
    name: "OEKO-TEX Standard 100",
    description: "Tested for harmful substances—safe for direct skin contact.",
    certificateNumber: "22.HIN.38492",
    pdfUrl: "/certificates/oeko-tex-standard-100.pdf",
  },
  {
    name: "BCI",
    description:
      "Better Cotton Initiative membership supporting sustainable cotton sourcing.",
    certificateNumber: "BCI-MEM-2024-DT-1183",
    pdfUrl: "/certificates/bci-membership.pdf",
  },
  {
    name: "GOTS",
    description:
      "Global Organic Textile Standard for certified organic cotton programs.",
    certificateNumber: "GOTS-IN-ORG-009284",
    pdfUrl: "/certificates/gots-certificate.pdf",
  },
  {
    name: "BSCI",
    description:
      "Business Social Compliance Initiative for ethical manufacturing practices.",
    certificateNumber: "BSCI-AUD-2024-DT-4421",
    pdfUrl: "/certificates/bsci-audit-summary.pdf",
  },
  {
    name: "SEDEX / SMETA",
    description:
      "Supplier Ethical Data Exchange membership with SMETA audit readiness.",
    certificateNumber: "SEDEX-ZS-8847291",
    pdfUrl: "/certificates/sedex-membership.pdf",
  },
];

export const manufacturingSteps = [
  {
    step: "01",
    title: "Yarn Selection",
    description:
      "Long-staple cotton sourced from certified suppliers. Yarn count and twist optimized per product specification.",
  },
  {
    step: "02",
    title: "Weaving & Knitting",
    description:
      "State-of-the-art looms produce terry, velour, waffle, and flat-weave constructions with precision tension control.",
  },
  {
    step: "03",
    title: "Dyeing & Finishing",
    description:
      "Reactive and vat dye systems with colour matching to Pantone standards. Pre-shrinking and softening treatments applied.",
  },
  {
    step: "04",
    title: "Cutting & Stitching",
    description:
      "Automated cutting with reinforced hems, double-needle stitching, and quality checkpoints at every seam.",
  },
  {
    step: "05",
    title: "Quality Inspection",
    description:
      "100% visual inspection plus random sampling for GSM, absorbency, shrinkage, and dimensional accuracy.",
  },
  {
    step: "06",
    title: "Packaging & Export",
    description:
      "Custom packaging, carton marking, and FOB/CIF shipment to USA and Canada ports with full documentation.",
  },
];

export const companyStats = [
  { value: "42+", label: "Years Manufacturing" },
  { value: "180K", label: "Units / Month Capacity" },
  { value: "120K", label: "Sq Ft Factory Area" },
  { value: "84", label: "Looms & Machines" },
  { value: "35+", label: "Countries Served" },
  { value: "480+", label: "Containers Shipped" },
];

export const howWeWorkSteps = [
  {
    step: "01",
    title: "Inquiry",
    description:
      "Share your buyer profile, product specs, volumes, and target market. We respond within one business day.",
  },
  {
    step: "02",
    title: "Sample",
    description:
      "Physical samples and lab dips shipped for approval. Revisions included until specs are confirmed.",
  },
  {
    step: "03",
    title: "Quote (FOB/CIF)",
    description:
      "Detailed pricing with Incoterms, MOQs, lead times, and port options—Nhava Sheva (JNPT) or CIF to your port.",
  },
  {
    step: "04",
    title: "Production",
    description:
      "Vertical manufacturing with batch tracking and milestone updates throughout the production run.",
  },
  {
    step: "05",
    title: "QC",
    description:
      "In-house lab testing and 100% visual inspection. Batch reports available on request.",
  },
  {
    step: "06",
    title: "Export",
    description:
      "Commercial invoice, packing list, certificate of origin, and compliance documentation prepared.",
  },
  {
    step: "07",
    title: "Delivery",
    description:
      "FOB handoff at JNPT or CIF delivery to USA/Canada ports with dedicated account support.",
  },
];

export const audienceSegments = [
  {
    title: "Hospitality",
    description:
      "Matched linen programs, par-level planning, and commercial-laundry tested GSM consistency for hotels and resorts.",
    href: "/products/hotel-linen",
  },
  {
    title: "Retailers & Brands",
    description:
      "Private label development, retail-ready packaging, and flexible MOQs for home and lifestyle collections.",
    href: "/private-label",
  },
  {
    title: "Distributors & Wholesalers",
    description:
      "Volume pricing tiers, mixed-SKU cartons, and reliable replenishment for regional distribution networks.",
    href: "/products",
  },
  {
    title: "Importers",
    description:
      "Export documentation, FOB/CIF terms, and English-speaking account management aligned to your time zone.",
    href: "/contact",
  },
];

export const tradeTerms = [
  { label: "MOQs", value: "From 250 units (promotional) to 5,000+ (programs)" },
  { label: "Lead Times", value: "35–90 days FOB depending on category and volume" },
  { label: "Sampling", value: "Physical samples within 2–3 weeks; lab dips available" },
  { label: "Incoterms", value: "FOB Nhava Sheva (JNPT) · CIF to USA/Canada ports" },
  { label: "Export Port", value: "Nhava Sheva / JNPT, Maharashtra, India" },
  { label: "Payment Terms", value: "30% deposit · 70% against BL copy (negotiable for established buyers)" },
];

export const tradeShows = [
  "Heimtextil (Frankfurt)",
  "NY Home Textiles Market",
  "Las Vegas Market",
];

export const caseStudySnippet = {
  title: "North American Resort Group",
  summary:
    "An anonymised five-property resort group replaced their bath linen program with Deepam-manufactured 550 GSM towels—achieving ±3% GSM consistency across 24,000 units and reducing replenishment lead time by 18 days.",
};

export const fabricTextures = [
  { label: "Terry Loop Weave", seed: "terry-weave" },
  { label: "Zero-Twist Plush", seed: "zero-twist" },
  { label: "Waffle Texture", seed: "waffle-texture" },
  { label: "Velour Finish", seed: "velour-finish" },
];

export const socialCompliancePoints = [
  "SEDEX / SMETA audit readiness and transparent supply chain reporting",
  "BSCI-aligned social compliance and regular third-party assessments",
  "WRAP awareness and alignment with international labour standards",
  "Strict no child labour policy with age verification at hiring",
  "Fair labour policy: living wages, safe conditions, and grievance mechanisms",
];

export const faqItems = [
  {
    question: "What are your minimum order quantities (MOQs)?",
    answer:
      "MOQs vary by product category—from 250 units for promotional towels to 500–1,000 units per size/colour for bath and hand towels. Full hotel linen programs typically start at 5,000+ units. Contact us for program-specific MOQs.",
  },
  {
    question: "Can I request samples before placing a bulk order?",
    answer:
      "Yes. Physical samples and lab dips are available within 2–3 weeks. Sample costs may apply and are often credited against your first production order.",
  },
  {
    question: "What are typical lead times?",
    answer:
      "Lead times range from 35–90 days FOB depending on product category, customization, and order volume. Promotional towels can ship in 30–45 days; full private label programs may require 60–90 days including sampling.",
  },
  {
    question: "Do you ship FOB or CIF to the USA and Canada?",
    answer:
      "Both. Default export port is Nhava Sheva (JNPT), Maharashtra. We offer FOB JNPT or CIF to major North American ports with complete commercial documentation.",
  },
  {
    question: "What payment terms do you offer?",
    answer:
      "Standard terms are 30% deposit upon order confirmation and 70% against bill of lading copy. Established buyers may qualify for adjusted terms after credit review.",
  },
  {
    question: "Can you customize sizes, GSM, colours, and branding?",
    answer:
      "Yes. We offer custom sizes (inch and cm), GSM ranges, Pantone colour matching, dobby borders, embroidery, woven labels, and retail-ready packaging.",
  },
  {
    question: "Which certifications do you hold?",
    answer:
      "We maintain ISO 9001:2015, OEKO-TEX Standard 100, BCI membership, GOTS (organic programs), BSCI, and SEDEX/SMETA readiness. Certificate copies are available on request.",
  },
];
