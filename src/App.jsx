import { useState, useRef, useEffect } from 'react';
import { Hero } from './components/Hero';
import { LoadingRoute } from './components/LoadingRoute';
import { ErrorState } from './components/ErrorState';
import { DiscoveryView } from './components/DiscoveryView';
import { ItineraryView } from './components/ItineraryView';
import { useAsyncRequest } from './hooks/useAsyncRequest';
import { discoverTrip, buildItinerary } from './api/tripApi';

export default function App() {
  const [view, setView] = useState('hero'); // hero | discover | itinerary
  
  const [tripPlan, setTripPlan] = useState(null); // The raw output from discover
  const [itinerary, setItinerary] = useState(null); // The raw output from itinerary
  const [selectedSpots, setSelectedSpots] = useState([]); // Array of full spot/restaurant objects

  const discoverReq = useAsyncRequest();
  const itineraryReq = useAsyncRequest();
  const loadReq = useAsyncRequest();
  
  // Store the last description to allow retry
  const lastDescRef = useRef('');
  const lastBudgetRef = useRef(null);
  const lastPersonsRef = useRef(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tripParam = params.get('trip');
    
    if (tripParam) {
      setView('itinerary');
      loadReq.run(async () => {
        // Decode base64url back to base64
        let base64 = tripParam.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        
        // Convert base64 to binary
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        
        // Decompress gzip
        const ds = new DecompressionStream('gzip');
        const decompressedStream = new Blob([bytes]).stream().pipeThrough(ds);
        const decompressedText = await new Response(decompressedStream).text();
        
        const data = JSON.parse(decompressedText);
        setTripPlan({ meta: data.meta, spots: [], restaurants: [] });
        setSelectedSpots(data.selectedSpots);
        setItinerary(data.itinerary);
        return data;
      });
    }
  }, []);

  const handlePlanTrip = async (description, budget, persons = 1) => {
    lastDescRef.current = description;
    lastBudgetRef.current = budget;
    lastPersonsRef.current = persons;
    setView('discover');
    
    await discoverReq.run(async (signal) => {
      const data = await discoverTrip(description, budget, persons, signal);
      setTripPlan(data);
      return data;
    });
  };

  const handleBuildItinerary = async (spots) => {
    setSelectedSpots(spots);
    setView('itinerary');
    
    await itineraryReq.run(async (signal) => {
      const data = await buildItinerary(tripPlan.meta, spots, signal);
      setItinerary(data);
      return data;
    });
  };

  const handleReset = () => {
    setView('hero');
    setTripPlan(null);
    setItinerary(null);
    setSelectedSpots([]);
  };

  // Render logic based on view and request states
  if (view === 'hero') {
    return <Hero onPlanTrip={handlePlanTrip} />;
  }

  if (view === 'discover') {
    if (discoverReq.status === 'loading') return <LoadingRoute />;
    if (discoverReq.status === 'error') {
      return (
        <ErrorState 
          error={discoverReq.error} 
          onRetry={() => handlePlanTrip(lastDescRef.current, lastBudgetRef.current, lastPersonsRef.current)} 
          onReset={handleReset} 
        />
      );
    }
    if (discoverReq.status === 'success' && tripPlan) {
      return (
        <DiscoveryView 
          plan={tripPlan} 
          onBuildItinerary={handleBuildItinerary} 
        />
      );
    }
  }

  if (view === 'itinerary') {
    if (itineraryReq.status === 'loading' || loadReq.status === 'loading') return <LoadingRoute />;
    if (itineraryReq.status === 'error' || loadReq.status === 'error') {
      return (
        <ErrorState 
          error={itineraryReq.error || loadReq.error} 
          onRetry={() => {
            // Reset URL on failure
            window.history.pushState({}, '', '/');
            handleReset();
          }} 
          onReset={() => {
            window.history.pushState({}, '', '/');
            handleReset();
          }} 
        />
      );
    }
    if ((itineraryReq.status === 'success' || loadReq.status === 'success') && itinerary) {
      return (
        <ItineraryView 
          itinerary={itinerary}
          selectedSpots={selectedSpots}
          meta={tripPlan.meta}
          onUpdateItinerary={setItinerary}
        />
      );
    }
  }

  return <LoadingRoute />;
}
