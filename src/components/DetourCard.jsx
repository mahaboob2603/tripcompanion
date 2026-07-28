import { MapPin, Plus, Check } from 'lucide-react';

export function DetourCard({ detour, onAddDetour, isAdded }) {
  return (
    <div className={`p-4 border-l-4 rounded-r-xl bg-[var(--color-neutral)] shadow-sm transition-all duration-300 ${
      isAdded 
        ? 'border-emerald-500 bg-emerald-50/30' 
        : 'border-[var(--color-primary)] hover:border-[var(--color-primary)]/70 hover:-translate-y-1 hover:shadow-md'
    }`}>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider rounded-md">
              Detour
            </span>
            <span className="text-xs font-medium text-[var(--color-secondary)]/60 bg-[var(--color-neutral-dark)] px-2 py-0.5 rounded-md">
              +{detour.extraMinutes} mins
            </span>
          </div>
          
          <h4 className="font-headline font-bold text-lg text-[var(--color-secondary)] mb-1 flex items-center gap-2">
            <MapPin size={16} className="text-[var(--color-primary)]" />
            {detour.name}
          </h4>
          
          <p className="text-sm text-[var(--color-secondary)]/70">
            {detour.reason}
          </p>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => onAddDetour(detour)}
            disabled={isAdded}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isAdded 
                ? 'bg-emerald-500 text-white cursor-default' 
                : 'bg-[var(--color-neutral-dark)] hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-secondary)]'
            }`}
          >
            {isAdded ? <Check size={20} /> : <Plus size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
