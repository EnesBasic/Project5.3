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
  const [showSearch, setShowSearch] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [filteredOperators, setFilteredOperators] = React.useState([]);
  const [showWeekSelector, setShowWeekSelector] = React.useState(true);

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
    const monthAbbr = endParts[0];
    const year = endParts.length > 2 ? endParts[2] : new Date().getFullYear();

    return `${startDay} - ${endDay} ${monthAbbr} ${year}`;
  };

  const handlePreviousWeek = () => {
    const currentIndex = availableWeeks.findIndex(
      (week) => week.weekNumber === weekNumber && week.year === year,
    );
    if (currentIndex > 0) {
      const prevWeek = availableWeeks[currentIndex - 1];
      onWeekChange(prevWeek);
    }
  };

  const handleNextWeek = () => {
    const currentIndex = availableWeeks.findIndex(
      (week) => week.weekNumber === weekNumber && week.year === year,
    );
    if (currentIndex < availableWeeks.length - 1) {
      const nextWeek = availableWeeks[currentIndex + 1];
      onWeekChange(nextWeek);
    }
  };

  const handleWeekSelect = (week) => {
    onWeekChange(week);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (initialOperators && initialOperators.length > 0) {
      setFilteredOperators(
        initialOperators.filter((op) =>
          op.toLowerCase().includes(value.toLowerCase()),
        ),
      );
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredOperators([]);
  };

  const toggleSearch = () => {
    const newSearchState = !showSearch;
    setShowSearch(newSearchState);
    if (newSearchState) {
      setIsEditing(false);
      setShowWeekSelector(false);
    } else {
      setShowWeekSelector(!isEditing);
    }
  };

  const handleEditToggle = () => {
    const newEditState = !isEditing;
    setIsEditing(newEditState);
    if (newEditState) {
      setShowSearch(false);
      setShowWeekSelector(false);
    } else {
      setShowWeekSelector(!showSearch);
    }
  };

  const handleFilterToggle = () => {
    setActiveFilters(activeFilters > 0 ? 0 : 2);
  };

  const renderHeader = () => {
    return (
      <div className="w-full bg-[#2A2A2A] border-b border-[#3A3A3A]">
        <div className="p-3 flex flex-col items-center">
          <h2 className="text-lg font-bold text-[#67e8f9] mb-2">
            {formatHeaderDate(dateRange)}
          </h2>
          <div className="h-0.5 w-32 bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40 rounded-full shadow-sm"></div>

          <div className="w-full mt-3 flex items-center justify-between">
            <button
              onClick={onBack}
              className="bg-[#3A3A3A] text-[#67e8f9] border border-[#3A3A3A] h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center"
              title="Nazad"
            >
              <i className="fas fa-arrow-left text-sm"></i>
            </button>

            {!showSearch && !isEditing && (
              <div className="flex items-center gap-1 mx-2">
                <button
                  onClick={handlePreviousWeek}
                  className="bg-[#3A3A3A] text-[#67e8f9] border border-[#3A3A3A] h-7 w-7 rounded-l hover:opacity-90 transition-all shadow-md flex items-center justify-center"
                  disabled={
                    availableWeeks.findIndex(
                      (week) =>
                        week.weekNumber === weekNumber && week.year === year,
                    ) === 0
                  }
                  title="Previous Week"
                >
                  <i className="fas fa-chevron-left text-sm"></i>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded px-2 py-1 h-7 focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-between text-xs"
                    style={{ minWidth: "110px" }}
                  >
                    <span>
                      {weekNumber}:{formatDateToNumeric(dateRange)}
                    </span>
                    <i className="fas fa-chevron-down ml-2 text-xs"></i>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-auto min-w-full bg-[#1D1D1F] border border-[#3A3A3A] rounded shadow-lg max-h-60 overflow-y-auto">
                      {availableWeeks.map((week) => (
                        <div
                          key={`${week.weekNumber}-${week.year}`}
                          onClick={() => handleWeekSelect(week)}
                          className="px-3 py-2 hover:bg-[#3A3A3A] cursor-pointer text-white whitespace-nowrap text-xs"
                        >
                          {week.weekNumber}:
                          {formatDateToNumeric(week.dateRange)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextWeek}
                  className="bg-[#3A3A3A] text-[#67e8f9] border border-[#3A3A3A] h-7 w-7 rounded-r hover:opacity-90 transition-all shadow-md flex items-center justify-center"
                  disabled={
                    availableWeeks.findIndex(
                      (week) =>
                        week.weekNumber === weekNumber && week.year === year,
                    ) ===
                    availableWeeks.length - 1
                  }
                  title="Next Week"
                >
                  <i className="fas fa-chevron-right text-sm"></i>
                </button>
              </div>
            )}

            {showSearch && (
              <div className="relative flex-grow mx-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Pretraži operatere..."
                  className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-3 py-1 pl-8 w-full text-xs focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent h-7"
                  autoFocus
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86868B] text-xs"></i>
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#86868B] hover:text-white"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                )}
              </div>
            )}

            {(showSearch || isEditing) && <div className="flex-grow"></div>}

            <div className="flex space-x-2">
              <button
                onClick={handleFilterToggle}
                className={`${activeFilters > 0 ? "bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40" : "bg-[#3A3A3A]"} text-[#67e8f9] border ${activeFilters > 0 ? "border-[#67e8f9]/30" : "border-[#3A3A3A]"} h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center relative`}
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
                onClick={toggleSearch}
                className={`${showSearch ? "bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40" : "bg-[#3A3A3A]"} text-[#67e8f9] border ${showSearch ? "border-[#67e8f9]/30" : "border-[#3A3A3A]"} h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center`}
                title="Pretraži"
              >
                <i className="fas fa-search text-sm"></i>
              </button>

              <button
                onClick={handleEditToggle}
                className={`${isEditing ? "bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40" : "bg-[#3A3A3A]"} text-[#67e8f9] border ${isEditing ? "border-[#67e8f9]/30" : "border-[#3A3A3A]"} h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center`}
                title={isEditing ? "Otkaži Uređivanje" : "Uredi"}
              >
                <i
                  className={`fas fa-${isEditing ? "times" : "edit"} text-sm`}
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
      {renderHeader()}
      <BinBinUpdated
        weekNumber={weekNumber}
        year={year}
        dateRange={dateRange}
        onSave={onSave}
        onCancel={onCancel}
        initialData={initialData}
        isLoading={isLoading}
        error={error}
        availableWeeks={availableWeeks}
        onWeekChange={onWeekChange}
        initialOperators={
          searchTerm && filteredOperators.length > 0
            ? filteredOperators
            : initialOperators
        }
        onBack={onBack}
      />
    </div>
  );
}

function StoryComponent() {
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
  ];

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Schedule Component</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Default State</h2>
        <MainComponent
          weekNumber={1}
          year={2025}
          dateRange="Jan 1 - Jan 7 2025"
          availableWeeks={mockWeeks}
          initialOperators={mockOperators}
          initialData={mockData}
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