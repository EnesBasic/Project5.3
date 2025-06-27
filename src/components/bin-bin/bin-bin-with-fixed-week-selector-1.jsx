"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  weekNumber = 1,
  year = new Date().getFullYear(),
  dateRange = "Jan 1 - Jan 7 2025",
  onSave = () => {},
  onCancel = () => {},
  initialData = [],
  isLoading = false,
  error = null,
  availableWeeks = [],
  onWeekChange = () => {},
  initialOperators = [],
  onBack = () => {},
}) {
  const generateWeeksForYear = (year) => {
    const weeks = [];
    const firstDayOfYear = new Date(year, 0, 1);
    const firstWeekStart = new Date(firstDayOfYear);
    const firstWeekEnd = new Date(firstWeekStart);
    firstWeekEnd.setDate(firstWeekStart.getDate() + 6);
    const firstStartMonth = firstWeekStart.toLocaleString("en-US", {
      month: "short",
    });
    const firstEndMonth = firstWeekEnd.toLocaleString("en-US", {
      month: "short",
    });
    const firstStartDay = firstWeekStart.getDate();
    const firstEndDay = firstWeekEnd.getDate();
    const firstDateRange = `${firstStartMonth} ${firstStartDay} - ${firstEndMonth} ${firstEndDay} ${year}`;
    weeks.push({
      weekNumber: 1,
      year: year,
      dateRange: firstDateRange,
    });
    let firstMonday = new Date(firstDayOfYear);
    while (firstMonday.getDay() !== 1) {
      firstMonday.setDate(firstMonday.getDate() + 1);
    }
    if (firstMonday.getDate() > 7) {
      firstMonday = new Date(year, 0, 8);
    }
    for (let weekNum = 2; weekNum <= 53; weekNum++) {
      const weekStart = new Date(firstMonday);
      weekStart.setDate(weekStart.getDate() + (weekNum - 2) * 7);
      if (weekStart.getFullYear() > year) break;
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const startMonth = weekStart.toLocaleString("en-US", { month: "short" });
      const endMonth = weekEnd.toLocaleString("en-US", { month: "short" });
      const startDay = weekStart.getDate();
      const endDay = weekEnd.getDate();
      const dateRange = `${startMonth} ${startDay} - ${endMonth} ${endDay} ${year}`;
      weeks.push({
        weekNumber: weekNum,
        year: year,
        dateRange: dateRange,
      });
    }
    return weeks;
  };

  const [allWeeks, setAllWeeks] = React.useState([]);
  const [selectedWeek, setSelectedWeek] = React.useState({
    weekNumber,
    year,
    dateRange,
  });
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState("");
  const [shiftFilter, setShiftFilter] = React.useState("");
  const [operatorFilter, setOperatorFilter] = React.useState("");
  const [machineFilter, setMachineFilter] = React.useState("");

  React.useEffect(() => {
    const generatedWeeks = generateWeeksForYear(year);
    setAllWeeks(generatedWeeks);
  }, [year]);

  React.useEffect(() => {
    setSelectedWeek({
      weekNumber,
      year,
      dateRange,
    });
  }, [weekNumber, year, dateRange]);

  const formatDateToNumeric = (dateRange) => {
    if (!dateRange) return "";
    const parts = dateRange.split(" - ");
    if (parts.length !== 2) return dateRange;
    const startParts = parts[0].split(" ");
    const endParts = parts[1].split(" ");
    if (startParts.length < 2 || endParts.length < 2) return dateRange;
    const startDay = startParts[1].padStart(2, "0");
    const monthMap = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    const startMonth = monthMap[startParts[0]] || startParts[0];
    const endDay = endParts[1].padStart(2, "0");
    return `${startDay}-${endDay}/${startMonth}`;
  };

  const formatHeaderDate = (dateRange) => {
    if (!dateRange) return "";
    const parts = dateRange.split(" - ");
    if (parts.length !== 2) return dateRange;
    const startParts = parts[0].split(" ");
    const endParts = parts[1].split(" ");
    if (startParts.length < 2 || endParts.length < 2) return dateRange;
    const startDay = startParts[1];
    const endDay = endParts[1];
    const monthShortNameMap = {
      Jan: "Jan",
      Feb: "Feb",
      Mar: "Mar",
      Apr: "Apr",
      May: "Maj",
      Jun: "Jun",
      Jul: "Jul",
      Aug: "Aug",
      Sep: "Sep",
      Oct: "Okt",
      Nov: "Nov",
      Dec: "Dec",
    };
    const monthAbbr = monthShortNameMap[endParts[0]] || endParts[0];
    const year = endParts.length > 2 ? endParts[2] : new Date().getFullYear();
    return `${startDay} - ${endDay} ${monthAbbr} ${year}`;
  };

  const formatDropdownText = (weekNum, dateRangeStr) => {
    const formattedDateRange = formatDateToNumeric(dateRangeStr);
    return `${weekNum}:${formattedDateRange}`;
  };

  const handleWeekChange = (weekNum, yr) => {
    const selectedWeekData = allWeeks.find(
      (week) => week.weekNumber === weekNum && week.year === yr,
    );
    if (selectedWeekData) {
      setSelectedWeek({
        weekNumber: weekNum,
        year: yr,
        dateRange: selectedWeekData.dateRange,
      });
      onWeekChange(selectedWeekData);
      setIsDropdownOpen(false);
    }
  };

  const handlePreviousWeek = () => {
    const currentIndex = allWeeks.findIndex(
      (week) =>
        week.weekNumber === selectedWeek.weekNumber &&
        week.year === selectedWeek.year,
    );
    if (currentIndex > 0) {
      const prevWeek = allWeeks[currentIndex - 1];
      handleWeekChange(prevWeek.weekNumber, prevWeek.year);
    }
  };

  const handleNextWeek = () => {
    const currentIndex = allWeeks.findIndex(
      (week) =>
        week.weekNumber === selectedWeek.weekNumber &&
        week.year === selectedWeek.year,
    );
    if (currentIndex < allWeeks.length - 1) {
      const nextWeek = allWeeks[currentIndex + 1];
      handleWeekChange(nextWeek.weekNumber, nextWeek.year);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#67e8f9]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 m-4 rounded">
          <p className="font-medium">Error loading schedule:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
      <div className="p-1 bg-[#2A2A2A] border-b border-[#3A3A3A] flex items-center justify-center">
        <div className="flex items-center">
          <button
            onClick={handlePreviousWeek}
            className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded-l px-2 h-7 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-center text-xs hover:bg-[#3A3A3A] transition-colors"
            disabled={
              allWeeks.findIndex(
                (week) =>
                  week.weekNumber === selectedWeek.weekNumber &&
                  week.year === selectedWeek.year,
              ) === 0
            }
            title="Previous Week"
            style={{ borderRight: "none" }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="relative inline-block w-auto">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-[#1D1D1F] text-white border border-[#3A3A3A] px-2 h-7 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-between text-xs"
              style={{ minWidth: "110px", borderRadius: "0" }}
            >
              <span>
                {formatDropdownText(
                  selectedWeek.weekNumber,
                  selectedWeek.dateRange,
                )}
              </span>
              <i className="fas fa-chevron-down ml-2 text-xs"></i>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-auto min-w-full bg-[#1D1D1F] border border-[#3A3A3A] rounded shadow-lg max-h-60 overflow-y-auto">
                {allWeeks.map((week) => (
                  <div
                    key={`${week.weekNumber}-${week.year}`}
                    onClick={() => handleWeekChange(week.weekNumber, week.year)}
                    className="px-3 py-2 hover:bg-[#3A3A3A] cursor-pointer text-white whitespace-nowrap text-xs"
                  >
                    {formatDropdownText(week.weekNumber, week.dateRange)}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleNextWeek}
            className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded-r px-2 h-7 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-center text-xs hover:bg-[#3A3A3A] transition-colors"
            disabled={
              allWeeks.findIndex(
                (week) =>
                  week.weekNumber === selectedWeek.weekNumber &&
                  week.year === selectedWeek.year,
              ) ===
              allWeeks.length - 1
            }
            title="Next Week"
            style={{ borderLeft: "none" }}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="p-4">
        <BinBin
          weekNumber={selectedWeek.weekNumber}
          year={selectedWeek.year}
          dateRange={selectedWeek.dateRange}
          initialOperators={initialOperators}
          initialData={initialData}
          availableWeeks={allWeeks}
          onSave={onSave}
          onCancel={onCancel}
          onWeekChange={onWeekChange}
          isEditing={false}
          dateFilter={dateFilter}
          shiftFilter={shiftFilter}
          operatorFilter={operatorFilter}
          machineFilter={machineFilter}
          searchQuery=""
          hideWeekSelector={true}
          onBack={onBack}
        />
      </div>
    </div>
  );
}

function StoryComponent() {
  const [currentWeek, setCurrentWeek] = React.useState({
    weekNumber: 1,
    year: 2025,
    dateRange: "Jan 1 - Jan 7 2025",
  });

  const mockWeeks = [
    { weekNumber: 1, year: 2025, dateRange: "Jan 1 - Jan 7 2025" },
    { weekNumber: 2, year: 2025, dateRange: "Jan 8 - Jan 14 2025" },
    { weekNumber: 3, year: 2025, dateRange: "Jan 15 - Jan 21 2025" },
  ];

  const mockOperators = [
    "Adis",
    "Munib",
    "Sanin",
    "Farik",
    "Harun",
    "Almedin",
    "Enes",
  ];

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
    {
      date: "02.01",
      day: "U",
      shifts: [
        {
          time: "08.00-16.00",
          operators: {
            "M58-J-467": "Farik",
            "M53-E-929": "",
            "A35-J-924": "Harun",
          },
        },
        {
          time: "21.00-05.00",
          operators: {
            "M58-J-467": "Almedin",
            "M53-E-929": "",
            "A35-J-924": "Enes",
          },
        },
      ],
    },
  ];

  const handleWeekChange = (weekData) => {
    setCurrentWeek(weekData);
    console.log("Week changed to:", weekData);
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">
        BinBinWithFixedWeekSelector Component
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Default State</h2>
        <MainComponent
          weekNumber={currentWeek.weekNumber}
          year={currentWeek.year}
          dateRange={currentWeek.dateRange}
          availableWeeks={mockWeeks}
          initialOperators={mockOperators}
          initialData={mockData}
          onWeekChange={handleWeekChange}
          onBack={() => console.log("Back button clicked")}
          onSave={() => console.log("Save button clicked")}
          onCancel={() => console.log("Cancel button clicked")}
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
});
}