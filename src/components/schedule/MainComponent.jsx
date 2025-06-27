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
  if (error) return <div className="error p-4 text-red-600">{error}</div>;
  if (isLoading) return <div className="p-4">Loading schedule...</div>;
  if (!initialData.length) return <div className="p-4 text-gray-500">No schedule data available</div>;

  return (
    <div className="schedule-container mx-auto max-w-6xl p-4">
      <CalHeader 
        weekNumber={weekNumber}
        year={year}
        dateRange={dateRange}
        availableWeeks={availableWeeks}
      />
      
      <div className="mt-6 bg-white rounded-lg shadow">
        <BinBin
          operators={initialOperators}
          scheduleData={initialData}
        />
      </div>
      
      <CalFooter />
    </div>
  );
}
