#!/bin/bash

# Backup the original file
cp src/app/page.jsx src/app/page.jsx.bak

# Create the modified version
cat > src/app/page.jsx << 'EOL'
"use client";
import React from "react";
import MainComponent from '@/components/schedule/MainComponent';

// Production data - replace with your actual data
const productionData = [
  {
    date: "01.01",
    day: "Monday",
    shifts: [
      {
        time: "08:00-16:00",
        operators: {
          "Truck-1": "Driver 1",
          "Truck-2": "Driver 2"
        }
      }
    ]
  }
];

const productionOperators = ["Driver 1", "Driver 2"];

function StoryComponent() {
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

export default function Index() {
  // In production, show only the real schedule
  if (process.env.NODE_ENV === 'production') {
    return (
      <MainComponent
        weekNumber={1}
        year={2025}
        dateRange="Jan 1 - Jan 7 2025"
        initialData={productionData}
        initialOperators={productionOperators}
      />
    );
  }

  // In development, show the storybook view
  return <StoryComponent />;
}
EOL

echo "File modified successfully!"
echo "Original file saved as page.jsx.bak"
echo "Production data needs to be updated with your actual schedule data"