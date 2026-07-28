import { z } from "zod";

export const TripMetaSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  days: z.number(),
  vibeTags: z.array(z.string()),
  budget: z.number().optional(),
  persons: z.number().optional().default(1),
});

export const SpotBlockSchema = z.object({
  type: z.literal("spot"),
  id: z.string(),
  name: z.string(),
  category: z.enum(["food", "nature", "culture", "nightlife", "shopping", "landmark"]),
  whyVisit: z.string(),
  suggestedDurationMins: z.number(),
  mustSee: z.boolean(),
  estimatedCost: z.number(),
});

export const RestaurantBlockSchema = z.object({
  type: z.literal("restaurant"),
  id: z.string(),
  name: z.string(),
  cuisine: z.string(),
  priceHint: z.enum(["₹", "₹₹", "₹₹₹"]),
  whyRecommended: z.string(),
  nearStopId: z.string().nullable(),
  estimatedCost: z.number(),
});

export const DetourBlockSchema = z.object({
  type: z.literal("detour"),
  id: z.string(),
  name: z.string(),
  betweenStopIds: z.tuple([z.string(), z.string()]),
  extraMinutes: z.number(),
  reason: z.string(),
});

export const DayPlanSchema = z.object({
  day: z.number(),
  title: z.string(),
  stopIds: z.array(z.string()),
});

export const TripPlanResponseSchema = z.object({
  meta: TripMetaSchema,
  spots: z.array(SpotBlockSchema),
  restaurants: z.array(RestaurantBlockSchema),
});

export const ItineraryResponseSchema = z.object({
  days: z.array(DayPlanSchema),
});

export const GapFillResponseSchema = z.object({
  detours: z.array(DetourBlockSchema),
});
