'use client';
import { MainComponent } from '@/components/schedule';

// Choose ONLY ONE of these state modes:
const STATE_MODE = 'normal'; // 'loading' | 'error' | 'empty'

const baseProps = {
  weekNumber: 1,
  year: 2025,
  dateRange: "Jan 1 - Jan 7 2025",
  availableWeeks: [
    { weekNumber: 1, dateRange: "Jan 1 - Jan 7 2025" }
  ],
  initialOperators: ["Operator1", "Operator2"],
  initialData: [{date: "01.01", shifts: []}]
};

const stateProps = {
  ...baseProps,
  ...(STATE_MODE === 'loading' && { isLoading: true }),
  ...(STATE_MODE === 'error' && { error: "Test error" }),
  ...(STATE_MODE === 'empty' && { initialData: [], initialOperators: [] })
};

export default function SchedulePage() {
  return <MainComponent {...stateProps} />;
}
