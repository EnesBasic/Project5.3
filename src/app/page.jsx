'use client';

import BinBin from '@/components/bin-bin';
import CalHeader from '@/components/cal-header';
import CalFooter from '@/components/cal-footer';

export default function MainComponent({
  // Normal state props
  weekNumber = 1,
  year = 2025,
  dateRange = "",
  availableWeeks = [],
  initialOperators = [],
  initialData = [],
  
  // State props (mutually exclusive)
  isLoading = false,
  error = null
}) {
  // Priority 1: Error state
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

  // Priority 2: Loading state
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

  // Priority 3: Empty data state
  if (initialData.length === 0 || initialOperators.length === 0) {
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

  // Default: Normal operational state
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