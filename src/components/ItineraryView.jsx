import { useState } from 'react';
import { Compass, Calendar, Edit3, X, Check, Loader2, Share2 } from 'lucide-react';
import { TimelineBlock } from './TimelineBlock';
import { BudgetSummaryCard } from './BudgetSummaryCard';
import { refineDayPlan } from '../api/tripApi';

export function ItineraryView({ itinerary, selectedSpots, meta, onUpdateItinerary }) {
  const spotMap = new Map(selectedSpots.map(s => [s.id, s]));

  const [editingDay, setEditingDay] = useState(null); // day index
  const [instruction, setInstruction] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState(null);

  const [isSharing, setIsSharing] = useState(false);
  const [shareText, setShareText] = useState('Share Trip');

  const handleShare = async () => {
    setIsSharing(true);
    try {
      // Encode the trip data directly into the URL (no database needed)
      const tripData = { itinerary, selectedSpots, meta };
      const jsonStr = JSON.stringify(tripData);
      
      // Compress using built-in CompressionStream
      const blob = new Blob([jsonStr]);
      const cs = new CompressionStream('gzip');
      const compressedStream = blob.stream().pipeThrough(cs);
      const compressedBlob = await new Response(compressedStream).blob();
      const buffer = await compressedBlob.arrayBuffer();
      
      // Convert to base64url (URL-safe base64)
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      
      const url = `${window.location.origin}/?trip=${base64}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(url);
      setShareText('Copied Link!');
      setTimeout(() => setShareText('Share Trip'), 3000);
    } catch (err) {
      console.error(err);
      setShareText('Failed');
      setTimeout(() => setShareText('Share Trip'), 3000);
    } finally {
      setIsSharing(false);
    }
  };

  const handleRefineSubmit = async (dayIdx) => {
    if (!instruction.trim()) return;
    
    setIsRefining(true);
    setError(null);
    try {
      const controller = new AbortController();
      const updatedDay = await refineDayPlan(
        itinerary.days[dayIdx],
        instruction,
        selectedSpots,
        controller.signal
      );
      
      const newDays = [...itinerary.days];
      newDays[dayIdx] = { ...newDays[dayIdx], title: updatedDay.title, stopIds: updatedDay.stopIds };
      
      onUpdateItinerary({ ...itinerary, days: newDays });
      setEditingDay(null);
      setInstruction('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-neutral)] pb-32">
      <div className="sticky top-0 z-40 bg-[var(--color-neutral)]/90 backdrop-blur-md border-b border-[var(--color-secondary)]/10 px-4 py-4 md:px-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--color-primary)]">
            <Compass size={24} />
            <span className="font-headline font-bold text-lg md:text-xl text-[var(--color-secondary)]">
              Trip Planner
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="flex items-center gap-2 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold text-sm px-4 py-1.5 rounded-full transition-colors"
            >
              {isSharing ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
              {shareText}
            </button>
            <div className="text-sm font-bold text-[var(--color-secondary)]/60 flex items-center gap-1.5 bg-[var(--color-secondary)]/5 px-3 py-1.5 rounded-full">
              <Calendar size={14} />
              {meta.days} Day Itinerary
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-headline font-bold text-[var(--color-secondary)] mb-4">
            Your {meta.destination} Itinerary
          </h1>
          <p className="text-lg text-[var(--color-secondary)]/70 max-w-xl mx-auto">
            We've organized your selected spots into a logical route. Feel free to explore detours or refine your days.
          </p>
        </div>

        <BudgetSummaryCard selectedSpots={selectedSpots} meta={meta} />

        <div className="space-y-12">
          {itinerary.days.map((dayPlan, dayIdx) => (
            <div key={dayIdx} className="relative">
              
              <div className="sticky top-20 z-30 bg-[var(--color-neutral)] py-2 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-2xl font-headline font-bold text-[var(--color-primary)]">
                      Day {dayPlan.day}
                    </h2>
                    <span className="text-lg font-headline font-bold text-[var(--color-secondary)]/80">
                      {dayPlan.title}
                    </span>
                  </div>
                  
                  {editingDay !== dayIdx && (
                    <button 
                      onClick={() => { setEditingDay(dayIdx); setError(null); }}
                      className="text-sm flex items-center gap-1.5 text-[var(--color-secondary)]/60 hover:text-[var(--color-primary)] transition-colors"
                    >
                      <Edit3 size={16} /> Edit Day
                    </button>
                  )}
                </div>

                {editingDay === dayIdx && (
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                    <label className="block text-sm font-bold text-orange-800 mb-2">
                      Refine this day
                    </label>
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        type="text"
                        placeholder="e.g. 'Make it less packed' or 'Swap the park for the museum'"
                        className="flex-1 bg-white border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        value={instruction}
                        onChange={e => setInstruction(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleRefineSubmit(dayIdx)}
                        disabled={isRefining}
                      />
                      <button
                        onClick={() => handleRefineSubmit(dayIdx)}
                        disabled={isRefining || !instruction.trim()}
                        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                      >
                        {isRefining ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        Save
                      </button>
                      <button
                        onClick={() => { setEditingDay(null); setInstruction(''); }}
                        disabled={isRefining}
                        className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                  </div>
                )}
                
                <div className="h-px bg-[var(--color-secondary)]/10 w-full mt-3" />
              </div>

              <div>
                {dayPlan.stopIds.map((stopId, index) => {
                  const spot = spotMap.get(stopId);
                  if (!spot) return null;
                  
                  const nextStopId = dayPlan.stopIds[index + 1];
                  const nextSpot = nextStopId ? spotMap.get(nextStopId) : null;

                  return (
                    <TimelineBlock
                      key={`${dayPlan.day}-${index}-${stopId}`}
                      spot={spot}
                      index={index}
                      total={dayPlan.stopIds.length}
                      nextSpot={nextSpot}
                      meta={meta}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
