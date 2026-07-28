export const DISCOVERY_FIXTURE = {
  "meta": {
    "origin": "Paris",
    "destination": "London",
    "days": 3,
    "vibeTags": ["historic", "royal", "culture"]
  },
  "spots": [
    {
      "type": "spot",
      "id": "tower-of-london",
      "name": "Tower of London",
      "category": "historic",
      "whyVisit": "Discover the crown jewels and the dark history of this medieval castle.",
      "suggestedDurationMins": 180,
      "mustSee": true,
      "estimatedCost": 3500
    },
    {
      "type": "spot",
      "id": "british-museum",
      "name": "British Museum",
      "category": "culture",
      "whyVisit": "Explore a vast collection of world art and artifacts, including the Rosetta Stone.",
      "suggestedDurationMins": 240,
      "mustSee": true,
      "estimatedCost": 0
    },
    {
      "type": "spot",
      "id": "borough-market",
      "name": "Borough Market",
      "category": "food",
      "whyVisit": "One of the largest and oldest food markets in London.",
      "suggestedDurationMins": 90,
      "mustSee": false,
      "estimatedCost": 0
    },
    {
      "type": "spot",
      "id": "hyde-park",
      "name": "Hyde Park",
      "category": "nature",
      "whyVisit": "A huge royal park perfect for a relaxing afternoon stroll.",
      "suggestedDurationMins": 120,
      "mustSee": false,
      "estimatedCost": 0
    }
  ],
  "restaurants": [
    {
      "type": "restaurant",
      "id": "dishoom-covent-garden",
      "name": "Dishoom Covent Garden",
      "cuisine": "Indian",
      "priceHint": "₹₹",
      "whyRecommended": "Famous Bombay-style cafe with incredible atmosphere and food.",
      "nearStopId": "british-museum",
      "estimatedCost": 3000
    },
    {
      "type": "restaurant",
      "id": "padella",
      "name": "Padella",
      "cuisine": "Italian",
      "priceHint": "₹",
      "whyRecommended": "Incredible fresh pasta located right by Borough Market.",
      "nearStopId": "borough-market",
      "estimatedCost": 2000
    }
  ]
};

export const ITINERARY_FIXTURE = {
  "days": [
    {
      "day": 1,
      "title": "History & Markets",
      "stopIds": ["tower-of-london", "borough-market", "padella"]
    },
    {
      "day": 2,
      "title": "Culture & Parks",
      "stopIds": ["british-museum", "dishoom-covent-garden", "hyde-park"]
    }
  ]
};
