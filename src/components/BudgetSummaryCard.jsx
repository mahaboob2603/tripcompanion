import { IndianRupee, TrendingDown, TrendingUp, Landmark, Utensils } from 'lucide-react';

export function BudgetSummaryCard({ selectedSpots, meta }) {
  const attractionCost = selectedSpots
    .filter(s => s.type === 'spot')
    .reduce((sum, s) => sum + (s.estimatedCost || 0), 0);

  const foodCost = selectedSpots
    .filter(s => s.type === 'restaurant')
    .reduce((sum, s) => sum + (s.estimatedCost || 0), 0);

  const persons = meta.persons || 1;
  const totalCost = (attractionCost + foodCost) * persons;
  const budget = meta.budget ? meta.budget * persons : null;
  const remaining = budget !== null ? budget - totalCost : null;
  const overBudget = remaining !== null && remaining < 0;

  const rows = [
    { label: 'Attractions', value: attractionCost * persons, icon: Landmark, color: 'text-blue-600' },
    { label: 'Food & Drink', value: foodCost * persons, icon: Utensils, color: 'text-orange-600' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-secondary)]/10 mb-10">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-full bg-green-50 text-green-600">
          <IndianRupee size={20} />
        </div>
        <h3 className="font-headline font-bold text-xl text-[var(--color-secondary)]">
          Budget Summary
        </h3>
      </div>

      <div className="space-y-3">
        {rows.map(row => (
          <div key={row.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <row.icon size={16} className={row.color} />
              <span className="text-sm font-bold text-[var(--color-secondary)]/70">{row.label}</span>
            </div>
            <span className="font-headline font-bold text-[var(--color-secondary)]">
              ₹{row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--color-secondary)]/10">
        <div className="flex items-center justify-between">
          <span className="font-headline font-bold text-lg text-[var(--color-secondary)]">Total <span className="text-sm font-normal opacity-70">(for {persons} person{persons > 1 ? 's' : ''})</span></span>
          <span className="font-headline font-bold text-2xl text-[var(--color-secondary)]">₹{totalCost}</span>
        </div>

        {budget && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-[var(--color-secondary)]/60 font-bold">Budget (₹{meta.budget}/person)</span>
              <span className="text-sm font-bold text-[var(--color-secondary)]/60">₹{budget}</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${overBudget ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min((totalCost / budget) * 100, 100)}%` }}
              />
            </div>
            <div className={`flex items-center gap-1 mt-2 text-sm font-bold ${overBudget ? 'text-red-500' : 'text-green-600'}`}>
              {overBudget ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {overBudget 
                ? `₹${Math.abs(remaining)} over budget` 
                : `₹${remaining} remaining`
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
