import { useState } from 'react';
import { Camera, Utensils, Mountain, Landmark, Moon, ShoppingBag, ArrowRight } from 'lucide-react';
import { findDetours } from '../api/tripApi';

const CATEGORY_ICONS = {
  food: Utensils,
  nature: Mountain,
  culture: Landmark,
  nightlife: Moon,
  shopping: ShoppingBag,
  landmark: Camera,
  restaurant: Utensils,
};

const CATEGORY_COLORS = {
  food: "bg-orange-100 text-orange-600",
  nature: "bg-green-100 text-green-600",
  culture: "bg-purple-100 text-purple-600",
  nightlife: "bg-indigo-100 text-indigo-600",
  shopping: "bg-pink-100 text-pink-600",
  landmark: "bg-blue-100 text-blue-600",
  restaurant: "bg-orange-50 text-orange-600",
};

export function TimelineBlock({ spot, index, total, nextSpot, meta, onAddDetour }) {
  const [detours, setDetours] = useState([]);
  const [isLoadingDetours, setIsLoadingDetours] = useState(false);
  const [detourError, setDetourError] = useState(false);

  const isLast = index === total - 1;
  const Icon = CATEGORY_ICONS[spot.category || spot.type] || Camera;
  const catColor = CATEGORY_COLORS[spot.category || spot.type] || "bg-gray-100 text-gray-600";

  const handleSuggestDetour = async () => {
    if (!nextSpot || isLoadingDetours) return;
    setIsLoadingDetours(true);
    setDetourError(false);
    try {
      const controller = new AbortController();
      const res = await findDetours(meta, spot, nextSpot, controller.signal);
      if (res.detours && res.detours.length > 0) {
        setDetours(res.detours);
      } else {
        // No detours found
        setDetourError(true); 
      }
    } catch (err) {
      setDetourError(true);
    } finally {
      setIsLoadingDetours(false);
    }
  };

  return (
    <div className="relative pl-8 md:pl-12 pb-8">
      
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[15px] md:left-[23px] top-10 bottom-0 w-0.5 bg-[var(--color-secondary)]/10" />
      )}

      {/* Timeline dot/icon */}
      <div className={`absolute left-0 md:left-2 top-2 w-8 h-8 rounded-full border-4 border-white ${catColor} flex items-center justify-center z-10 shadow-sm`}>
        <Icon size={14} />
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-[var(--color-secondary)]/10">
        <h3 className="font-headline font-bold text-[var(--color-secondary)] text-lg">
          {spot.name}
        </h3>
        {spot.type === 'restaurant' && (
          <div className="flex items-center gap-2 mt-1 mb-2">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
              {spot.cuisine}
            </span>
            <span className="text-xs font-bold text-[var(--color-accent)]">
              {spot.priceHint}
            </span>
          </div>
        )}
        <p className="mt-2 text-sm text-[var(--color-secondary)]/80 leading-relaxed">
          {spot.whyVisit || spot.whyRecommended}
        </p>
      </div>

      {/* Detour Suggestion Area */}
      {!isLast && nextSpot && (
        <div className="mt-4 mb-2 ml-4">
          {detours.length > 0 ? (
            <div className="space-y-3">
              {detours.map(detour => (
                <div key={detour.id} className="bg-[var(--color-tertiary)]/10 rounded-lg p-3 border border-[var(--color-tertiary)]/20 relative overflow-hidden">
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-[var(--color-tertiary)]" />
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-tertiary)]">Detour</span>
                        <h4 className="font-headline font-bold text-[var(--color-secondary)]">{detour.name}</h4>
                        <span className="text-xs bg-white/50 px-1.5 py-0.5 rounded text-[var(--color-secondary)]/70">
                          +{detour.extraMinutes}m
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-secondary)]/80 mt-1">{detour.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <button 
              onClick={handleSuggestDetour}
              disabled={isLoadingDetours}
              className="text-xs font-bold text-[var(--color-secondary)]/50 hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-[var(--color-secondary)]/10 shadow-sm"
            >
              {isLoadingDetours ? (
                <span className="animate-pulse">Finding a quick stop...</span>
              ) : detourError ? (
                <span>No good stops here. Try another gap.</span>
              ) : (
                <>Suggest a quick stop on the way <ArrowRight size={12} /></>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
