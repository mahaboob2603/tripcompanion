import { Utensils, Check, Plus } from 'lucide-react';

export function RestaurantCard({ restaurant, isSelected, onToggleSelect }) {
  return (
    <div className={`relative bg-white rounded-xl p-4 shadow-sm border transition-all ${isSelected ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/50' : 'border-[var(--color-secondary)]/10 hover:shadow-md'}`}>
      
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-full flex-shrink-0 bg-orange-50 text-orange-600">
          <Utensils size={18} />
        </div>
        
        <div className="flex-1 min-w-0 pr-8">
          <h3 className="font-headline font-bold text-[var(--color-secondary)] text-base truncate">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 truncate">
              {restaurant.cuisine}
            </span>
            <span className="text-xs font-bold text-[var(--color-accent)]">
              {restaurant.priceHint}
            </span>
            {restaurant.estimatedCost !== undefined && (
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                ~₹{restaurant.estimatedCost} pp
              </span>
            )}
          </div>
        </div>
      </div>
      
      <p className="mt-3 text-sm text-[var(--color-secondary)]/80 line-clamp-2 leading-snug">
        {restaurant.whyRecommended}
      </p>

      <div className="mt-4 pt-3 border-t border-[var(--color-secondary)]/5 flex justify-end">
        {onToggleSelect && (
          <button
            onClick={() => onToggleSelect(restaurant.id)}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm min-h-[36px] transition-colors ${
              isSelected 
                ? 'bg-[var(--color-primary)] text-white' 
                : 'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
            }`}
          >
            {isSelected ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              <>
                <Plus size={14} /> Add
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
