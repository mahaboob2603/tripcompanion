import { useState } from 'react';
import { Compass } from 'lucide-react';
import { SpotCard } from './SpotCard';
import { RestaurantCard } from './RestaurantCard';
import { BucketListTray } from './BucketListTray';
import { getBlockComponent } from '../registry/blockRegistry';

export function DiscoveryView({ plan, onBuildItinerary }) {
  const [selectedSpotIds, setSelectedSpotIds] = useState(new Set());
  const [selectedRestaurantIds, setSelectedRestaurantIds] = useState(new Set());

  const toggleSpot = (id) => {
    setSelectedSpotIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleRestaurant = (id) => {
    setSelectedRestaurantIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalSelected = selectedSpotIds.size + selectedRestaurantIds.size;

  const persons = plan.meta.persons || 1;
  const rawTotalCost = [
    ...plan.spots.filter(s => selectedSpotIds.has(s.id)),
    ...plan.restaurants.filter(r => selectedRestaurantIds.has(r.id)),
  ].reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  
  const totalCost = rawTotalCost * persons;
  const totalBudget = plan.meta.budget ? plan.meta.budget * persons : null;

  const handleBuildItinerary = () => {
    const selectedSpots = plan.spots.filter(s => selectedSpotIds.has(s.id));
    const selectedRestaurants = plan.restaurants.filter(r => selectedRestaurantIds.has(r.id));
    
    // Pass everything selected so the itinerary prompt can use them
    onBuildItinerary([...selectedSpots, ...selectedRestaurants]);
  };

  return (
    <div className="min-h-screen bg-[var(--color-neutral)] pb-32">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[var(--color-neutral)]/90 backdrop-blur-md border-b border-[var(--color-secondary)]/10 px-4 py-4 md:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--color-primary)]">
            <Compass size={24} />
            <span className="font-headline font-bold text-lg md:text-xl text-[var(--color-secondary)]">
              Trip Planner
            </span>
          </div>
          <div className="text-sm font-bold text-[var(--color-secondary)]/60 bg-[var(--color-secondary)]/5 px-3 py-1.5 rounded-full">
            {plan.meta.days} days in {plan.meta.destination}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Title & Vibes */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-headline font-bold text-[var(--color-secondary)] mb-4">
            Curated spots for {plan.meta.destination}
          </h1>
          <div className="flex flex-wrap gap-2">
            {plan.meta.vibeTags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] text-sm font-bold rounded-full uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Attractions Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-headline font-bold text-[var(--color-secondary)] mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-sm">1</span>
            Add Attractions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {plan.spots.map(spot => {
              const BlockComponent = getBlockComponent(spot.type);
              if (!BlockComponent) return null;
              return (
                <BlockComponent 
                  key={spot.id} 
                  spot={spot} 
                  isSelected={selectedSpotIds.has(spot.id)}
                  onToggleSelect={toggleSpot}
                />
              );
            })}
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-headline font-bold text-[var(--color-secondary)] mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">2</span>
            Add Food & Drink
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {plan.restaurants.map(rest => {
              const BlockComponent = getBlockComponent(rest.type);
              if (!BlockComponent) return null;
              return (
                <BlockComponent 
                  key={rest.id} 
                  restaurant={rest} 
                  isSelected={selectedRestaurantIds.has(rest.id)}
                  onToggleSelect={toggleRestaurant}
                />
              );
            })}
          </div>
        </div>

      </div>

      <BucketListTray 
        selectedCount={totalSelected}
        totalCost={totalCost}
        budget={totalBudget}
        onBuildItinerary={handleBuildItinerary} 
      />

    </div>
  );
}
