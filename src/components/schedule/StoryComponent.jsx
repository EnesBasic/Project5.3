// src/components/schedule/StoryComponent.jsx
import MainComponent from './MainComponent';

export function StoryComponent() {
  const mockWeeks = [
    { weekNumber: 1, year: 2025, dateRange: "Jan 1 - Jan 7 2025" },
    // ... rest of your mock data
  ];

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      {/* Your existing StoryComponent JSX */}
      <MainComponent 
        weekNumber={1}
        year={2025}
        dateRange="Jan 1 - Jan 7 2025"
        availableWeeks={mockWeeks}
        // ... other props
      />
      {/* Other states */}
    </div>
  );
}