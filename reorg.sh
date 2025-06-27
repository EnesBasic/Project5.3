#!/bin/bash

# 1. Create the new directory structure
mkdir -p src/components/schedule

# 2. Create MainComponent.jsx with basic implementation
cat > src/components/schedule/MainComponent.jsx << 'EOL'
export default function MainComponent({
  weekNumber = 1,
  year = 2025,
  dateRange = "",
  availableWeeks = [],
  initialOperators = [],
  initialData = [],
  isLoading = false,
  error = null
}) {
  // Your main schedule component implementation
  return (
    <div className="schedule-container">
      <h2>Week {weekNumber}, {year}</h2>
      <p>{dateRange}</p>
      {/* Add your schedule rendering logic here */}
    </div>
  );
}
EOL

# 3. Create StoryComponent.jsx with your demo cases
cat > src/components/schedule/StoryComponent.jsx << 'EOL'
import MainComponent from './MainComponent';

export function StoryComponent() {
  const mockWeeks = [
    { weekNumber: 1, year: 2025, dateRange: "Jan 1 - Jan 7 2025" },
    { weekNumber: 2, year: 2025, dateRange: "Jan 8 - Jan 14 2025" },
    { weekNumber: 3, year: 2025, dateRange: "Jan 15 - Jan 21 2025" },
  ];

  const mockOperators = ["Adis", "Munib", "Sanin", "Farik", "Harun", "Almedin", "Enes"];

  const mockData = [
    {
      date: "01.01",
      day: "P",
      shifts: [
        {
          time: "08.00-16.00",
          operators: {
            "M58-J-467": "Adis",
            "M53-E-929": "Munib",
            "A35-J-924": "",
          },
        },
        {
          time: "21.00-05.00",
          operators: {
            "M58-J-467": "",
            "M53-E-929": "Sanin",
            "A35-J-924": "",
          },
        },
      ],
    },
  ];

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Schedule Component</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Default State</h2>
        <MainComponent
          weekNumber={1}
          year={2025}
          dateRange="Jan 1 - Jan 7 2025"
          availableWeeks={mockWeeks}
          initialOperators={mockOperators}
          initialData={mockData}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Loading State</h2>
        <MainComponent isLoading={true} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Error State</h2>
        <MainComponent error="Failed to load schedule data. Please try again later." />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Empty State</h2>
        <MainComponent
          weekNumber={2}
          year={2025}
          dateRange="Jan 8 - Jan 14 2025"
          availableWeeks={mockWeeks}
          initialOperators={[]}
          initialData={[]}
        />
      </div>
    </div>
  );
}
EOL

# 4. Create the index.js export file
cat > src/components/schedule/index.js << 'EOL'
export { default as MainComponent } from './MainComponent';
export { StoryComponent } from './StoryComponent';
EOL

# 5. Update your main page.jsx (backup existing first)
mv src/app/page.jsx src/app/page.jsx.bak
cat > src/app/page.jsx << 'EOL'
'use client';

import { MainComponent } from '@/components/schedule';

export default function SchedulePage() {
  return (
    <main className="container mx-auto p-4">
      <MainComponent 
        weekNumber={1}
        year={2025}
        dateRange="Jan 1 - Jan 7 2025"
      />
    </main>
  );
}
EOL

echo "Reorganization complete! Your components are now properly structured in:"
echo "src/components/schedule/"
echo "Main page updated at src/app/page.jsx (original backed up as page.jsx.bak)"