<!-- prettier-ignore -->
<div align="center">
  <img src="public/favicon.svg" width="96" alt="TripCompanion logo">
  
  # TripCompanion
  *A smart, AI-powered trip planning tool that turns a free-form description of a trip into an interactive day-by-day itinerary.*
  
  [![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)](#)
  [![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Express js](https://img.shields.io/badge/Express%20js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
  [![Groq](https://img.shields.io/badge/Groq-000000?style=flat-square&logo=groq&logoColor=white)](https://groq.com/)

  ⭐ If you like this project, star it on GitHub!

  [Features](#features) • [Getting started](#getting-started) • [How it works](#how-it-works)

</div>

A lightweight but powerful full-stack application that leverages the ultra-low latency of the **Groq API** and **Llama 3** to build personalized travel itineraries. Describe your dream vacation in plain English, curate a budget-aware bucket list, and let the AI organize your days and suggest smart detours on the fly.

## Features

- **Free-text to Itinerary** - Describe a trip in free text, and our AI fetches structured spots and restaurants.
- **Smart Bucket List** - Build a bucket list of spots you want to visit and dynamically track budget limits per person.
- **AI Itinerary Builder** - Automatically arrange your bucket list into a logical day-by-day itinerary.
- **Smart Detours** - Suggests worthwhile "on the way" detours between consecutive stops (e.g., a hidden tea shop between two planned spots).
- **Shareable Trips** - Instantly generate a link to share your finalized itinerary with friends.

## Getting started

You need to install [Node.js](https://nodejs.org/) to run this project on your local machine.

```bash
# Clone the repository
git clone https://github.com/mahaboob2603/tripcompanion.git
cd tripcompanion

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Add your Groq API key (from console.groq.com) to .env

# Start the application
npm start
```
*Note: `npm start` concurrently runs the Vite dev server and the Express proxy holding the API key. Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.*

## How it works

1. **Discovery Phase**: You describe your dream trip. Groq processes this and returns a structured JSON (spots and restaurants), strictly validated using Zod.
2. **Selection Phase**: You select your favorite spots, creating a bucket list. The app tracks the total estimated cost per person against the budget.
3. **Planning Phase**: A secondary AI call logically arranges the selected spots into a daily itinerary.
4. **Refinement Phase**: A highly targeted AI call checks each consecutive pair of stops for a worthwhile detour and suggests one if it fits.

> [!NOTE]  
> **AI Usage Note**
> I used an AI coding assistant (Gemini 3.1 Pro) to scaffold the initial React components, implement the Express proxy, and debug the budget-per-person calculations. I manually fine-tuned the Groq system prompts for strict Zod schema adherence and crafted the overall UX. The actual trip generation relies entirely on Llama 3 (via Groq) due to its extremely low latency. (Estimated time spent: ~8.5 hours).

> [!WARNING]  
> **Known Limitations**
> Detour suggestions rely on the LLM's general semantic knowledge and are not cross-checked against a live routing API (like Google Maps or Mapbox). Travel times and distances are approximate. Also, generated itineraries are currently saved to a local `.json` file (`trips.json`) instead of a robust database. Reloading the page during the discovery phase resets the trip state.
