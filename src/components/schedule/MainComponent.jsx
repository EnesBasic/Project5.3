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
  initialData = [],
  isLoading = false,
  error = null
}) {
  // Handle error state
  if (error) {
    return (
      <div className="error-state p-4 text-red-500">
        <CalHeader 
          weekNumber={weekNumber}
          year={year}
          dateRange={dateRange}
        />
        <div className="error-message">{error}</div>
        <CalFooter />
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="loading-state p-4">
        <CalHeader 
          weekNumber={weekNumber}
          year={year}
          dateRange={dateRange}
        />
        <div className="loading-spinner">Loading schedule...</div>
        <CalFooter />
      </div>
    );
  }

  // Handle empty state
  if (initialData.length === 0) {
    return (
      <div className="empty-state p-4 text-gray-500">
        <CalHeader 
          weekNumber={weekNumber}
          year={year}
          dateRange={dateRange}
        />
        <div className="empty-message">No schedule data available</div>
        <CalFooter />
      </div>
    );
  }

  // Default/normal state
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