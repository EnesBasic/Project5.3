'use client';

import BinBin from '@/components/bin-bin';
import CalHeader from '@/components/cal-header';
import CalFooter from '@/components/cal-footer';

export default function MainComponent({
  weekNumber = 1,
  year = 2025,
  dateRange = "",
  availableWeeks = [],
  initialOperators = [],
  initialData = []
}) {
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
