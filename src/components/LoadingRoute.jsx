import { useState, useEffect } from 'react';
import { Plane, MapPin } from 'lucide-react';

export function LoadingRoute() {
  const messages = [
    'Scouting neighborhoods...',
    'Checking opening hours...',
    'Finding hidden gems...',
    'Packing your itinerary...',
  ];

  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="min-h-screen bg-[var(--color-neutral)] flex flex-col items-center justify-center p-4 md:p-8">
      
      <div className="w-full max-w-lg relative flex flex-col items-center py-20">
        
        {/* Animated route visualization */}
        <div className="relative w-full h-32 flex items-center justify-between px-8 md:px-12">
          
          {/* Start Pin */}
          <div className="flex flex-col items-center z-10 text-[var(--color-primary)]">
            <MapPin size={32} className="fill-[var(--color-neutral)]" />
            <span className="font-headline font-bold mt-2 text-[var(--color-secondary)]">Start</span>
          </div>

          {/* Dashed line track */}
          <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 overflow-hidden h-[4px]">
            <div className="w-full h-full bg-[length:16px_4px] bg-repeat-x" style={{ backgroundImage: 'linear-gradient(to right, var(--color-tertiary) 50%, transparent 50%)' }} />
          </div>
          
          {/* Plane traveling */}
          <div className="absolute left-16 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[var(--color-primary)] animate-[fly_4s_ease-in-out_infinite_alternate]">
            <Plane size={28} className="fill-current -rotate-45 drop-shadow-md" />
          </div>

          {/* End Pin */}
          <div className="flex flex-col items-center z-10 text-[var(--color-primary)]">
            <MapPin size={32} className="fill-[var(--color-neutral)]" />
            <span className="font-headline font-bold mt-2 text-[var(--color-secondary)]">Dest</span>
          </div>
          
        </div>

        {/* Status text */}
        <div className="mt-12 h-8 relative w-full overflow-hidden flex justify-center">
          <p 
            key={msgIndex}
            className="text-xl md:text-2xl font-headline text-[var(--color-secondary)] animate-[fade-in-up_0.5s_ease-out_forwards]"
          >
            {messages[msgIndex]}
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-16 w-48 h-1 bg-[var(--color-secondary)]/10 rounded-full overflow-hidden">
          <div className="h-full bg-[var(--color-primary)] rounded-full animate-[progress_15s_ease-out_forwards]" />
        </div>

      </div>

    </div>
  );
}
