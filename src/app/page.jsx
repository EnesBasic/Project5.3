'use client';
import { MainComponent } from '@/components/schedule';

// Test Case 1: Normal state
const normalProps = {
  weekNumber: 1,
  year: 2025,
  dateRange: "Jan 1 - Jan 7 2025",
  initialOperators: ["Operator1", "Operator2"],
  initialData: [{date: "01.01", shifts: []}]
};

// Test Case 2: Loading state
const loadingProps = {
  ...normalProps,
  isLoading: true
};

// Test Case 3: Error state
const errorProps = {
  ...normalProps,
  error: "Test error"
};

export default function TestPage() {
  return (
    <div className="space-y-8 p-4">
      <div className="border p-4">
        <h2 className="text-xl mb-2">Normal State</h2>
        <MainComponent {...normalProps} />
      </div>
      
      <div className="border p-4">
        <h2 className="text-xl mb-2">Loading State</h2>
        <MainComponent {...loadingProps} />
      </div>
      
      <div className="border p-4">
        <h2 className="text-xl mb-2">Error State</h2>
        <MainComponent {...errorProps} />
      </div>
    </div>
  );
}
