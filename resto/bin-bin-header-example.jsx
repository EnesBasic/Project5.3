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
  const [data, setData] = React.useState(initialData);
  const [operators, setOperators] = React.useState(initialOperators);
  const [selectedWeek, setSelectedWeek] = React.useState({
    weekNumber,
    year,
    dateRange,
  });

  const handleWeekChange = (week) => {
    setSelectedWeek(week);
    onWeekChange(week);
  };

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  React.useEffect(() => {
    setOperators(initialOperators);
  }, [initialOperators]);

  return (
    <div className="w-full bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 10px 2px rgba(103, 232, 249, 0.6);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.12);
            box-shadow: 0 0 20px 6px rgba(103, 232, 249, 0.9);
          }
        }
      `}</style>

      <div className="bg-[#2C2C2E] p-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {availableWeeks.map((week) => (
            <button
              key={`${week.year}-${week.weekNumber}`}
              onClick={() => handleWeekChange(week)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedWeek.weekNumber === week.weekNumber &&
                selectedWeek.year === week.year
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "bg-[#3A3A3C] text-gray-300 hover:bg-[#4A4A4C]"
              }`}
            >
              Week {week.weekNumber} ({week.dateRange})
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-700 rounded-md p-4 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-[#2C2C2E] rounded-md p-6 text-center">
            <p className="text-gray-400 mb-4">
              No schedule data available for this week
            </p>
            <button
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors"
              onClick={() => onSave([])}
            >
              Create New Schedule
            </button>
          </div>
        ) : (
          <div className="bg-[#2C2C2E] rounded-md overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-[#3A3A3C] text-gray-400">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Day</th>
                  <th className="px-4 py-3">Shift</th>
                  {data[0]?.shifts[0]?.operators &&
                    Object.keys(data[0].shifts[0].operators).map((vehicle) => (
                      <th key={vehicle} className="px-4 py-3">
                        {vehicle}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {data.map((dayData, dayIndex) =>
                  dayData.shifts.map((shift, shiftIndex) => (
                    <tr
                      key={`${dayIndex}-${shiftIndex}`}
                      className={`border-b border-[#3A3A3C] ${shiftIndex % 2 === 0 ? "bg-[#2C2C2E]" : "bg-[#323234]"}`}
                    >
                      {shiftIndex === 0 && (
                        <>
                          <td
                            className="px-4 py-3 font-medium"
                            rowSpan={dayData.shifts.length}
                          >
                            {dayData.date}
                          </td>
                          <td
                            className="px-4 py-3"
                            rowSpan={dayData.shifts.length}
                          >
                            {dayData.day}
                          </td>
                        </>
                      )}
                      <td className="px-4 py-3">{shift.time}</td>
                      {Object.entries(shift.operators).map(
                        ([vehicle, operator]) => (
                          <td key={vehicle} className="px-4 py-3">
                            <select
                              className="bg-[#3A3A3C] text-white rounded px-2 py-1 w-full"
                              value={operator}
                              onChange={(e) => {
                                const newData = [...data];
                                newData[dayIndex].shifts[shiftIndex].operators[
                                  vehicle
                                ] = e.target.value;
                                setData(newData);
                              }}
                            >
                              <option value="">Not assigned</option>
                              {operators.map((op) => (
                                <option key={op} value={op}>
                                  {op}
                                </option>
                              ))}
                            </select>
                          </td>
                        ),
                      )}
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-[#2C2C2E] p-4 border-t border-[#3A3A3C] flex justify-end space-x-3">
        <button
          onClick={() => onCancel()}
          className="px-4 py-2 bg-[#3A3A3C] hover:bg-[#4A4A4C] text-white rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(data)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors"
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
}

function StoryComponent() {
  const [weekNumber, setWeekNumber] = React.useState(1);
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [dateRange, setDateRange] = React.useState("Jan 1 - Jan 7 2025");
  const [showSearch, setShowSearch] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const mockWeeks = [
    { weekNumber: 1, year: 2025, dateRange: "Jan 1 - Jan 7 2025" },
    { weekNumber: 2, year: 2025, dateRange: "Jan 8 - Jan 14 2025" },
    { weekNumber: 3, year: 2025, dateRange: "Jan 15 - Jan 21 2025" },
    { weekNumber: 4, year: 2025, dateRange: "Jan 22 - Jan 28 2025" },
    { weekNumber: 5, year: 2025, dateRange: "Jan 29 - Feb 4 2025" },
  ];

  const handleWeekChange = (weekNum, yr) => {
    const selectedWeek = mockWeeks.find(
      (week) => week.weekNumber === weekNum && week.year === yr,
    );
    if (selectedWeek) {
      setWeekNumber(weekNum);
      setYear(yr);
      setDateRange(selectedWeek.dateRange);
    }
  };

  return (
    <div className="bg-[#1D1D1F] p-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-xl mb-4 font-bold">
          BinBin Header Example
        </h1>

        <div className="mb-8 border border-[#3A3A3A] rounded-lg overflow-hidden">
          <h2 className="text-white text-sm p-2 bg-[#3A3A3A]">Default State</h2>
          <MainComponent
            weekNumber={weekNumber}
            year={year}
            dateRange={dateRange}
            onBack={() => console.log("Back clicked")}
            onWeekChange={handleWeekChange}
            onSearch={() => setShowSearch(!showSearch)}
            onFilter={() => setActiveFilters(activeFilters > 0 ? 0 : 2)}
            onEdit={() => setIsEditing(!isEditing)}
            showSearch={showSearch}
            isEditing={isEditing}
            activeFilters={activeFilters}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClearSearch={() => setSearchTerm("")}
            availableWeeks={mockWeeks}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        </div>

        <div className="mb-8 border border-[#3A3A3A] rounded-lg overflow-hidden">
          <h2 className="text-white text-sm p-2 bg-[#3A3A3A]">Search Active</h2>
          <MainComponent
            weekNumber={weekNumber}
            year={year}
            dateRange={dateRange}
            onBack={() => console.log("Back clicked")}
            onWeekChange={handleWeekChange}
            onSearch={() => {}}
            onFilter={() => {}}
            onEdit={() => {}}
            showSearch={true}
            isEditing={false}
            activeFilters={0}
            searchTerm="Adis"
            onSearchChange={() => {}}
            onClearSearch={() => {}}
            availableWeeks={mockWeeks}
            isDropdownOpen={false}
            setIsDropdownOpen={() => {}}
          />
        </div>

        <div className="mb-8 border border-[#3A3A3A] rounded-lg overflow-hidden">
          <h2 className="text-white text-sm p-2 bg-[#3A3A3A]">
            With Active Filters
          </h2>
          <MainComponent
            weekNumber={weekNumber}
            year={year}
            dateRange={dateRange}
            onBack={() => console.log("Back clicked")}
            onWeekChange={handleWeekChange}
            onSearch={() => {}}
            onFilter={() => {}}
            onEdit={() => {}}
            showSearch={false}
            isEditing={false}
            activeFilters={3}
            searchTerm=""
            onSearchChange={() => {}}
            onClearSearch={() => {}}
            availableWeeks={mockWeeks}
            isDropdownOpen={false}
            setIsDropdownOpen={() => {}}
          />
        </div>

        <div className="mb-8 border border-[#3A3A3A] rounded-lg overflow-hidden">
          <h2 className="text-white text-sm p-2 bg-[#3A3A3A]">Editing Mode</h2>
          <MainComponent
            weekNumber={weekNumber}
            year={year}
            dateRange={dateRange}
            onBack={() => console.log("Back clicked")}
            onWeekChange={handleWeekChange}
            onSearch={() => {}}
            onFilter={() => {}}
            onEdit={() => {}}
            showSearch={false}
            isEditing={true}
            activeFilters={0}
            searchTerm=""
            onSearchChange={() => {}}
            onClearSearch={() => {}}
            availableWeeks={mockWeeks}
            isDropdownOpen={false}
            setIsDropdownOpen={() => {}}
          />
        </div>
      </div>
    </div>
  );
});
}