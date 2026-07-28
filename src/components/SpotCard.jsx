import { Utensils, Mountain, Landmark, Moon, ShoppingBag, Camera, Check, Plus, Star } from 'lucide-react';

const CATEGORY_ICONS = {
  food: Utensils,
  nature: Mountain,
  culture: Landmark,
  nightlife: Moon,
  shopping: ShoppingBag,
  landmark: Camera,
};

const CATEGORY_COLORS = {
  food: "bg-orange-100 text-orange-600",
  nature: "bg-green-100 text-green-600",
  culture: "bg-purple-100 text-purple-600",
  nightlife: "bg-indigo-100 text-indigo-600",
  shopping: "bg-pink-100 text-pink-600",
  landmark: "bg-blue-100 text-blue-600",
};

export function SpotCard({ spot, isSelected, onToggleSelect }) {
  const Icon = CATEGORY_ICONS[spot.category] || Camera;
  const catColor = CATEGORY_COLORS[spot.category] || "bg-gray-100 text-gray-600";

  return (
    <div className={`relative bg-white rounded-xl p-5 shadow-sm border transition-all ${isSelected ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/50' : 'border-[var(--color-secondary)]/10 hover:shadow-md'}`}>
      
      {spot.mustSee && (
        <div className="absolute top-4 right-4 text-[var(--color-accent)] flex items-center gap-1 bg-[var(--color-accent)]/10 px-2 py-1 rounded-full text-xs font-bold">
          <Star size={12} className="fill-current" /> Must See
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full flex-shrink-0 ${catColor}`}>
          <Icon size={20} />
        </div>
        
        <div className="flex-1 min-w-0 pr-16">
          <h3 className="font-headline font-bold text-[var(--color-secondary)] text-lg truncate">
            {spot.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${catColor}`}>
              {spot.category}
            </span>
            <span className="text-xs text-[var(--color-secondary)]/60">
              ~{spot.suggestedDurationMins} mins
            </span>
            {spot.estimatedCost !== undefined && (
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {spot.estimatedCost === 0 ? 'Free' : `₹${spot.estimatedCost}`}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-[var(--color-secondary)]/80 line-clamp-2 leading-snug">
            {spot.whyVisit}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--color-secondary)]/10 flex justify-between items-center">
        <button
          onClick={() => onToggleSelect(spot.id)}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-sm min-h-[44px] transition-colors flex-1 ${
            isSelected 
              ? 'bg-[var(--color-primary)] text-white' 
              : 'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
          }`}
        >
          {isSelected ? (
            <>
              <Check size={16} /> Added
            </>
          ) : (
            <>
              <Plus size={16} /> Add to trip
            </>
          )}
        </button>
      </div>
    </div>
  );
}
