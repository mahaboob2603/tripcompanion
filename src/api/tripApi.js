import { DISCOVERY_FIXTURE, ITINERARY_FIXTURE } from '../fixtures/londonTrip';

const shouldUseFixtures = () => {
  try { return localStorage.getItem('USE_FIXTURES') === 'true'; } 
  catch (e) { return false; }
};

export async function discoverTrip(freeform, budget, persons, signal) {
  if (shouldUseFixtures()) {
    return new Promise(resolve => setTimeout(() => resolve(DISCOVERY_FIXTURE), 800));
  }

  const res = await fetch("/api/discover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ freeform, budget, persons }),
    signal,
  });
  
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw Object.assign(new Error(`Fetch failed: ${res.status} ${text}`), { status: res.status });
  }
  return res.json();
}

export async function buildItinerary(meta, selectedSpots, signal) {
  if (shouldUseFixtures()) {
    return new Promise(resolve => setTimeout(() => resolve(ITINERARY_FIXTURE), 800));
  }

  const res = await fetch("/api/itinerary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meta, selectedSpots }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw Object.assign(new Error(`Fetch failed: ${res.status} ${text}`), { status: res.status });
  }
  return res.json();
}

export async function findDetours(meta, stop1, stop2, signal) {
  if (shouldUseFixtures()) {
    return new Promise(resolve => setTimeout(() => resolve({
      detours: [{
        type: "detour",
        id: "fixture-detour",
        name: "Mock Detour Cafe",
        extraMinutes: 15,
        reason: "A lovely spot for coffee on the way."
      }]
    }), 500));
  }

  const res = await fetch("/api/gapfill", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meta, stop1, stop2 }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw Object.assign(new Error(`Fetch failed: ${res.status} ${text}`), { status: res.status });
  }
  return res.json();
}

export async function refineDayPlan(dayPlan, instruction, availableStops, signal) {
  if (shouldUseFixtures()) {
    // Just mock a modified plan by reversing the stops
    return new Promise(resolve => setTimeout(() => resolve({
      title: "Modified: " + dayPlan.title,
      stopIds: [...dayPlan.stopIds].reverse()
    }), 800));
  }

  const res = await fetch("/api/refine", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dayPlan, instruction, availableStops }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw Object.assign(new Error(`Fetch failed: ${res.status} ${text}`), { status: res.status });
  }
  return res.json();
}

export async function saveTrip(itinerary, selectedSpots, meta) {
  const res = await fetch("/api/trips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itinerary, selectedSpots, meta }),
  });
  
  if (!res.ok) throw new Error("Failed to save trip");
  return res.json();
}

export async function loadTrip(id) {
  const res = await fetch(`/api/trips/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Trip not found");
    throw new Error("Failed to load trip");
  }
  return res.json();
}
