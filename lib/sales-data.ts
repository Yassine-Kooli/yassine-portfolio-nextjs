// ILLUSTRATIVE SAMPLE DATA. Not figures from any employer or client.
// Used only to demonstrate the BI dashboard design. Values are in thousands of USD.
// Internal totals are consistent: sum(monthly revenue) = sum(regions) = sum(product mix).

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export const monthly = {
  revenue: [212, 228, 241, 236, 259, 271, 268, 290, 305, 298, 321, 344],
  target: [230, 230, 240, 250, 255, 265, 275, 285, 295, 305, 315, 330],
  orders: [1040, 1102, 1168, 1131, 1240, 1296, 1265, 1371, 1420, 1388, 1502, 1575],
} as const;

export const regions = [
  { name: "North", revenue: 1020 },
  { name: "Coast", revenue: 842 },
  { name: "Centre", revenue: 611 },
  { name: "South", revenue: 438 },
  { name: "Abroad", revenue: 362 },
] as const;

export const productMix = [
  { name: "Subscriptions", revenue: 1450 },
  { name: "Services", revenue: 890 },
  { name: "Licences", revenue: 510 },
  { name: "Support", revenue: 423 },
] as const;

export const pipeline = [
  { stage: "Leads", count: 1240 },
  { stage: "Qualified", count: 610 },
  { stage: "Proposal", count: 232 },
  { stage: "Negotiation", count: 96 },
  { stage: "Won", count: 41 },
] as const;
