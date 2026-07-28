import { ArrowRight, IndianRupee } from 'lucide-react';

export function BucketListTray({ selectedCount, totalCost, budget, onBuildItinerary }) {
  if (selectedCount === 0) return null;

  const overBudget = budget && totalCost > budget;
  const budgetPercent = budget ? Math.min((totalCost / budget) * 100, 100) : null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-[fade-in-up_0.3s_ease-out_forwards]">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border border-[var(--color-secondary)]/10 p-4">
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[var(--color-secondary)]/60 uppercase tracking-wider">
              Your Bucket List
            </span>
            <span className="font-headline font-bold text-xl text-[var(--color-secondary)]">
              {selectedCount} spot{selectedCount !== 1 ? 's' : ''} added
            </span>
          </div>

          <div className="flex items-center gap-4">
            {totalCost > 0 && (
              <div className="flex items-center gap-1.5">
                <IndianRupee size={16} className={overBudget ? 'text-red-500' : 'text-green-600'} />
                <span className={`font-headline font-bold text-lg ${overBudget ? 'text-red-500' : 'text-green-600'}`}>
                  {totalCost}
                </span>
                {budget && (
                  <span className="text-sm text-[var(--color-secondary)]/50 font-bold">
                    / ₹{budget}
                  </span>
                )}
              </div>
            )}

            <button
              onClick={onBuildItinerary}
              className="group flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--color-primary)] text-white font-bold text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all min-h-[48px]"
            >
              Build my itinerary
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {budget && (
          <div className="mt-3">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${overBudget ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
            {overBudget && (
              <p className="text-xs text-red-500 font-bold mt-1">
                Over budget by ₹{totalCost - budget}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
