/**
 * Block Registry — maps block `type` strings to React components.
 *
 * Architecture note: Adding a new block type (e.g. "weather", "budget")
 * is a one-line registration here + the component file. Nothing else
 * in the app needs to change — DiscoveryView and ItineraryView both
 * resolve renderers through this registry.
 */

import { SpotCard } from '../components/SpotCard';
import { RestaurantCard } from '../components/RestaurantCard';
import { DetourCard } from '../components/DetourCard';
import { BudgetSummaryCard } from '../components/BudgetSummaryCard';

const blockRegistry = {
  spot: SpotCard,
  restaurant: RestaurantCard,
  detour: DetourCard,
  budget: BudgetSummaryCard,
  // To add a new block type, just register it here:
  // weather: WeatherCard,
};

/**
 * Look up the component for a given block type.
 * Returns null if the type is unknown (defensive — won't crash the app).
 */
export function getBlockComponent(type) {
  return blockRegistry[type] || null;
}

/**
 * Register a new block type at runtime (useful for plugins/extensions).
 */
export function registerBlock(type, component) {
  blockRegistry[type] = component;
}

export default blockRegistry;
