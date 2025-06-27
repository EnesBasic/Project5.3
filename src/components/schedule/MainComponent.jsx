'use client';
import BinBin from '@/components/bin-bin';
import CalHeader from '@/components/cal-header';
import CalFooter from '@/components/cal-footer';

export default function MainComponent({
  // Normal props
  weekNumber = 1,
  year = 2025,
  dateRange = "",
  availableWeeks = [],
  initialOperators = [],
  initialData = [],
  
  // State props (MUTUALLY EXCLUSIVE)
  isLoading = false,
  error = null
}) {
  // State validation
  const activeStates = [!!error, isLoading, initialData.length === 0].filter(Boolean).length;
  if (activeStates > 1) {
    console.error(`State conflict! ${activeStates} states active simultaneously`);
    return <div className="error">Configuration error: Multiple states active</div>;
  }

  // State handling
  if (error) return <ErrorState error={error} {...{weekNumber, year, dateRange}} />;
  if (isLoading) return <LoadingState {...{weekNumber, year, dateRange}} />;
  if (initialData.length === 0) return <EmptyState {...{weekNumber, year, dateRange}} />;

  // Normal state
  return (
    <div className="schedule-container">
      <CalHeader {...{weekNumber, year, dateRange, availableWeeks}} />
      <BinBin operators={initialOperators} scheduleData={initialData} />
      <CalFooter />
    </div>
  );
}

// Sub-components for states
function ErrorState({ error, ...headerProps }) {
  return (
    <div className="error-state">
      <CalHeader {...headerProps} />
      <div className="error">{error}</div>
      <CalFooter />
    </div>
  );
}

function LoadingState(headerProps) {
  return (
    <div className="loading-state">
      <CalHeader {...headerProps} />
      <div>Loading...</div>
      <CalFooter />
    </div>
  );
}

function EmptyState(headerProps) {
  return (
    <div className="empty-state">
      <CalHeader {...headerProps} />
      <div>No data available</div>
      <CalFooter />
    </div>
  );
}
