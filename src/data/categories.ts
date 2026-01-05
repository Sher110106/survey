export interface SubPrinciple {
  id: string;
  name: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  weight: number;
  description: string;
  scoringAnchors: {
    high: string;
    medium: string;
    low: string;
  };
  subPrinciples?: SubPrinciple[];
  hasCriticalFailure?: boolean;
}

export const categories: Category[] = [
  {
    id: "retrofit",
    name: "Retrofit & Plug-Play",
    weight: 0.3,
    description: "Ease of installation in the existing Indian context without professional help.",
    scoringAnchors: {
      high: "9–10: Non-invasive, no drilling, fits standard Indian fixtures, DIY in <15 mins",
      medium: "5–8: Minor intervention required (nail, adhesive, screwdriver), might need adapter",
      low: "1–4: Requires drilling RCC, structural changes, or professional installation"
    }
  },
  {
    id: "design",
    name: "Design Integrity",
    weight: 0.3,
    description: "Quality and thoughtfulness of the product design - average of 8 principles.",
    scoringAnchors: {
      high: "9–10: Excellent across all 8 principles",
      medium: "5–8: Good overall with some weaknesses",
      low: "1–4: Significant flaws in multiple principles"
    },
    subPrinciples: [
      { id: "functionality", name: "Functionality", description: "Does it actually solve the core problem?" },
      { id: "durability", name: "Durability", description: "Can it survive Indian conditions: dust, 40°C+ heat, monsoon humidity?" },
      { id: "resource", name: "Resource Efficiency", description: "Is it lightweight with low embodied carbon?" },
      { id: "affordability", name: "Affordability", description: "Is the estimated payback period < 3–5 years?" },
      { id: "health", name: "Health/Wellbeing", description: "Does it improve Indoor Environmental Quality?" },
      { id: "aesthetics", name: "Aesthetics", description: "Does it look like a finished consumer product?" },
      { id: "flexibility", name: "Flexibility", description: "Is it modular? Can it move with the tenant?" },
      { id: "circularity", name: "Circularity", description: "Can it be easily disassembled for recycling?" }
    ],
    hasCriticalFailure: true
  },
  {
    id: "netzero",
    name: "Net-Zero Impact",
    weight: 0.3,
    description: "Quantifiable impact on energy or water usage.",
    scoringAnchors: {
      high: "9–10: Saves >15% of cooling/lighting/water load, grid-stress relief potential",
      medium: "5–8: Saves 5–15% of load, noticeable bill reduction",
      low: "1–4: Saves <5% or purely symbolic, carbon to produce may outweigh savings"
    }
  },
  {
    id: "feasibility",
    name: "Feasibility",
    weight: 0.1,
    description: "Realistic execution within student/team constraints.",
    scoringAnchors: {
      high: "9–10: All parts available locally, team has tools, buildable this semester",
      medium: "5–8: Parts need ordering, requires learning new software/tools",
      low: "1–4: Relies on theoretical tech, expensive sensors, unavailable methods"
    }
  }
];

export const DEFAULT_SCORE = 10;
