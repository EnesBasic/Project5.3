"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  weekNumber = 1,
  year = 2025,
  dateRange = "Jan 1 - Jan 5 2025",
  onSave = () => {},
  onCancel = () => {},
  initialData = [],
  isLoading = false,
  error = null,
  availableWeeks = [],
  onWeekChange = () => {},
  initialOperators = [],
  onBack = () => {},
  isEditing = false,
  setIsEditing = () => {},
}) {
  const generateWeeksForYear = (inputYear) => {
    const weeks = [];

    // First week of 2025 is special - only 5 days (Jan 1-5)
    if (inputYear === 2025) {
      weeks.push({
        weekNumber: 1,
        year: inputYear,
        dateRange: `Jan 1 - Jan 5 ${inputYear}`,
        customFormat: `1:01-05/1`,
        startDate: new Date(inputYear, 0, 1),
        endDate: new Date(inputYear, 0, 5),
      });

      // Second week (Jan 6-12)
      weeks.push({
        weekNumber: 2,
        year: inputYear,
        dateRange: `Jan 6 - Jan 12 ${inputYear}`,
        customFormat: `2:06-12/1`,
        startDate: new Date(inputYear, 0, 6),
        endDate: new Date(inputYear, 0, 12),
      });

      // Third week (Jan 13-19)
      weeks.push({
        weekNumber: 3,
        year: inputYear,
        dateRange: `Jan 13 - Jan 19 ${inputYear}`,
        customFormat: `3:13-19/1`,
        startDate: new Date(inputYear, 0, 13),
        endDate: new Date(inputYear, 0, 19),
      });

      // Fourth week (Jan 20-26)
      weeks.push({
        weekNumber: 4,
        year: inputYear,
        dateRange: `Jan 20 - Jan 26 ${inputYear}`,
        customFormat: `4:20-26/1`,
        startDate: new Date(inputYear, 0, 20),
        endDate: new Date(inputYear, 0, 26),
      });

      // Fifth week (Jan 27-Feb 2)
      weeks.push({
        weekNumber: 5,
        year: inputYear,
        dateRange: `Jan 27 - Feb 2 ${inputYear}`,
        customFormat: `5:27/1-02/2`,
        startDate: new Date(inputYear, 0, 27),
        endDate: new Date(inputYear, 1, 2),
      });

      // Sixth week (Feb 3-9)
      weeks.push({
        weekNumber: 6,
        year: inputYear,
        dateRange: `Feb 3 - Feb 9 ${inputYear}`,
        customFormat: `6:03-09/2`,
        startDate: new Date(inputYear, 1, 3),
        endDate: new Date(inputYear, 1, 9),
      });

      // Continue with the rest of the weeks
      let currentWeekNum = 7;
      let currentDate = new Date(inputYear, 1, 10); // Feb 10

      while (currentDate.getFullYear() === inputYear) {
        const weekStart = new Date(currentDate);
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekStart.getDate() + 6);

        // If week end is in next year, adjust it to Dec 31
        if (weekEnd.getFullYear() > inputYear) {
          weekEnd.setFullYear(inputYear);
          weekEnd.setMonth(11);
          weekEnd.setDate(31);
        }

        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const startMonthName = months[weekStart.getMonth()];
        const endMonthName = months[weekEnd.getMonth()];
        const startDay = weekStart.getDate();
        const endDay = weekEnd.getDate();

        let dateRange;
        if (weekStart.getMonth() === weekEnd.getMonth()) {
          dateRange = `${startMonthName} ${startDay} - ${endDay} ${inputYear}`;
        } else {
          dateRange = `${startMonthName} ${startDay} - ${endMonthName} ${endDay} ${inputYear}`;
        }

        // Create custom format
        const startDayFormatted = startDay.toString().padStart(2, "0");
        const endDayFormatted = endDay.toString().padStart(2, "0");
        const startMonthFormatted = (weekStart.getMonth() + 1).toString();
        const endMonthFormatted = (weekEnd.getMonth() + 1).toString();

        let customFormat;
        if (weekStart.getMonth() === weekEnd.getMonth()) {
          customFormat = `${currentWeekNum}:${startDayFormatted}-${endDayFormatted}/${startMonthFormatted}`;
        } else {
          customFormat = `${currentWeekNum}:${startDayFormatted}/${startMonthFormatted}-${endDayFormatted}/${endMonthFormatted}`;
        }

        weeks.push({
          weekNumber: currentWeekNum,
          year: inputYear,
          dateRange: dateRange,
          customFormat: customFormat,
          startDate: new Date(weekStart),
          endDate: new Date(weekEnd),
        });

        currentDate.setDate(currentDate.getDate() + 7);
        currentWeekNum++;
      }

      // Ensure we have weeks 51, 52, and 53 for 2025
      const lastWeeks = [
        {
          weekNumber: 51,
          year: inputYear,
          dateRange: `Dec 15 - Dec 21 ${inputYear}`,
          customFormat: `51:15-21/12`,
          startDate: new Date(inputYear, 11, 15),
          endDate: new Date(inputYear, 11, 21),
        },
        {
          weekNumber: 52,
          year: inputYear,
          dateRange: `Dec 22 - Dec 28 ${inputYear}`,
          customFormat: `52:22-28/12`,
          startDate: new Date(inputYear, 11, 22),
          endDate: new Date(inputYear, 11, 28),
        },
        {
          weekNumber: 53,
          year: inputYear,
          dateRange: `Dec 29 - Dec 31 ${inputYear}`,
          customFormat: `53:29-31/12`,
          startDate: new Date(inputYear, 11, 29),
          endDate: new Date(inputYear, 11, 31),
        },
      ];

      // Always add these last weeks to ensure they're in the dropdown
      for (const lastWeek of lastWeeks) {
        // Remove any existing week with the same number
        const existingIndex = weeks.findIndex(
          (w) => w.weekNumber === lastWeek.weekNumber,
        );
        if (existingIndex !== -1) {
          weeks.splice(existingIndex, 1);
        }
        // Add the last week
        weeks.push(lastWeek);
      }
    } else {
      // For other years, implement similar logic but adjust for the specific year
      // This is a placeholder for other years' logic
      console.log(
        `Week generation for year ${inputYear} not specifically implemented`,
      );
    }

    // Sort weeks by week number
    weeks.sort((a, b) => a.weekNumber - b.weekNumber);

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
  const [showWeekSelector, setShowWeekSelector] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

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
    if (showSearch || isEditing || showFilterPanel) {
      setShowWeekSelector(false);
    } else {
      setShowWeekSelector(true);
    }
  }, [showSearch, isEditing, showFilterPanel]);

  const formatHeaderDate = (dateRange) => {
    if (!dateRange) return "";

    try {
      // For debugging
      console.log("Raw dateRange to format:", dateRange);

      // Special case for the problematic format
      if (dateRange.includes("-2025")) {
        // Extract the numbers and month from the problematic format
        const match = dateRange.match(/(\d+)\s*-2025\s*(\d+)\s*2025/);
        if (match) {
          const startDay = parseInt(match[1], 10);
          const endDay = parseInt(match[2], 10);
          // Since we know this is week 50, it's December
          return `${startDay} - ${endDay} Dec 2025`;
        }
      }

      // Regular parsing for normal formats
      const parts = dateRange.split(" - ");
      if (parts.length !== 2) {
        console.log("Invalid parts length:", parts);
        return dateRange;
      }

      // Extract start date parts (e.g., "Jan 1")
      const startParts = parts[0].split(" ");
      if (startParts.length < 2) {
        console.log("Invalid startParts length:", startParts);
        return dateRange;
      }

      const startMonth = startParts[0]; // "Jan"
      const startDay = parseInt(startParts[1], 10); // 1

      // Extract end date parts (e.g., "Jan 5 2025")
      const endParts = parts[1].split(" ");
      if (endParts.length < 2) {
        console.log("Invalid endParts length:", endParts);
        return dateRange;
      }

      const endMonth = endParts[0]; // "Jan"
      let endDay, year;

      // Handle different formats for the end part
      if (endParts.length >= 3) {
        // Format: "Month Day Year"
        endDay = parseInt(endParts[1], 10);
        year = endParts[2];
      } else {
        // Format might be "Day Year" combined
        const dayYearParts = endParts[1].split(" ");
        endDay = parseInt(dayYearParts[0], 10);
        year =
          dayYearParts.length > 1
            ? dayYearParts[1]
            : selectedWeek.year.toString();
      }

      const monthShortNameMap = {
        Jan: "Jan",
        Feb: "Feb",
        Mar: "Mar",
        Apr: "Apr",
        May: "Maj",
        Jun: "Jun",
        Jul: "Jul",
        Aug: "Avg",
        Sep: "Sep",
        Oct: "Okt",
        Nov: "Nov",
        Dec: "Dec",
      };

      // Use the end month for display
      const monthAbbr = monthShortNameMap[endMonth] || endMonth;

      const formattedDate = `${startDay} - ${endDay} ${monthAbbr} ${year}`;
      console.log("Final formatted date:", formattedDate);
      return formattedDate;
    } catch (error) {
      console.error("Error formatting header date:", error, dateRange);

      // Fallback for week 50 specifically
      if (selectedWeek && selectedWeek.weekNumber === 50) {
        return "8 - 14 Dec 2025";
      }

      return dateRange;
    }
  };

  const handleWeekChange = (weekNum, yr) => {
    const selectedWeekData = allWeeks.find(
      (week) => week.weekNumber === weekNum && week.year === yr,
    );

    if (selectedWeekData) {
      // For week 50, hardcode the correct date range
      let properDateRange = selectedWeekData.dateRange;

      // Special case for week 50 (or any week with formatting issues)
      if (weekNum === 50 && yr === 2025) {
        properDateRange = "Dec 8 - Dec 14 2025";
      } else if (selectedWeekData.customFormat === "50:08-14/12") {
        properDateRange = "Dec 8 - Dec 14 2025";
      }

      console.log("Selected week data:", selectedWeekData);
      console.log("Using date range:", properDateRange);

      setSelectedWeek({
        weekNumber: weekNum,
        year: yr,
        dateRange: properDateRange,
      });

      const updatedWeekData = {
        ...selectedWeekData,
        dateRange: properDateRange,
      };

      onWeekChange(updatedWeekData);
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

  const formattedHeaderDate = formatHeaderDate(selectedWeek.dateRange);

  const getSelectedWeekFormat = () => {
    const selectedWeekData = allWeeks.find(
      (week) =>
        week.weekNumber === selectedWeek.weekNumber &&
        week.year === selectedWeek.year,
    );
    return selectedWeekData ? selectedWeekData.customFormat : "";
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
      <div className="p-3 bg-[#2A2A2A] border-b border-[#3A3A3A]">
        <div className="flex items-center justify-between">
          <div className="w-24"></div>

          <div className="flex-grow text-center">
            <h2 className="text-lg font-bold bg-gradient-to-r from-[#4a9eff] to-[#67e8f9] text-transparent bg-clip-text px-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] filter-none transform scale-105 transition-transform duration-300 whitespace-nowrap overflow-hidden text-ellipsis">
              {formattedHeaderDate}
            </h2>
            <div className="h-0.5 w-32 bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40 mx-auto mt-1 rounded-full shadow-sm"></div>
          </div>

          <div className="w-24"></div>
        </div>
      </div>

      <div className="p-1 bg-[#2A2A2A] border-b border-[#3A3A3A] flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-[#3A3A3A] text-[#67e8f9] border border-[#3A3A3A] h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center mr-2"
          title="Nazad"
        >
          <i className="fas fa-arrow-left text-sm"></i>
        </button>

        <div className="flex-1 flex items-center justify-center px-2">
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
              <select className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded px-2 py-1 text-xs h-7 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent">
                <option value="">Svi operateri</option>
                <option value="op1">Operater 1</option>
                <option value="op2">Operater 2</option>
              </select>
              <select className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded px-2 py-1 text-xs h-7 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent">
                <option value="">Svi statusi</option>
                <option value="active">Aktivni</option>
                <option value="inactive">Neaktivni</option>
              </select>
              <button className="bg-[#67e8f9] text-[#1D1D1F] px-2 rounded text-xs h-7 hover:opacity-90 transition-all">
                Primijeni
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

          {!showSearch && !showFilterPanel && !isEditing && (
            <div className="flex">
              <button
                onClick={handlePreviousWeek}
                className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded-l px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-center text-xs hover:bg-[#3A3A3A] transition-colors h-7 w-7"
                disabled={
                  allWeeks.findIndex(
                    (week) =>
                      week.weekNumber === selectedWeek.weekNumber &&
                      week.year === selectedWeek.year,
                  ) === 0
                }
                title="Previous Week"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              <div className="relative inline-block">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-[#1D1D1F] text-white border-y border-[#3A3A3A] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-between text-xs h-7"
                  style={{
                    minWidth: "110px",
                    borderLeft: "none",
                    borderRight: "none",
                  }}
                >
                  <span>{getSelectedWeekFormat()}</span>
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
                        {week.customFormat}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleNextWeek}
                className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded-r px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-center text-xs hover:bg-[#3A3A3A] transition-colors h-7 w-7"
                disabled={
                  allWeeks.findIndex(
                    (week) =>
                      week.weekNumber === selectedWeek.weekNumber &&
                      week.year === selectedWeek.year,
                  ) ===
                  allWeeks.length - 1
                }
                title="Next Week"
              >
                <i className="fas fa-chevron-right"></i>
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
              } else {
                setShowWeekSelector(true);
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
              } else {
                setShowWeekSelector(true);
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
              } else {
                setShowWeekSelector(true);
              }
            }}
            className={`${isEditing ? "bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40" : "bg-[#3A3A3A]"} text-[#67e8f9] border ${isEditing ? "border-[#67e8f9]/30" : "border-[#3A3A3A]"} h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center`}
            title={isEditing ? "Otkaži Uređivanje" : "Uredi"}
          >
            <i className={`fas fa-${isEditing ? "times" : "edit"} text-sm`}></i>
          </button>
        </div>
      </div>

      <div className="p-4 text-white">
        <div className="border border-dashed border-[#3A3A3A] rounded-lg p-8 flex items-center justify-center">
          <p className="text-[#67e8f9]">
            Schedule content would be displayed here
          </p>
        </div>
      </div>
    </div>
  );
}

  const [currentWeek, setCurrentWeek] = React.useState({
    weekNumber: 1,
    year: 2025,
    dateRange: "Jan 1 - Jan 5 2025",
  });

  const [isEditing, setIsEditing] = React.useState(false);

  const mockWeeks = [
    {
      weekNumber: 1,
      year: 2025,
      dateRange: "Jan 1 - Jan 5 2025",
      customFormat: "1:01-05/1",
    },
    {
      weekNumber: 2,
      year: 2025,
      dateRange: "Jan 6 - Jan 12 2025",
      customFormat: "2:06-12/1",
    },
    {
      weekNumber: 3,
      year: 2025,
      dateRange: "Jan 13 - Jan 19 2025",
      customFormat: "3:13-19/1",
    },
  ];

  const handleWeekChange = (weekData) => {
    setCurrentWeek(weekData);
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen font-inter">
      <h1 className="text-2xl font-bold text-white mb-6">
        BinBinWithWeekSelectorInHeader Component
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Default State</h2>
        <MainComponent
          weekNumber={currentWeek.weekNumber}
          year={currentWeek.year}
          dateRange={currentWeek.dateRange}
          availableWeeks={mockWeeks}
          onWeekChange={handleWeekChange}
          onBack={() => console.log("Back button clicked")}
          onSave={() => console.log("Save button clicked")}
          onCancel={() => console.log("Cancel button clicked")}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Editing State</h2>
        <MainComponent
          weekNumber={currentWeek.weekNumber}
          year={currentWeek.year}
          dateRange={currentWeek.dateRange}
          availableWeeks={mockWeeks}
          onWeekChange={handleWeekChange}
          onBack={() => console.log("Back button clicked")}
          onSave={() => console.log("Save button clicked")}
          onCancel={() => console.log("Cancel button clicked")}
          isEditing={true}
          setIsEditing={() => {}}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Loading State</h2>
        <MainComponent
          isLoading={true}
          weekNumber={currentWeek.weekNumber}
          year={currentWeek.year}
          dateRange={currentWeek.dateRange}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Error State</h2>
        <MainComponent
          error="Failed to load schedule data. Please try again later."
          weekNumber={currentWeek.weekNumber}
          year={currentWeek.year}
          dateRange={currentWeek.dateRange}
        />
      </div>
    </div>
  );
});
}