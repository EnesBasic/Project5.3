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
  const [showSearch, setShowSearch] = React.useState(false);
  const [showFilterPanel, setShowFilterPanel] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
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

  React.useEffect(() => {
    let count = 0;
    if (dateFilter) count++;
    if (shiftFilter) count++;
    if (operatorFilter) count++;
    if (machineFilter) count++;
    setActiveFilters(count);
  }, [dateFilter, shiftFilter, operatorFilter, machineFilter]);

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

  const resetFilters = () => {
    setDateFilter("");
    setShiftFilter("");
    setOperatorFilter("");
    setMachineFilter("");
  };

  const formattedHeaderDate = formatHeaderDate(selectedWeek.dateRange);

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
      <div className="p-3 bg-[#2A2A2A] border-b border-[#3A3A3A]">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-bold bg-gradient-to-r from-[#4a9eff] to-[#67e8f9] text-transparent bg-clip-text px-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] filter-none transform scale-105 transition-transform duration-300">
              {formattedHeaderDate}
            </h2>
            <div className="h-0.5 w-32 bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40 mx-auto mt-1 rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>

      <div className="p-1 bg-[#2A2A2A] border-b border-[#3A3A3A] flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-[#3A3A3A] text-[#67e8f9] border border-[#3A3A3A] h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center"
          title="Nazad"
        >
          <i className="fas fa-arrow-left text-sm"></i>
        </button>

        <div className="flex-1 flex items-center justify-center px-2">
          {!showSearch && !showFilterPanel && !isEditing && (
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
                        onClick={() =>
                          handleWeekChange(week.weekNumber, week.year)
                        }
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
          )}

          {showSearch && (
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pretraži raspored..."
                className="w-full bg-[#1D1D1F] border border-[#3A3A3A] rounded px-3 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent h-7"
              />
              <i className="fas fa-search absolute right-3 top-1.5 text-[#67e8f9] text-xs"></i>
            </div>
          )}

          {showFilterPanel && (
            <div className="flex items-center space-x-2">
              <select
                value={operatorFilter}
                onChange={(e) => setOperatorFilter(e.target.value)}
                className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded px-2 py-1 text-xs h-7 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent"
              >
                <option value="">Svi operateri</option>
                {initialOperators.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
              <select
                value={machineFilter}
                onChange={(e) => setMachineFilter(e.target.value)}
                className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded px-2 py-1 text-xs h-7 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent"
              >
                <option value="">Sva vozila</option>
                {initialData[0]?.shifts[0]?.operators &&
                  Object.keys(initialData[0].shifts[0].operators).map(
                    (machine) => (
                      <option key={machine} value={machine}>
                        {machine}
                      </option>
                    ),
                  )}
              </select>
              <button
                onClick={resetFilters}
                className="bg-[#67e8f9] text-[#1D1D1F] px-2 rounded text-xs h-7 hover:opacity-90 transition-all"
              >
                Poništi
              </button>
            </div>
          )}

          {isEditing && (
            <div className="flex items-center space-x-2">
              <button
                onClick={onSave}
                className="bg-gradient-to-r from-[#22c55e]/80 to-[#22c55e]/60 text-white px-3 py-1 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center border border-[#22c55e]/30 text-xs h-7"
              >
                <i className="fas fa-save text-xs mr-1"></i>
                Sačuvaj
              </button>
              <button
                onClick={onCancel}
                className="bg-gradient-to-r from-[#ef4444]/80 to-[#ef4444]/60 text-white px-3 py-1 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center border border-[#ef4444]/30 text-xs h-7"
              >
                <i className="fas fa-times text-xs mr-1"></i>
                Otkaži
              </button>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowFilterPanel(!showFilterPanel);
              if (!showFilterPanel) {
                setIsEditing(false);
                setShowSearch(false);
              }
            }}
            className={`${showFilterPanel || activeFilters > 0 ? "bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40" : "bg-[#3A3A3A]"} text-[#67e8f9] border ${showFilterPanel || activeFilters > 0 ? "border-[#67e8f9]/30" : "border-[#3A3A3A]"} h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center relative`}
            title="Filter options"
          >
            <i className="fas fa-filter text-sm"></i>
            {activeFilters > 0 && (
              <div className="absolute -top-1.5 -right-1.5 bg-[#67e8f9] text-black text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center">
                {activeFilters}
              </div>
            )}
          </button>

          <button
            onClick={() => {
              setShowSearch(!showSearch);
              if (!showSearch) {
                setIsEditing(false);
                setShowFilterPanel(false);
              }
            }}
            className={`${showSearch ? "bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40" : "bg-[#3A3A3A]"} text-[#67e8f9] border ${showSearch ? "border-[#67e8f9]/30" : "border-[#3A3A3A]"} h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center`}
            title="Pretraži"
          >
            <i className="fas fa-search text-sm"></i>
          </button>

          <button
            onClick={() => {
              setIsEditing(!isEditing);
              if (!isEditing) {
                setShowSearch(false);
                setShowFilterPanel(false);
              }
            }}
            className={`${isEditing ? "bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40" : "bg-[#3A3A3A]"} text-[#67e8f9] border ${isEditing ? "border-[#67e8f9]/30" : "border-[#3A3A3A]"} h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center`}
            title={isEditing ? "Otkaži Uređivanje" : "Uredi"}
          >
            <i className={`fas fa-${isEditing ? "times" : "edit"} text-sm`}></i>
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
          isEditing={isEditing}
          dateFilter={dateFilter}
          shiftFilter={shiftFilter}
          operatorFilter={operatorFilter}
          machineFilter={machineFilter}
          searchQuery={searchQuery}
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
        BinBinWithInlineWeekSelectorFixed Component
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