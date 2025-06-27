'use client';

import BinBin from '@/components/bin-bin/BinBin';
import CalHeader from '@/components/CalHeader';
import CalFooter from '@/components/CalFooter';

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
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="schedule-container">
      <CalHeader 
        weekNumber={weekNumber}
        year={year}
        dateRange={dateRange}
        availableWeeks={availableWeeks}
      />
      
      <BinBin
        operators={initialOperators}
        scheduleData={initialData}
      />
      
      <CalFooter />
    </div>
  );
}
