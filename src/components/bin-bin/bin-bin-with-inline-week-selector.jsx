"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  weekNumber = 1,
  year = new Date().getFullYear(),
  dateRange = "Jan 1 - Jan 7 2025",
  onSačuvaj = () => {},
  onCancel = () => {},
  initialData = [],
  isLoading = false,
  error = null,
  availableWeeks = [],
  onWeekChange = () => {},
  initialOperators = [],
  onBack = () => {},
}) {
  const [weekDates, setWeekDates] = React.useState([]);
  const [selectedWeek, setSelectedWeek] = React.useState({
    weekNumber,
    year,
    dateRange,
  });
  const [scheduleData, setScheduleData] = React.useState(initialData);
  const [operators, setOperators] = React.useState([]);
  const [operatorColors, setOperatorColors] = React.useState({});
  const [shiftColors, setShiftColors] = React.useState({
    "08.00-16.00": "#4a9eff",
    "21.00-05.00": "#8b5cf6",
  });
  const [shifts, setShifts] = React.useState(["08.00-16.00", "21.00-05.00"]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [allWeeks, setAllWeeks] = React.useState([]);
  const [machinesList] = React.useState(["M58-J-467", "M53-E-929", "A35-J-924"]);
  const [machineColors] = React.useState({
    "M58-J-467": "#FF8C00",
    "M53-E-929": "#4682B4", 
    "A35-J-924": "#32CD32"
  });

  const machines = machinesList;

  const dayAbbreviations = {
    Monday: "P",
    Tuesday: "U", 
    Wednesday: "S",
    Thursday: "Č",
    Friday: "P",
    Saturday: "S",
    Sunday: "N"
  };

  const days = [
    "Monday",
    "Tuesday", 
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

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
    Dec: "12"
  };

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
    Dec: "Dec"
  };

  // Function to generate all weeks of a year
  const generateWeeksForYear = (year) => {
    const weeks = [];
    
    // Start with January 1st of the year
    const firstDayOfYear = new Date(year, 0, 1);
    
    // Create the first week starting from January 1st
    const firstWeekStart = new Date(firstDayOfYear);
    const firstWeekEnd = new Date(firstWeekStart);
    firstWeekEnd.setDate(firstWeekStart.getDate() + 6);
    
    const firstStartMonth = firstWeekStart.toLocaleString('en-US', { month: 'short' });
    const firstEndMonth = firstWeekEnd.toLocaleString('en-US', { month: 'short' });
    const firstStartDay = firstWeekStart.getDate();
    const firstEndDay = firstWeekEnd.getDate();
    
    const firstDateRange = `${firstStartMonth} ${firstStartDay} - ${firstEndMonth} ${firstEndDay} ${year}`;
    
    // Always add week 1 (January 1-7)
    weeks.push({
      weekNumber: 1,
      year: year,
      dateRange: firstDateRange
    });
    
    // Find the first Monday after January 1st for subsequent weeks
    let firstMonday = new Date(firstDayOfYear);
    while (firstMonday.getDay() !== 1) { // 1 is Monday
      firstMonday.setDate(firstMonday.getDate() + 1);
    }
    
    // If the first Monday is after Jan 7, we need to adjust to ensure no gap
    if (firstMonday.getDate() > 7) {
      firstMonday = new Date(year, 0, 8); // Start from Jan 8
    }
    
    // Generate remaining weeks (starting from week 2)
    for (let weekNum = 2; weekNum <= 53; weekNum++) {
      const weekStart = new Date(firstMonday);
      weekStart.setDate(weekStart.getDate() + (weekNum - 2) * 7);
      
      // If we've gone into the next year, stop
      if (weekStart.getFullYear() > year) break;
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const startMonth = weekStart.toLocaleString('en-US', { month: 'short' });
      const endMonth = weekEnd.toLocaleString('en-US', { month: 'short' });
      const startDay = weekStart.getDate();
      const endDay = weekEnd.getDate();
      
      const dateRange = `${startMonth} ${startDay} - ${endMonth} ${endDay} ${year}`;
      
      weeks.push({
        weekNumber: weekNum,
        year: year,
        dateRange: dateRange
      });
    }
    
    return weeks;
  };

  const formatDateToNumeric = (dateRange) => {
    if (!dateRange) return "";

    const parts = dateRange.split(" - ");
    if (parts.length !== 2) return dateRange;

    const startParts = parts[0].split(" ");
    const endParts = parts[1].split(" ");

    if (startParts.length < 2 || endParts.length < 2) return dateRange;

    const startDay = startParts[1].padStart(2, "0");
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
    const monthAbbr = monthShortNameMap[endParts[0]] || endParts[0];
    const year = endParts.length > 2 ? endParts[2] : new Date().getFullYear();

    return `${startDay} - ${endDay} ${monthAbbr} ${year}`;
  };

  const generateDatesForWeek = (dateRange) => {
    if (!dateRange) return [];

    const parts = dateRange.split(" - ");
    if (parts.length !== 2) return [];

    const startParts = parts[0].split(" ");
    if (startParts.length < 2) return [];

    const startDay = parseInt(startParts[1], 10);
    const startMonth = monthMap[startParts[0]];
    const year = new Date().getFullYear();

    return days.map((day, index) => {
      const date = new Date(year, parseInt(startMonth, 10) - 1, startDay + index);
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      return {
        date: formattedDate,
        day: dayAbbreviations[day]
      };
    });
  };

  React.useEffect(() => {
    setScheduleData(initialData);
  }, [initialData]);

  React.useEffect(() => {
    setSelectedWeek({
      weekNumber,
      year,
      dateRange
    });
  }, [weekNumber, year, dateRange]);

  React.useEffect(() => {
    const dates = generateDatesForWeek(selectedWeek.dateRange);
    setWeekDates(dates);
  }, [selectedWeek]);

  React.useEffect(() => {
    // Initialize all weeks when component mounts or year changes
    const generatedWeeks = generateWeeksForYear(year);
    setAllWeeks(generatedWeeks);
  }, [year]);

  const handleWeekChange = (weekNum, yr) => {
    const selectedWeekData = allWeeks.find(week => 
      week.weekNumber === weekNum && week.year === yr
    );

    if (selectedWeekData) {
      setSelectedWeek({
        weekNumber: weekNum,
        year: yr,
        dateRange: selectedWeekData.dateRange
      });
      onWeekChange(selectedWeekData);
      setIsDropdownOpen(false);
    }
  };

  const handlePreviousWeek = () => {
    const currentIndex = allWeeks.findIndex(
      (week) =>
        week.weekNumber === selectedWeek.weekNumber &&
        week.year === selectedWeek.year
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
        week.year === selectedWeek.year
    );

    if (currentIndex < allWeeks.length - 1) {
      const nextWeek = allWeeks[currentIndex + 1];
      handleWeekChange(nextWeek.weekNumber, nextWeek.year);
    }
  };

  const handleSave = () => {
    onSačuvaj({
      weekNumber: selectedWeek.weekNumber,
      year: selectedWeek.year,
      dateRange: selectedWeek.dateRange,
      entries: scheduleData
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setScheduleData(initialData);
    setIsEditing(false);
    onCancel();
  };

  const getCellValue = (date, day, shift, machine) => {
    const dayEntry = scheduleData.find(entry => 
      entry.date === date && entry.day === day
    );
    if (!dayEntry) return "";

    const shiftEntry = dayEntry.shifts.find(s => s.time === shift);
    if (!shiftEntry) return "";

    return shiftEntry.operators[machine] || "";
  };

  const getOperatorColor = (operatorName) => {
    return operatorColors[operatorName] || "#E2E8F0";
  };

  const getShiftColor = (shift) => {
    return shiftColors[shift] || "#E2E8F0";
  };

  const formattedDropdownDate = formatDateToNumeric(selectedWeek.dateRange);
  const formattedHeaderDate = formatHeaderDate(selectedWeek.dateRange);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            ← Nazad
          </button>
          <div className="flex items-center">
            <div className="flex items-center">
              <button
                onClick={handlePreviousWeek}
                className="px-2 py-1 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-l-md"
                disabled={selectedWeek.weekNumber === 1}
              >
                ←
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-4 py-2 bg-white border-t border-b border-gray-300 hover:bg-gray-50 flex items-center"
                >
                  {`Sedmica ${selectedWeek.weekNumber}: ${formattedDropdownDate}`}
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {availableWeeks.map((week) => (
                      <button
                        key={week.weekNumber}
                        onClick={() => handleWeekChange(week.weekNumber, week.year)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        {`Sedmica ${week.weekNumber}: ${formatDateToNumeric(week.dateRange)}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleNextWeek}
                className="px-2 py-1 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-r-md"
                disabled={selectedWeek.weekNumber === 53}
              >
                →
              </button>
            </div>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{formattedHeaderDate}</h2>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Sačuvaj
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Otkaži
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Uredi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

  const mockWeeks = [
    { weekNumber: 1, year: 2025, dateRange: "Jan 1 - Jan 7 2025" },
    { weekNumber: 2, year: 2025, dateRange: "Jan 8 - Jan 14 2025" },
    { weekNumber: 3, year: 2025, dateRange: "Jan 15 - Jan 21 2025" },
    { weekNumber: 4, year: 2025, dateRange: "Jan 22 - Jan 28 2025" },
    { weekNumber: 5, year: 2025, dateRange: "Jan 29 - Feb 4 2025" },
  ];

  const mockOperators = ["Adis", "Munib", "Sanin", "Farik", "Harun"];

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
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">BinBin with Inline Week Selector Arrows</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Default State</h2>
        <MainComponent
          weekNumber={1}
          year={2025}
          dateRange="Jan 1 - Jan 7 2025"
          availableWeeks={mockWeeks}
          initialOperators={mockOperators}
          initialData={mockData}
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Week 3 Selected</h2>
        <MainComponent
          weekNumber={3}
          year={2025}
          dateRange="Jan 15 - Jan 21 2025"
          availableWeeks={mockWeeks}
          initialOperators={mockOperators}
          initialData={mockData}
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Loading State</h2>
        <MainComponent
          isLoading={true}
          availableWeeks={mockWeeks}
        />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Error State</h2>
        <MainComponent
          error="Failed to load schedule data. Please try again later."
          availableWeeks={mockWeeks}
        />
      </div>
    </div>
  );
});
}