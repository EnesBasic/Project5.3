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
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [colorPickerTarget, setColorPickerTarget] = React.useState(null);
  const [newOperatorName, setNewOperatorName] = React.useState("");
  const [newOperatorColor, setNewOperatorColor] = React.useState("#4a9eff");
  const [showOperatorManager, setShowOperatorManager] = React.useState(false);
  const [editingOperator, setEditingOperator] = React.useState(null);
  const [editedOperatorName, setEditedOperatorName] = React.useState("");
  const [operatorError, setOperatorError] = React.useState(null);
  const [shiftError, setShiftError] = React.useState(null);
  const [shiftColors, setShiftColors] = React.useState({
    "08.00-16.00": "#4a9eff",
    "21.00-05.00": "#8b5cf6",
  });
  const [showShiftColorManager, setShowShiftColorManager] =
    React.useState(false);
  const [editingShiftColor, setEditingShiftColor] = React.useState(null);
  const [draggedOperator, setDraggedOperator] = React.useState(null);
  const [dragTarget, setDragTarget] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showSearch, setShowSearch] = React.useState(false);
  const [highlightedOperator, setHighlightedOperator] = React.useState(null);
  const [newShiftTime, setNewShiftTime] = React.useState("");
  const [editingShift, setEditingShift] = React.useState(null);
  const [editedShiftTime, setEditedShiftTime] = React.useState("");
  const [scheduleData, setScheduleData] = React.useState(initialData);
  const [isEditing, setIsEditing] = React.useState(false);
  const [operators, setOperators] = React.useState([]);
  const [operatorColors, setOperatorColors] = React.useState({});
  const [activeDropdown, setActiveDropdown] = React.useState(null);
  const [shifts, setShifts] = React.useState(["08.00-16.00", "21.00-05.00"]);
  const [showMachineManager, setShowMachineManager] = React.useState(false);
  const [newMachineName, setNewMachineName] = React.useState("");
  const [editingMachine, setEditingMachine] = React.useState(null);
  const [editedMachineName, setEditedMachineName] = React.useState("");
  const [showFilterPanel, setShowFilterPanel] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState("");
  const [shiftFilter, setShiftFilter] = React.useState("");
  const [operatorFilter, setOperatorFilter] = React.useState("");
  const [machineFilter, setMachineFilter] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState(0);

  const resetFilters = () => {
    setDateFilter("");
    setShiftFilter("");
    setOperatorFilter("");
    setMachineFilter("");
  };

  const shouldDisplayRow = (dateInfo, shift) => {
    if (!dateFilter && !shiftFilter && !operatorFilter && !machineFilter) {
      return true;
    }
    if (dateFilter && dateInfo.date !== dateFilter) {
      return false;
    }
    if (shiftFilter && shift !== shiftFilter) {
      return false;
    }
    if (operatorFilter || machineFilter) {
      if (machineFilter) {
        if (operatorFilter) {
          const cellValue = getCellValue(
            dateInfo.date,
            dateInfo.day,
            shift,
            machineFilter,
          );
          return cellValue === operatorFilter;
        }
      }
      if (operatorFilter && !machineFilter) {
        return machines.some((machine) => {
          const cellValue = getCellValue(
            dateInfo.date,
            dateInfo.day,
            shift,
            machine,
          );
          return cellValue === operatorFilter;
        });
      }
    }
    return true;
  };

  const getFilteredData = () => {
    if (!dateFilter && !shiftFilter && !operatorFilter && !machineFilter) {
      return null;
    }
    const filteredDataMap = {};
    weekDates.forEach((dateInfo) => {
      shifts.forEach((shift) => {
        if (shouldDisplayRow(dateInfo, shift)) {
          if (!filteredDataMap[dateInfo.date]) {
            filteredDataMap[dateInfo.date] = {
              day: dateInfo.day,
              shifts: {},
            };
          }
          if (!filteredDataMap[dateInfo.date].shifts[shift]) {
            filteredDataMap[dateInfo.date].shifts[shift] = {};
            machines.forEach((machine) => {
              const cellValue = getCellValue(
                dateInfo.date,
                dateInfo.day,
                shift,
                machine,
              );
              if (!operatorFilter || cellValue === operatorFilter) {
                if (cellValue) {
                  filteredDataMap[dateInfo.date].shifts[shift][machine] =
                    cellValue;
                }
              }
            });
          }
        }
      });
    });
    return Object.keys(filteredDataMap).map((date) => ({
      date,
      day: filteredDataMap[date].day,
      shifts: Object.keys(filteredDataMap[date].shifts).map((shift) => ({
        time: shift,
        operators: filteredDataMap[date].shifts[shift],
      })),
    }));
  };

  React.useEffect(() => {
    let count = 0;
    if (dateFilter) count++;
    if (shiftFilter) count++;
    if (operatorFilter) count++;
    if (machineFilter) count++;
    setActiveFilters(count);
  }, [dateFilter, shiftFilter, operatorFilter, machineFilter]);

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
    "#7FFFD4",
    "#000080",
    "#2E8B57",
    "#A52A2A",
    "#6A5ACD",
    "#708090",
    "#BDB76B",
    "#F4A460",
    "#CD853F",
    "#20B2AA",
    "#9932CC",
    "#8FBC8F",
    "#E9967A",
    "#F08080",
    "#3CB371",
    "#BC8F8F",
    "#4682B4",
    "#D2691E",
    "#DB7093",
    "#556B2F",
    "#B22222",
    "#DAA520",
    "#C0C0C0",
    "#808080",
    "#D3D3D3",
    "#191970",
    "#006400",
    "#8B0000",
  ];

  React.useEffect(() => {
    setScheduleData(initialData);
  }, [initialData]);

  React.useEffect(() => {
    setSelectedWeek({
      weekNumber,
      year,
      dateRange,
    });
  }, [weekNumber, year, dateRange]);

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

  React.useEffect(() => {
    if (Object.keys(shiftColors).length > 0) {
      setShifts(Object.keys(shiftColors));
    }
  }, [shiftColors]);

  React.useEffect(() => {
    const generatedWeeks = generateWeeksForYear(year);
    setAllWeeks(generatedWeeks);
  }, [year]);

  const dayAbbreviations = {
    Monday: "P",
    Tuesday: "U",
    Wednesday: "S",
    Thursday: "Č",
    Friday: "P",
    Saturday: "S",
    Sunday: "N",
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [machinesList, setMachinesList] = React.useState([
    "M58-J-467",
    "M53-E-929",
    "A35-J-924",
  ]);
  const [machineColors, setMachineColors] = React.useState({
    "M58-J-467": "#FF8C00",
    "M53-E-929": "#4682B4",
    "A35-J-924": "#32CD32",
  });
  const [newMachineColor, setNewMachineColor] = React.useState("#FF8C00");
  const [editingMachineColor, setEditingMachineColor] = React.useState(null);
  const [machineError, setMachineError] = React.useState(null);
  const [showHelpModal, setShowHelpModal] = React.useState(false);
  const machines = machinesList;

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

  const monthNameMap = {
    Jan: "januar",
    Feb: "februar",
    Mar: "mart",
    Apr: "april",
    May: "maj",
    Jun: "jun",
    Jul: "jul",
    Aug: "august",
    Sep: "septembar",
    Oct: "oktobar",
    Nov: "novembar",
    Dec: "decembar",
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
    Dec: "Dec",
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

  const handleDodajOperator = () => {
    setOperatorError(null);
    if (newOperatorName.trim() === "") {
      setOperatorError({
        type: "warning",
        message: "Ime operatora ne može biti prazno!",
      });
      return;
    }
    if (operators.includes(newOperatorName.trim())) {
      setOperatorError({
        type: "error",
        message:
          "Operator sa ovim imenom već postoji! Molimo koristite drugo ime.",
      });
      return;
    }
    const newOperator = newOperatorName.trim();
    const updatedOperators = [...operators, newOperator];
    setOperators(updatedOperators);
    setOperatorColors((prev) => ({
      ...prev,
      [newOperator]: newOperatorColor,
    }));
    setNewOperatorName("");
    setNewOperatorColor("#4a9eff");
  };

  const handleRemoveOperator = (operatorToRemove) => {
    setOperators(operators.filter((operator) => operator !== operatorToRemove));
    setOperatorColors((prev) => {
      const newColors = { ...prev };
      delete newColors[operatorToRemove];
      return newColors;
    });
  };

  const handleEditOperator = (operator) => {
    setEditingOperator(operator);
    setEditedOperatorName(operator);
  };

  const handleSaveOperatorEdit = () => {
    setOperatorError(null);
    if (editedOperatorName.trim() === "") {
      setOperatorError({
        type: "warning",
        message: "Ime operatora ne može biti prazno!",
      });
      return;
    }
    if (
      editedOperatorName !== editingOperator &&
      operators.includes(editedOperatorName.trim())
    ) {
      setOperatorError({
        type: "error",
        message:
          "Operator sa ovim imenom već postoji! Molimo koristite drugo ime.",
      });
      return;
    }
    if (
      editedOperatorName.trim() !== "" &&
      (editedOperatorName === editingOperator ||
        !operators.includes(editedOperatorName.trim()))
    ) {
      const updatedOperators = operators.map((op) =>
        op === editingOperator ? editedOperatorName.trim() : op,
      );
      setOperators(updatedOperators);
      if (editedOperatorName !== editingOperator) {
        setOperatorColors((prev) => {
          const newColors = { ...prev };
          newColors[editedOperatorName] = newColors[editingOperator];
          delete newColors[editingOperator];
          return newColors;
        });
        setScheduleData((prevData) => {
          return prevData.map((dayEntry) => {
            return {
              ...dayEntry,
              shifts: dayEntry.shifts.map((shift) => {
                const updatedOperators = {};
                for (const machine in shift.operators) {
                  updatedOperators[machine] =
                    shift.operators[machine] === editingOperator
                      ? editedOperatorName
                      : shift.operators[machine];
                }
                return {
                  ...shift,
                  operators: updatedOperators,
                };
              }),
            };
          });
        });
      }
      setEditingOperator(null);
    }
  };

  const handleCancelOperatorEdit = () => {
    setEditingOperator(null);
    setEditedOperatorName("");
  };

  const handleColorChange = (operator, color) => {
    if (operator === "new") {
      setNewOperatorColor(color);
    } else {
      const updatedColors = { ...operatorColors };
      updatedColors[operator] = color;
      setOperatorColors(updatedColors);
    }
  };

  const handleShiftColorChange = (shift, color) => {
    setShiftColors((prev) => ({
      ...prev,
      [shift]: color,
    }));
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

  const formatDropdownText = (weekNum, dateRangeStr) => {
    const formattedDateRange = formatDateToNumeric(dateRangeStr);
    return `${weekNum}:${formattedDateRange}`;
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
      const date = new Date(
        year,
        parseInt(startMonth, 10) - 1,
        startDay + index,
      );
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}.${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;
      return {
        date: formattedDate,
        day: dayAbbreviations[day],
      };
    });
  };

  const handleCellChange = (date, day, shift, machine, value) => {
    setScheduleData((prevData) => {
      const dayEntry = prevData.find(
        (entry) => entry.date === date && entry.day === day,
      );
      if (dayEntry) {
        const shiftEntry = dayEntry.shifts.find((s) => s.time === shift);
        if (shiftEntry) {
          const updatedShifts = dayEntry.shifts.map((s) => {
            if (s.time === shift) {
              return {
                ...s,
                operators: {
                  ...s.operators,
                  [machine]: value,
                },
              };
            }
            return s;
          });
          return prevData.map((entry) =>
            entry.date === date && entry.day === day
              ? { ...entry, shifts: updatedShifts }
              : entry,
          );
        } else {
          const newShift = {
            time: shift,
            operators: {
              [machine]: value,
            },
          };
          machines.forEach((m) => {
            if (m !== machine) {
              newShift.operators[m] = "";
            }
          });
          return prevData.map((entry) =>
            entry.date === date && entry.day === day
              ? { ...entry, shifts: [...entry.shifts, newShift] }
              : entry,
          );
        }
      } else {
        const newShift = {
          time: shift,
          operators: {
            [machine]: value,
          },
        };
        machines.forEach((m) => {
          if (m !== machine) {
            newShift.operators[m] = "";
          }
        });
        const newEntry = {
          date,
          day,
          shifts: [newShift],
        };
        return [...prevData, newEntry];
      }
    });
  };

  const handleShiftChange = (date, day, oldShift, newShift) => {
    setScheduleData((prevData) => {
      const dayEntry = prevData.find(
        (entry) => entry.date === date && entry.day === day,
      );
      if (dayEntry) {
        const shiftEntry = dayEntry.shifts.find((s) => s.time === oldShift);
        if (shiftEntry) {
          const updatedShifts = dayEntry.shifts.map((s) => {
            if (s.time === oldShift) {
              return {
                ...s,
                time: newShift,
              };
            }
            return s;
          });
          return prevData.map((entry) =>
            entry.date === date && entry.day === day
              ? { ...entry, shifts: updatedShifts }
              : entry,
          );
        }
      }
      return prevData;
    });
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

  const handleSave = () => {
    onSačuvaj({
      weekNumber: selectedWeek.weekNumber,
      year: selectedWeek.year,
      dateRange: selectedWeek.dateRange,
      entries: scheduleData,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setScheduleData(initialData);
    setIsEditing(false);
    onCancel();
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

  const formattedDropdownDate = formatDateToNumeric(selectedWeek.dateRange);
  const formattedHeaderDate = formatHeaderDate(selectedWeek.dateRange);
  const weekDates = generateDatesForWeek(selectedWeek.dateRange);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showColorPicker && !event.target.closest(".color-picker-container")) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

  const handleDragStart = (operator) => {
    setDraggedOperator(operator);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedOperator(null);
    setDragTarget(null);
  };

  const handleDragEnter = (date, day, shift, machine) => {
    if (draggedOperator) {
      setDragTarget({ date, day, shift, machine });
    }
  };

  const handleDrop = () => {
    if (draggedOperator && dragTarget) {
      const { date, day, shift, machine } = dragTarget;
      handleCellChange(date, day, shift, machine, draggedOperator);
      setDraggedOperator(null);
      setDragTarget(null);
      setIsDragging(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      setHighlightedOperator(null);
    } else {
      const matchedOperator = operators.find((op) =>
        op.toLowerCase().includes(term.toLowerCase()),
      );
      setHighlightedOperator(matchedOperator || null);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setHighlightedOperator(null);
  };

  const shouldHighlightCell = (operator) => {
    if (!highlightedOperator) return false;
    return operator === highlightedOperator;
  };

  return (
    <div>
      <BinBin
        weekNumber={selectedWeek.weekNumber}
        year={selectedWeek.year}
        dateRange={selectedWeek.dateRange}
        onSačuvaj={onSačuvaj}
        onCancel={onCancel}
        initialData={initialData}
        isLoading={isLoading}
        error={error}
        availableWeeks={allWeeks}
        onWeekChange={onWeekChange}
        initialOperators={initialOperators}
        onBack={onBack}
        renderCustomHeader={(defaultHeader) => {
          return (
            <div className="p-3 bg-[#2A2A2A] border-b border-[#3A3A3A]">
              <div className="flex items-center justify-center">
                <div className="flex-grow text-center">
                  <h2 className="text-lg font-bold bg-gradient-to-r from-[#4a9eff] to-[#67e8f9] text-transparent bg-clip-text px-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] filter-none transform scale-105 transition-transform duration-300">
                    {formattedHeaderDate}
                  </h2>
                  <div className="h-0.5 w-32 bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40 mx-auto mt-1 rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          );
        }}
        renderCustomButtonSection={(defaultButtonSection) => {
          const backButton = (
            <button
              onClick={onBack}
              className="bg-[#3A3A3A] text-[#67e8f9] border border-[#3A3A3A] h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center"
              title="Nazad"
            >
              <i className="fas fa-arrow-left text-sm"></i>
            </button>
          );

          const weekSelector = (
            <div className="flex flex-col ml-2">
              <div className="relative inline-block w-auto">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-between text-xs"
                  style={{ minWidth: "110px" }}
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

              <div className="flex w-full mt-1">
                <button
                  onClick={handlePreviousWeek}
                  className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded-l px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-center text-xs hover:bg-[#3A3A3A] transition-colors flex-1"
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

                <button
                  onClick={handleNextWeek}
                  className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded-r px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-center text-xs hover:bg-[#3A3A3A] transition-colors flex-1 border-l-0"
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
            </div>
          );

          return (
            <div className="p-1 bg-[#2A2A2A] border-b border-[#3A3A3A] flex items-center justify-between">
              <div className="flex items-center">
                {backButton}
                {weekSelector}
              </div>

              <div className="flex space-x-2">
                {defaultButtonSection.props.children[2]}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

  return (
    <div>
      <MainComponent />
    </div>
  );
});
}