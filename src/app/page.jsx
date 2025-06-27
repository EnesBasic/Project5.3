'use client';

import { MainComponent } from '@/components/schedule';

const mockWeeks = [
  { weekNumber: 1, year: 2025, dateRange: "Jan 1 - Jan 5 2025" },
  { weekNumber: 2, year: 2025, dateRange: "Jan 6 - Jan 12 2025" }
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
          "M53-E-929": "Munib"
        }
      }
    ]
  }
];

export default function SchedulePage() {
  return (
    <main className="container mx-auto p-4">
      <MainComponent 
        weekNumber={1}
        year={2025}
        dateRange="Jan 1 - Jan 5 2025"
        availableWeeks={mockWeeks}
        initialOperators={mockOperators}
        initialData={mockData}
      />
    </main>
  );
}
