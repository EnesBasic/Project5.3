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
  const [allWeeks, setAllWeeks] = React.useState(availableWeeks);
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
    setAllWeeks(availableWeeks);
  }, [availableWeeks]);

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
            <button
              onClick={() => {
                const prevWeek = allWeeks.find(week => 
                  week.weekNumber === selectedWeek.weekNumber - 1 && week.year === selectedWeek.year
                );
                if (prevWeek) {
                  handleWeekChange(prevWeek.weekNumber, prevWeek.year);
                }
              }}
              className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              disabled={!allWeeks.some(week => week.weekNumber === selectedWeek.weekNumber - 1 && week.year === selectedWeek.year)}
            >
              ←
            </button>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50"
              >
                {`Sedmica ${selectedWeek.weekNumber}: ${formattedDropdownDate}`}
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {allWeeks.map((week) => (
                    <button
                      key={`${week.weekNumber}-${week.year}`}
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
              onClick={() => {
                const nextWeek = allWeeks.find(week => 
                  week.weekNumber === selectedWeek.weekNumber + 1 && week.year === selectedWeek.year
                );
                if (nextWeek) {
                  handleWeekChange(nextWeek.weekNumber, nextWeek.year);
                }
              }}
              className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              disabled={!allWeeks.some(week => week.weekNumber === selectedWeek.weekNumber + 1 && week.year === selectedWeek.year)}
            >
              →
            </button>
          </div>
        </div>
        <div className="flex items-center">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 mr-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Sačuvaj
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Otkaži
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Uredi
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">{formattedHeaderDate}</h2>
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Datum</th>
                  <th className="px-4 py-2 border">Dan</th>
                  <th className="px-4 py-2 border">Smjena</th>
                  {machines.map(machine => (
                    <th 
                      key={machine} 
                      className="px-4 py-2 border"
                      style={{
                        backgroundColor: `${machineColors[machine]}20`,
                        color: machineColors[machine]
                      }}
                    >
                      {machine}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weekDates.map((dateInfo) => (
                  shifts.map((shift, shiftIndex) => {
                    const isDaylightShift = shift.includes("08.00");
                    const shiftColor = getShiftColor(shift);
                    
                    return (
                      <tr 
                        key={`${dateInfo.date}-${shift}`}
                        className={`${dateInfo.day === "S" || dateInfo.day === "N" ? "bg-gray-50" : ""}`}
                      >
                        {shiftIndex === 0 && (
                          <td 
                            rowSpan={shifts.length} 
                            className="px-4 py-2 border text-center font-medium"
                          >
                            {dateInfo.date}
                          </td>
                        )}
                        
                        {shiftIndex === 0 && (
                          <td 
                            rowSpan={shifts.length} 
                            className="px-4 py-2 border text-center font-bold"
                          >
                            {dateInfo.day}
                          </td>
                        )}
                        
                        <td 
                          className="px-4 py-2 border text-center"
                          style={{
                            backgroundColor: isDaylightShift ? "#f0f9ff" : `${shiftColor}20`,
                            color: isDaylightShift ? "#000000" : shiftColor
                          }}
                        >
                          {shift}
                        </td>
                        
                        {machines.map(machine => {
                          const cellValue = getCellValue(dateInfo.date, dateInfo.day, shift, machine);
                          const operatorColor = cellValue ? getOperatorColor(cellValue) : "";
                          
                          return (
                            <td 
                              key={`${dateInfo.date}-${shift}-${machine}`} 
                              className="px-4 py-2 border text-center"
                            >
                              {cellValue && (
                                <span 
                                  className="px-2 py-1 rounded"
                                  style={{
                                    backgroundColor: operatorColor,
                                    color: "#FFFFFF"
                                  }}
                                >
                                  {cellValue}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StoryComponent() {
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
            "M58-J-467": "Adis",
            "M53-E-929": "",
            "A35-J-924": "Munib",
          },
        },
      ],
    },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Schedule Component</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Default State</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <MainComponent
            weekNumber={1}
            year={2025}
            dateRange="Jan 1 - Jan 7 2025"
            availableWeeks={mockWeeks}
            initialOperators={mockOperators}
            initialData={mockData}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Loading State</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <MainComponent
            weekNumber={2}
            year={2025}
            dateRange="Jan 8 - Jan 14 2025"
            availableWeeks={mockWeeks}
            isLoading={true}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Error State</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <MainComponent
            weekNumber={3}
            year={2025}
            dateRange="Jan 15 - Jan 21 2025"
            availableWeeks={mockWeeks}
            error="Failed to load schedule data. Please try again later."
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Empty Data State</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <MainComponent
            weekNumber={4}
            year={2025}
            dateRange="Jan 22 - Jan 28 2025"
            availableWeeks={mockWeeks}
            initialOperators={mockOperators}
            initialData={[]}
          />
        </div>
      </div>
    </div>
  );
});
}