"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  weekNumber = 1,
  year = new Date().getFullYear(),
  dateRange = "Jan 1 - Jan 7 2025",
  initialData = [],
  isLoading = false,
  error = null,
  initialOperators = [],
  shifts = ["08.00-16.00", "21.00-05.00"],
}) {
  const [scheduleData, setScheduleData] = React.useState(initialData);
  const [operators, setOperators] = React.useState([]);
  const [operatorColors, setOperatorColors] = React.useState({});
  const [shiftColors, setShiftColors] = React.useState({
    "08.00-16.00": "#4a9eff",
    "21.00-05.00": "#8b5cf6",
  });
  const [machines, setMachines] = React.useState([
    "M58-J-467",
    "M53-E-929",
    "A35-J-924",
  ]);
  const [machineColors, setMachineColors] = React.useState({
    "M58-J-467": "#FF8C00",
    "M53-E-929": "#4682B4",
    "A35-J-924": "#32CD32",
  });
  const [highlightedOperator, setHighlightedOperator] = React.useState(null);

  const distinctColors = [
    "#FFFFFF",
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
    "#FF4500",
    "#4B0082",
    "#FF1493",
    "#00CED1",
    "#8B4513",
    "#FF8C00",
    "#9400D3",
    "#32CD32",
    "#DC143C",
  ];

  const generateDatesForWeek = (dateRange) => {
    if (!dateRange) return [];

    const parts = dateRange.split(" - ");
    if (parts.length !== 2) return [];

    const startParts = parts[0].split(" ");
    if (startParts.length < 2) return [];

    const startDay = parseInt(startParts[1], 10);
    const startMonth = {
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
    }[startParts[0]];

    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const dayAbbreviations = {
      Monday: "P",
      Tuesday: "U",
      Wednesday: "S",
      Thursday: "Č",
      Friday: "P",
      Saturday: "S",
      Sunday: "N",
    };

    return days.map((day, index) => {
      const date = new Date(
        year,
        parseInt(startMonth, 10) - 1,
        startDay + index,
      );
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      return {
        date: formattedDate,
        day: dayAbbreviations[day],
      };
    });
  };

  const weekDates = generateDatesForWeek(dateRange);

  React.useEffect(() => {
    setScheduleData(initialData);
  }, [initialData]);

  React.useEffect(() => {
    if (initialOperators && initialOperators.length > 0) {
      setOperators(initialOperators);

      const colors = {};
      initialOperators.forEach((operator, index) => {
        colors[operator] = distinctColors[index % distinctColors.length];
      });
      setOperatorColors(colors);
    }
  }, [initialOperators]);

  const getOperatorColor = (operatorName) => {
    return operatorColors[operatorName] || "#E2E8F0";
  };

  const getShiftColor = (shift) => {
    return shiftColors[shift] || "#E2E8F0";
  };

  const getContrastTextColor = (bgColor) => {
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  const getCellValue = (date, day, shift, machine) => {
    const dayEntry = scheduleData.find(
      (entry) => entry.date === date && entry.day === day,
    );
    if (!dayEntry) return "";

    const shiftEntry = dayEntry.shifts.find((s) => s.time === shift);
    if (!shiftEntry) return "";

    return shiftEntry.operators[machine] || "";
  };

  const formatShiftTime = (shift) => {
    if (!shift) return "";

    const parts = shift.split("-");
    if (parts.length !== 2) return shift;

    const startTime = parts[0].trim();
    const endTime = parts[1].trim();

    const hasMinutes = !startTime.endsWith(".00") || !endTime.endsWith(".00");

    if (hasMinutes) {
      return shift;
    }

    const shortStart = parseInt(startTime).toString();
    const shortEnd = parseInt(endTime).toString();

    return `${shortStart}-${shortEnd}`;
  };

  const shouldHighlightCell = (operator) => {
    if (!highlightedOperator) return false;
    return operator === highlightedOperator;
  };

  return (
    <div className="w-full bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
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

      {isLoading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#67e8f9]"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 m-4 rounded">
          <p className="font-medium">Error loading schedule:</p>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-white border-collapse">
            <thead className="text-xs uppercase bg-[#2A2A2A] text-[#67e8f9]">
              <tr>
                <th className="px-1 py-2 border border-[#3A3A3A] w-[60px]">
                  DATUM
                </th>
                <th className="px-1 py-2 border border-[#3A3A3A] w-[20px]">
                  D
                </th>
                <th className="px-1 py-2 border border-[#3A3A3A] w-[50px] text-center">
                  S
                </th>
                {machines.map((machine) => (
                  <th
                    key={machine}
                    className="px-1 py-2 text-center border border-[#3A3A3A] whitespace-nowrap text-[10px]"
                    style={{
                      backgroundColor: `rgba(${parseInt((machineColors[machine] || "#FF8C00").slice(1, 3), 16)}, ${parseInt((machineColors[machine] || "#FF8C00").slice(3, 5), 16)}, ${parseInt((machineColors[machine] || "#FF8C00").slice(5, 7), 16)}, 0.25)`,
                      color: machineColors[machine] || "#FF8C00",
                      textShadow: "0 0 8px rgba(0, 0, 0, 0.7)",
                      fontWeight: "bold",
                    }}
                  >
                    {machine}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekDates.map((dateInfo) => (
                <React.Fragment key={dateInfo.date}>
                  {shifts.map((shift, shiftIndex) => {
                    const isDaylightShift = shift.includes("08.00");
                    const shiftColor = getShiftColor(shift);

                    return (
                      <tr
                        key={`${dateInfo.date}-${shift}`}
                        className={`
                          ${shiftIndex === shifts.length - 1 ? "border-b-2 border-[#3A3A3A]" : ""}
                          ${dateInfo.day === "S" || dateInfo.day === "N" ? "bg-[#2A2A2A]/30" : ""}
                        `}
                        style={{
                          backgroundColor: isDaylightShift
                            ? "#FFFFFF"
                            : `${shiftColor}15`,
                        }}
                      >
                        {shiftIndex === 0 ? (
                          <td
                            rowSpan={shifts.length}
                            className="px-2 py-1 font-medium text-center align-middle border border-[#3A3A3A] text-xs"
                            style={{
                              background:
                                "linear-gradient(to right, #817063, #817063cc)",
                              color: "#FFFFFF",
                            }}
                          >
                            {dateInfo.date}
                          </td>
                        ) : null}

                        {shiftIndex === 0 ? (
                          <td
                            rowSpan={shifts.length}
                            className="px-1 py-1 font-bold text-center align-middle border border-[#3A3A3A] text-xs"
                            style={{
                              background:
                                "linear-gradient(to right, #605056, #605056cc)",
                              color: "#FFFFFF",
                            }}
                          >
                            {dateInfo.day}
                          </td>
                        ) : null}

                        <td
                          className="px-1 py-1 border border-[#3A3A3A] whitespace-nowrap text-center"
                          style={{
                            backgroundColor: isDaylightShift
                              ? `rgba(240, 249, 255, 0.95)`
                              : `rgba(${parseInt(shiftColor.slice(1, 3), 16)}, ${parseInt(shiftColor.slice(3, 5), 16)}, ${parseInt(shiftColor.slice(5, 7), 16)}, 0.25)`,
                            color: isDaylightShift ? "#000000" : shiftColor,
                            textShadow: isDaylightShift
                              ? "none"
                              : "0 0 8px rgba(0, 0, 0, 0.7)",
                            fontWeight: "bold",
                          }}
                        >
                          <span
                            className={`text-[10px] whitespace-nowrap ${isDaylightShift ? "text-black" : ""}`}
                          >
                            {formatShiftTime(shift)}
                          </span>
                        </td>

                        {machines.map((machine) => {
                          const cellValue = getCellValue(
                            dateInfo.date,
                            dateInfo.day,
                            shift,
                            machine,
                          );
                          const operatorColor = cellValue
                            ? getOperatorColor(cellValue)
                            : "";
                          const textColor = cellValue
                            ? getContrastTextColor(operatorColor)
                            : "";

                          const isHighlighted = shouldHighlightCell(cellValue);

                          return (
                            <td
                              key={`${dateInfo.date}-${shift}-${machine}`}
                              className={`px-1 py-1 text-center border border-[#3A3A3A] text-[11px] ${isHighlighted ? "relative" : ""}`}
                            >
                              <div
                                className="px-1 py-0.5 rounded whitespace-nowrap"
                                style={{
                                  backgroundColor: cellValue
                                    ? operatorColor
                                    : "transparent",
                                  color: cellValue
                                    ? textColor
                                    : isDaylightShift
                                      ? "#4A4A4A"
                                      : "#86868B",
                                }}
                              >
                                {cellValue || "—"}
                              </div>
                              {isHighlighted && (
                                <div
                                  className="absolute inset-0 rounded border-2 pointer-events-none"
                                  style={{
                                    borderColor: cellValue
                                      ? getContrastTextColor(operatorColor) ===
                                        "#FFFFFF"
                                        ? "#FFFFFF"
                                        : "#000000"
                                      : "#FFFFFF",
                                    animation:
                                      "pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                                    boxShadow:
                                      "0 0 15px 4px rgba(103, 232, 249, 0.8)",
                                  }}
                                ></div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StoryComponent() {
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

  const mockOperators = ["Adis", "Munib", "Sanin", "Farik", "Harun", "Almedin", "Enes"];

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">Default State</h2>
      <MainComponent
        weekNumber={1}
        year={2025}
        dateRange="Jan 1 - Jan 7 2025"
        initialData={mockData}
        initialOperators={mockOperators}
      />

      <h2 className="text-xl font-semibold text-white mb-4">Loading State</h2>
      <MainComponent isLoading={true} />

      <h2 className="text-xl font-semibold text-white mb-4">Error State</h2>
      <MainComponent error="Failed to load schedule data. Please try again later." />

      <h2 className="text-xl font-semibold text-white mb-4">Empty State</h2>
      <MainComponent
        weekNumber={2}
        year={2025}
        dateRange="Jan 8 - Jan 14 2025"
        initialData={[]}
        initialOperators={[]}
      />
    </div>
  );
});
}