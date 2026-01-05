export interface Idea {
  id: number;
  name: string;
  description: string;
  image: string;
  pros: string[];
  cons: string[];
  automationContext: string;
}

export const ideas: Idea[] = [
  {
    id: 1,
    name: "Bimetallic Strip Autonomous Louver",
    description: "A horizontal louver system actuated by bimetallic strips that bend with temperature change. As ambient temperature rises, the strips curve and rotate the louvers open to block direct sunlight; they close automatically when temperature drops. Entirely passive, requiring no sensors, motors, or power.",
    image: "/images/1.png",
    pros: [
      "Fully autonomous, zero power",
      "Proven mechanism (thermostats)",
      "High durability, long life",
      "Low operating cost"
    ],
    cons: [
      "Slow response time",
      "Limited angular motion",
      "Calibration needed for climate",
      "Wind can cause minor oscillations"
    ],
    automationContext: "Natural temperature-responsive automation - could complement motorized systems for hybrid passive/active control during temperature transitions."
  },
  {
    id: 2,
    name: "Origami Accordion Folding Shade",
    description: "A lightweight fabric shade folded into an accordion pattern and guided by rigid side rails. The shade expands downward when pulled and collapses into a compact stack when retracted. Offers high coverage with minimal storage depth.",
    image: "/images/2.png",
    pros: [
      "Extremely compact when folded",
      "No roller tube required",
      "Lightweight and retrofit-friendly",
      "Visually novel form factor"
    ],
    cons: [
      "Requires precise folding",
      "Fabric fatigue over time",
      "Not blackout by default",
      "Guide alignment critical"
    ],
    automationContext: "Compact folding mechanism ideal for motorized micro-adjustments - partial deployment allows precise light control without full open/close cycles."
  },
  {
    id: 3,
    name: "Wind-Responsive Mechanical Louver",
    description: "Louvers mounted on pivots with friction dampers that open automatically when wind speed exceeds a threshold. Enables passive ventilation during hot, windy conditions while remaining closed in calm air. No electronics involved.",
    image: "/images/3.png",
    pros: [
      "Responds automatically to environment",
      "No user input needed",
      "Useful during heat waves",
      "Durable mechanical system"
    ],
    cons: [
      "Directional wind dependence",
      "Threshold not adjustable easily",
      "Possible noise in gusts",
      "Slightly higher mechanical wear"
    ],
    automationContext: "Passive wind response can work alongside motorized sun-tracking - motor override during variable cloud conditions prevents hunting behavior."
  },
  {
    id: 4,
    name: "Reflective Textile + Jute Hybrid Blind",
    description: "A dual-layer blind using an aluminum-coated reflective outer layer bonded to a jute backing. Reflects solar radiation while allowing limited airflow to prevent heat buildup and condensation. Operates as a standard roll-down blind.",
    image: "/images/4.png",
    pros: [
      "High solar heat rejection",
      "Breathable backing reduces condensation",
      "Simple construction",
      "Low-cost materials"
    ],
    cons: [
      "Metallic appearance",
      "Adhesive degradation risk",
      "Slightly heavier",
      "Limited aesthetics"
    ],
    automationContext: "Excellent thermal performance for motorized deployment - reflective layer maximizes energy savings when automated based on solar angle and temperature."
  },
  {
    id: 5,
    name: "Recycled PET Sheet Shade",
    description: "A translucent shading panel made by flattening and weaving recycled PET bottles. Diffuses sunlight while maintaining brightness indoors. Can be mounted as a roller blind or fixed panel.",
    image: "/images/5.png",
    pros: [
      "Very low material cost",
      "Sustainable & eco-friendly",
      "Lightweight",
      "Community-manufacturable"
    ],
    cons: [
      "Labor-intensive fabrication",
      "Inconsistent visual finish",
      "Limited blackout capability",
      "Requires processing setup"
    ],
    automationContext: "Sustainable material choice for motorized blinds - diffused light transmission allows automation to focus on thermal management rather than complete light blocking."
  },
  {
    id: 6,
    name: "Thermal Stress Expansion Roller",
    description: "A fabric roller bonded to a metal tube with mismatched thermal expansion coefficients. As temperature increases, differential expansion causes the shade to unroll automatically; it retracts when temperature drops.",
    image: "/images/6.png",
    pros: [
      "Fully passive automation",
      "No moving parts",
      "High novelty",
      "Silent operation"
    ],
    cons: [
      "Precision fabrication required",
      "Partial deployment only",
      "Slow thermal response",
      "Sensitive to bonding quality"
    ],
    automationContext: "Passive thermal response provides baseline behavior - motor can override for rapid adjustments during sudden cloud cover or heating demand changes."
  },
  {
    id: 7,
    name: "Magnetic Snap-Fit Modular Panels",
    description: "Rigid fabric panels with magnetic edges that snap together and attach magnetically to window frames. Panels can be rearranged or partially removed for flexible shading coverage.",
    image: "/images/7.png",
    pros: [
      "Modular and reconfigurable",
      "No drilling installation",
      "Easy replacement",
      "Tool-free assembly"
    ],
    cons: [
      "Magnet strength limits size",
      "Visible seams",
      "Adhesive degradation over time",
      "Heavier than fabric blinds"
    ],
    automationContext: "Modular design enables zone-based motorized control - individual panels can be actuated for precise light/heat management across large window surfaces."
  },
  {
    id: 8,
    name: "Gravity Counterweight Pulley Shade",
    description: "A fabric shade balanced with a counterweight via pulleys, enabling smooth raising and lowering through gravity. Descent speed can be adjusted using friction pads.",
    image: "/images/8.png",
    pros: [
      "Smooth motion",
      "No springs or motors",
      "Adjustable descent",
      "Easy maintenance"
    ],
    cons: [
      "Requires space for counterweight",
      "Visible hardware",
      "Rope wear over time",
      "Precise balance needed"
    ],
    automationContext: "Counterbalanced mechanism reduces motor load significantly - smaller, quieter motors can achieve precise positioning with minimal power consumption."
  },
  {
    id: 9,
    name: "Dust-Filtering Mesh Shade",
    description: "A fine mesh shade that blocks glare and dust while allowing visibility and airflow. Designed for polluted urban environments and washable in place.",
    image: "/images/9.png",
    pros: [
      "Filters dust and pollution",
      "Maintains visibility",
      "Very low cost",
      "Long lifespan"
    ],
    cons: [
      "Lower heat rejection",
      "Requires regular washing",
      "Limited privacy",
      "Not blackout"
    ],
    automationContext: "Dual-function shading and air filtration - motorized adjustment based on pollution sensors and light levels for optimal indoor air quality."
  },
  {
    id: 10,
    name: "Reversible Seasonal Fabric Shade",
    description: "A dual-sided fabric with a reflective side for summer and a dark absorptive side for winter. The panel is manually flipped seasonally to optimize thermal behavior.",
    image: "/images/10.png",
    pros: [
      "Works year-round",
      "No electronics",
      "Simple materials",
      "Energy-saving"
    ],
    cons: [
      "Manual flipping required",
      "User-dependent",
      "Hinges visible",
      "Not automatic"
    ],
    automationContext: "Seasonal optimization concept can be automated with rotating mechanism - motor switches between reflective/absorptive modes based on outdoor temperature and season."
  },
  {
    id: 11,
    name: "Evaporative Wet-Cloth Cooling Shade",
    description: "A water-wicking fabric shade that cools incoming air through evaporation. Most effective in hot, dry climates and inspired by traditional Indian cooling techniques.",
    image: "/images/11.png",
    pros: [
      "Significant cooling in dry air",
      "Very low cost",
      "Zero electricity",
      "Traditional, proven principle"
    ],
    cons: [
      "Ineffective in humid regions",
      "Requires water refilling",
      "Mold risk",
      "Maintenance heavy"
    ],
    automationContext: "Evaporative cooling effect can be combined with motorized water distribution - automation adjusts wetting based on humidity sensors for optimal cooling."
  },
  {
    id: 12,
    name: "Shape Memory Alloy (SMA) Curtain Rod",
    description: "A curtain rod made from shape memory alloy that bends when temperature crosses a threshold, mechanically opening or closing the curtain automatically.",
    image: "/images/12.png",
    pros: [
      "Fully autonomous",
      "Elegant motion",
      "No electronics",
      "High novelty"
    ],
    cons: [
      "High material cost",
      "Fixed activation temperature",
      "Limited force output",
      "Sourcing complexity"
    ],
    automationContext: "Advanced material-based actuation - can serve as a motor replacement for specific temperature thresholds, reducing system complexity and power requirements."
  }
];
