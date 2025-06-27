// src/app/page.jsx
'use client'; // Required since you're using hooks

import { MainComponent, StoryComponent } from '@/components/schedule';

export default function SchedulePage() {
  return (
    <main>
      {/* Use either the main component or story component */}
      <MainComponent 
        weekNumber={1}
        year={2025}
        // ... other props
      />
      
      {/* OR if you want the demo view */}
      <StoryComponent />
    </main>
  );
}