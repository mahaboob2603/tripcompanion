import { useState } from 'react';
import { Compass, ArrowRight, IndianRupee } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Hero({ onPlanTrip }) {
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [persons, setPersons] = useState('1');

  const exampleChips = [
    'Hyderabad to Goa, 4 days',
    'Weekend in Manali',
    'Backpacking Vietnam, 10 days'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-neutral)] flex flex-col items-center justify-center p-4 md:p-8">
      
      <div className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-[var(--color-neutral)]">
        <Compass size={24} />
        <span className="font-headline font-bold text-lg md:text-xl">Trip Planner</span>
      </div>

      <div className="w-full max-w-3xl flex flex-col items-center mt-12 md:mt-0 text-center">
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-[var(--color-secondary)] mb-4">
          Your Trip Planner
        </h1>
        <h2 className="text-lg md:text-xl text-[var(--color-secondary)] opacity-90 mb-10 md:mb-12">
          As good as your trip-planning friend.
        </h2>

        <div className="w-full relative shadow-lg rounded-xl mb-4">
          <textarea
            className="w-full h-32 md:h-40 p-4 md:p-6 rounded-xl border-none resize-none text-[var(--color-secondary)] placeholder-[var(--color-secondary)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)] bg-[var(--color-neutral)] text-lg"
            placeholder="Where are you going, and for how long? Describe your dream trip..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="w-full max-w-sm relative shadow-lg rounded-xl mb-4 flex items-center bg-[var(--color-neutral)] px-4">
          <IndianRupee className="text-[var(--color-secondary)]/50" />
          <input
            type="number"
            className="w-full p-4 rounded-xl border-none focus:outline-none bg-transparent text-[var(--color-secondary)] placeholder-[var(--color-secondary)]/50 text-lg font-bold"
            placeholder="Budget per person (INR)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <div className="w-full max-w-sm relative shadow-lg rounded-xl mb-8 flex items-center bg-[var(--color-neutral)] px-4">
          <span className="text-[var(--color-secondary)]/50 mr-2 font-bold">👤</span>
          <input
            type="number"
            min="1"
            className="w-full p-4 rounded-xl border-none focus:outline-none bg-transparent text-[var(--color-secondary)] placeholder-[var(--color-secondary)]/50 text-lg font-bold"
            placeholder="Number of persons"
            value={persons}
            onChange={(e) => setPersons(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {exampleChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => setDescription(chip)}
              className="px-4 py-2 rounded-full border border-[var(--color-primary)] bg-[var(--color-neutral)] text-[var(--color-secondary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors text-sm md:text-base min-h-[44px]"
            >
              {chip}
            </button>
          ))}
        </div>

        <button
          onClick={() => description.trim() && onPlanTrip(description, budget ? Number(budget) : null, persons ? Number(persons) : 1)}
          disabled={!description.trim()}
          className="group flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 md:px-12 md:py-4 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg md:text-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none min-h-[56px]"
        >
          Plan my trip
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="absolute bottom-8 left-0 right-0 hidden md:flex items-center justify-center pointer-events-none opacity-50">
        <div className="w-1/2 flex items-center justify-between text-[var(--color-tertiary)]">
          <div className="w-4 h-4 rounded-full border-2 border-current bg-white z-10" />
          <div className="flex-1 h-[2px] bg-[length:12px_2px] bg-repeat-x mx-2" style={{ backgroundImage: 'linear-gradient(to right, currentColor 50%, transparent 50%)' }} />
          <div className="w-4 h-4 rounded-full border-2 border-current bg-white z-10" />
        </div>
      </div>
    </div>
  );
}
