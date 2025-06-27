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
  // Function to generate all weeks of a year
  const generateWeeksForYear = (year) => {
    const weeks = [];
    
    // Start with January 1st of the year
    const firstDayOfYear = new Date(year, 0, 1);
    
    // Create the first week starting from January 1st
    // This ensures week 1 is always included regardless of what day of the week Jan 1 falls on
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
  
  // Dodaj state for all weeks
  const [allWeeks, setAllWeeks] = React.useState([]);
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
  const [selectedWeek, setSelectedWeek] = React.useState({
    weekNumber,
    year,
    dateRange,
  });
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [operators, setOperators] = React.useState([]);
  const [operatorColors, setOperatorColors] = React.useState({});
  const [activeDropdown, setActiveDropdown] = React.useState(null);
  const [shifts, setShifts] = React.useState(["08.00-16.00", "21.00-05.00"]);
  const [showMachineManager, setShowMachineManager] = React.useState(false);
  const [newMachineName, setNewMachineName] = React.useState("");
  const [editingMachine, setEditingMachine] = React.useState(null);
  const [editedMachineName, setEditedMachineName] = React.useState("");
  
  // Filter states
  const [showFilterPanel, setShowFilterPanel] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState("");
  const [shiftFilter, setShiftFilter] = React.useState("");
  const [operatorFilter, setOperatorFilter] = React.useState("");
  const [machineFilter, setMachineFilter] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState(0);
  
  // Function to reset all filters
  const resetFilters = () => {
    setDateFilter("");
    setShiftFilter("");
    setOperatorFilter("");
    setMachineFilter("");
  };
  
  // Function to check if a row should be displayed based on filters
  const shouldDisplayRow = (dateInfo, shift) => {
    // If no filters are active, show everything
    if (!dateFilter && !shiftFilter && !operatorFilter && !machineFilter) {
      return true;
    }
    
    // Date filter
    if (dateFilter && dateInfo.date !== dateFilter) {
      return false;
    }
    
    // Shift filter
    if (shiftFilter && shift !== shiftFilter) {
      return false;
    }
    
    // Machine and operator filters need to check cell values
    if (operatorFilter || machineFilter) {
      // For machine filter, we only need to check if this machine is being filtered
      if (machineFilter) {
        // If we're also filtering by operator, we need to check if this operator is assigned to this machine
        if (operatorFilter) {
          const cellValue = getCellValue(dateInfo.date, dateInfo.day, shift, machineFilter);
          return cellValue === operatorFilter;
        }
        // Otherwise, we don't need special handling as machines are columns
      }
      
      // For operator filter without machine filter, check all machines
      if (operatorFilter && !machineFilter) {
        // Check if any machine has this operator for this date and shift
        return machines.some(machine => {
          const cellValue = getCellValue(dateInfo.date, dateInfo.day, shift, machine);
          return cellValue === operatorFilter;
        });
      }
    }
    
    return true;
  };
  
  // Function to get filtered data for compact display
  const getFilteredData = () => {
    if (!dateFilter && !shiftFilter && !operatorFilter && !machineFilter) {
      return null; // Return null to use the regular display
    }
    
    // Create a map to store filtered data by date
    const filteredDataMap = {};
    
    // First, collect all matching rows
    weekDates.forEach(dateInfo => {
      shifts.forEach(shift => {
        if (shouldDisplayRow(dateInfo, shift)) {
          if (!filteredDataMap[dateInfo.date]) {
            filteredDataMap[dateInfo.date] = {
              day: dateInfo.day,
              shifts: {}
            };
          }
          
          // Store shift data
          if (!filteredDataMap[dateInfo.date].shifts[shift]) {
            filteredDataMap[dateInfo.date].shifts[shift] = {};
            
            // For each machine, check if it has the filtered operator
            machines.forEach(machine => {
              const cellValue = getCellValue(dateInfo.date, dateInfo.day, shift, machine);
              
              // Only include if it matches operator filter or if no operator filter
              if (!operatorFilter || cellValue === operatorFilter) {
                if (cellValue) {
                  filteredDataMap[dateInfo.date].shifts[shift][machine] = cellValue;
                }
              }
            });
          }
        }
      });
    });
    
    // Convert the map to an array format
    return Object.keys(filteredDataMap).map(date => ({
      date,
      day: filteredDataMap[date].day,
      shifts: Object.keys(filteredDataMap[date].shifts).map(shift => ({
        time: shift,
        operators: filteredDataMap[date].shifts[shift]
      }))
    }));
  };
  
  // Update the count of active filters whenever filters change
  React.useEffect(() => {
    let count = 0;
    if (dateFilter) count++;
    if (shiftFilter) count++;
    if (operatorFilter) count++;
    if (machineFilter) count++;
    setActiveFilters(count);
  }, [dateFilter, shiftFilter, operatorFilter, machineFilter]);

  const distinctColors = [
    "#FFFFFF", // White (added)
    "#000000", // Black (added)
    "#FF0000", // Red
    "#00FF00", // Lime
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
    "#008000", // Green
    "#FF4500", // OrangeRed
    "#4B0082", // Indigo
    "#FF1493", // DeepPink
    "#00CED1", // DarkTurquoise
    "#8B4513", // SaddleBrown
    "#FF8C00", // DarkOrange
    "#9400D3", // DarkViolet
    "#32CD32", // LimeGreen
    "#DC143C", // Crimson
    "#7FFFD4", // Aquamarine
    "#000080", // Navy
    "#2E8B57", // SeaGreen
    "#A52A2A", // Brown
    "#6A5ACD", // SlateBlue
    "#708090", // SlateGray
    "#BDB76B", // DarkKhaki
    "#F4A460", // SandyBrown
    "#CD853F", // Peru
    "#20B2AA", // LightSeaGreen
    "#9932CC", // DarkOrchid
    "#8FBC8F", // DarkSeaGreen
    "#E9967A", // DarkSalmon
    "#F08080", // LightCoral
    "#3CB371", // MediumSeaGreen
    "#BC8F8F", // RosyBrown
    "#4682B4", // SteelBlue
    "#D2691E", // Chocolate
    "#DB7093", // PaleVioletRed
    "#556B2F", // DarkOliveGreen
    "#B22222", // FireBrick
    "#DAA520", // GoldenRod
    "#C0C0C0", // Silver (added)
    "#808080", // Gray (added)
    "#D3D3D3", // LightGray (added)
    "#191970", // MidnightBlue (added)
    "#006400", // DarkGreen (added)
    "#8B0000", // DarkRed (added)
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
  
  // Initialize all weeks when component mounts or year changes
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
  const [machinesList, setMachinesList] = React.useState(["M58-J-467", "M53-E-929", "A35-J-924"]);
  const [machineColors, setMachineColors] = React.useState({
    "M58-J-467": "#FF8C00",
    "M53-E-929": "#4682B4",
    "A35-J-924": "#32CD32"
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

  // Dodaj Bosnian month abbreviations
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
    // Reset any previous error
    setOperatorError(null);
    
    // Check if operator name is empty
    if (newOperatorName.trim() === "") {
      setOperatorError({
        type: "warning",
        message: "Ime operatora ne može biti prazno!"
      });
      return;
    }
    
    // Check if operator already exists
    if (operators.includes(newOperatorName.trim())) {
      setOperatorError({
        type: "error",
        message: "Operator sa ovim imenom već postoji! Molimo koristite drugo ime."
      });
      return;
    }
    
    // If we get here, we can add the operator
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
    // Reset any previous error
    setOperatorError(null);
    
    // Check if edited name is empty
    if (editedOperatorName.trim() === "") {
      setOperatorError({
        type: "warning",
        message: "Ime operatora ne može biti prazno!"
      });
      return;
    }
    
    // Check if operator name already exists (and it's not the current one being edited)
    if (editedOperatorName !== editingOperator && operators.includes(editedOperatorName.trim())) {
      setOperatorError({
        type: "error",
        message: "Operator sa ovim imenom već postoji! Molimo koristite drugo ime."
      });
      return;
    }
    
    if (
      editedOperatorName.trim() !== "" &&
      (editedOperatorName === editingOperator ||
        !operators.includes(editedOperatorName.trim()))
    ) {
      // Update operators list
      const updatedOperators = operators.map((op) =>
        op === editingOperator ? editedOperatorName.trim() : op,
      );
      setOperators(updatedOperators);

      // Update operator colors
      if (editedOperatorName !== editingOperator) {
        setOperatorColors((prev) => {
          const newColors = { ...prev };
          newColors[editedOperatorName] = newColors[editingOperator];
          delete newColors[editingOperator];
          return newColors;
        });

        // Update schedule data with new operator name
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
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}`;
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
    onSave({
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
        
        .operator-drag-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background-color: #2A2A2A;
          border-top: 1px solid #3A3A3A;
          padding: 0.75rem;
          box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        /* Custom scrollbar styles for the operator list */
        .operator-list-container::-webkit-scrollbar {
          width: 10px;
          height: 10px;
          display: block;
        }
        
        .operator-list-container::-webkit-scrollbar-track {
          background: #1D1D1F;
          border-radius: 4px;
        }
        
        .operator-list-container::-webkit-scrollbar-thumb {
          background: #4A4A4A;
          border-radius: 4px;
          border: 1px solid #67e8f9;
        }
        
        .operator-list-container::-webkit-scrollbar-thumb:hover {
          background: #67e8f9;
        }
        
        /* For Firefox */
        .operator-list-container {
          scrollbar-width: thin;
          scrollbar-color: #67e8f9 #1D1D1F;
        }
        
        /* Make sure the scrollbar is always visible */
        .operator-list-container::-webkit-scrollbar {
          visibility: visible !important;
          opacity: 1 !important;
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
        <>
          <div className="p-3 bg-[#2A2A2A] border-b border-[#3A3A3A]">
            <div className="flex items-center justify-between">
              {/* Week selector on left */}
              <div className="flex flex-col items-center">
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
              
              {/* Date range in center */}
              <div className="flex-grow text-center">
                <h2 className="text-lg font-bold bg-gradient-to-r from-[#4a9eff] to-[#67e8f9] text-transparent bg-clip-text px-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] filter-none transform scale-105 transition-transform duration-300">
                  {formattedHeaderDate}
                </h2>
                <div className="h-0.5 w-32 bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40 mx-auto mt-1 rounded-full shadow-sm"></div>
              </div>
              
              {/* Empty space where edit button was */}
              <div className="w-8"></div>
            </div>
          </div>

          {/* New button section with integrated search */}
          <div className="p-1 bg-[#2A2A2A] border-b border-[#3A3A3A] flex items-center justify-between">
            <button
              onClick={() => {
                setShowSearch(false);
                onBack();
              }}
              className={`bg-[#3A3A3A] text-[#67e8f9] border border-[#3A3A3A] h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center`}
              title="Nazad"
            >
              <i className="fas fa-arrow-left text-sm"></i>
            </button>
            
            {showSearch ? (
              <div className="relative flex-grow mx-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Pretraži operatore..."
                  className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-3 py-1 pl-8 w-full text-xs focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent h-7"
                  autoFocus
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86868B] text-xs"></i>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#86868B] hover:text-white"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                )}
                
                {highlightedOperator && (
                  <div
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 px-2 py-0.5 rounded text-[10px] z-10"
                    style={{
                      backgroundColor: getOperatorColor(highlightedOperator),
                      color: getContrastTextColor(
                        getOperatorColor(highlightedOperator)
                      ),
                    }}
                  >
                    {highlightedOperator}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2 flex-grow justify-center">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        setShowSearch(false);
                        handleSave();
                      }}
                      className="bg-gradient-to-r from-[#22c55e]/80 to-[#22c55e]/60 text-white h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center border border-[#22c55e]/30"
                      title="Sačuvaj"
                    >
                      <i className="fas fa-save text-sm"></i>
                    </button>
                    <button
                      onClick={() => {
                        setShowSearch(false);
                        handleCancel();
                      }}
                      className="bg-gradient-to-r from-[#ef4444]/80 to-[#ef4444]/60 text-white h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center border border-[#ef4444]/30"
                      title="Otkaži"
                    >
                      <i className="fas fa-times text-sm"></i>
                    </button>
                  </>
                ) : null}
              </div>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowSearch(false);
                  setShowFilterPanel(!showFilterPanel);
                }}
                className={`${showFilterPanel || activeFilters > 0 ? 'bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40' : 'bg-[#3A3A3A]'} text-[#67e8f9] border ${showFilterPanel || activeFilters > 0 ? 'border-[#67e8f9]/30' : 'border-[#3A3A3A]'} h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center relative`}
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
                onClick={() => setShowSearch(!showSearch)}
                className={`${showSearch ? 'bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40' : 'bg-[#3A3A3A]'} text-[#67e8f9] border ${showSearch ? 'border-[#67e8f9]/30' : 'border-[#3A3A3A]'} h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center`}
                title="Pretraži"
              >
                <i className="fas fa-search text-sm"></i>
              </button>
              
              <button
                onClick={() => {
                  setShowSearch(false);
                  setIsEditing(!isEditing);
                }}
                className={`${isEditing ? 'bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40' : 'bg-[#3A3A3A]'} text-[#67e8f9] border ${isEditing ? 'border-[#67e8f9]/30' : 'border-[#3A3A3A]'} h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center`}
                title={isEditing ? "Otkaži Uređivanje" : "Uredi"}
              >
                <i className={`fas fa-${isEditing ? 'times' : 'edit'} text-sm`}></i>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="p-3 bg-[#2A2A2A] border-b border-[#3A3A3A]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-[#67e8f9]">Opcije Filtera</h3>
                <button 
                  onClick={resetFilters}
                  className="text-xs text-[#67e8f9] hover:text-white"
                >
                  Poništi Sve Filtere
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Date Filter */}
                <div>
                  <label className="block text-white text-xs mb-1">Datum</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-2 py-1.5 w-full text-xs focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent"
                  >
                    <option value="">Svi Datumi</option>
                    {weekDates.map((date) => (
                      <option key={date.date} value={date.date}>
                        {date.date} ({date.day})
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Shift Filter */}
                <div>
                  <label className="block text-white text-xs mb-1">Smjena</label>
                  <select
                    value={shiftFilter}
                    onChange={(e) => setShiftFilter(e.target.value)}
                    className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-2 py-1.5 w-full text-xs focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent"
                  >
                    <option value="">Sve Smjene</option>
                    {shifts.map((shift) => (
                      <option key={shift} value={shift}>
                        {formatShiftTime(shift)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Operator Filter */}
                <div>
                  <label className="block text-white text-xs mb-1">Operator</label>
                  <select
                    value={operatorFilter}
                    onChange={(e) => setOperatorFilter(e.target.value)}
                    className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-2 py-1.5 w-full text-xs focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent"
                  >
                    <option value="">Svi Operatori</option>
                    {operators.map((operator) => (
                      <option key={operator} value={operator}>
                        {operator}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Machine Filter */}
                <div>
                  <label className="block text-white text-xs mb-1">Vozilo</label>
                  <select
                    value={machineFilter}
                    onChange={(e) => setMachineFilter(e.target.value)}
                    className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-2 py-1.5 w-full text-xs focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent"
                  >
                    <option value="">Sva Vozila</option>
                    {machines.map((machine) => (
                      <option key={machine} value={machine}>
                        {machine}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {activeFilters > 0 && (
                <div className="mt-3 p-2 bg-[#1D1D1F] rounded text-xs text-[#67e8f9]">
                  <span className="font-medium">Aktivni Filteri: </span>
                  {dateFilter && <span className="mr-2">Datum: {dateFilter}</span>}
                  {shiftFilter && <span className="mr-2">Smjena: {formatShiftTime(shiftFilter)}</span>}
                  {operatorFilter && <span className="mr-2">Operator: {operatorFilter}</span>}
                  {machineFilter && <span className="mr-2">Vozilo: {machineFilter}</span>}
                </div>
              )}
            </div>
          )}
          
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
                        fontWeight: "bold"
                      }}
                    >
                      {machine}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Check if we have active filters */}
                {activeFilters > 0 ? (
                  // Filtered view with compact display
                  getFilteredData()?.map((dateEntry) => (
                    <React.Fragment key={dateEntry.date}>
                      {dateEntry.shifts.map((shiftEntry, shiftIndex) => {
                        const isDaylightShift = shiftEntry.time.includes("08.00");
                        const shiftColor = getShiftColor(shiftEntry.time);
                        
                        // Get all machines that have operators assigned
                        const activeMachines = Object.keys(shiftEntry.operators).filter(
                          machine => shiftEntry.operators[machine]
                        );
                        
                        // If no machines have operators assigned, don't show this shift
                        if (activeMachines.length === 0) return null;
                        
                        return (
                          <tr
                            key={`${dateEntry.date}-${shiftEntry.time}`}
                            className={`
                              ${shiftIndex === dateEntry.shifts.length - 1 ? "border-b-2 border-[#3A3A3A]" : ""}
                              ${dateEntry.day === "S" || dateEntry.day === "N" ? "bg-[#2A2A2A]/30" : ""}
                            `}
                            style={{
                              backgroundColor: isDaylightShift
                                ? "#FFFFFF"
                                : `${shiftColor}15`,
                            }}
                          >
                            {shiftIndex === 0 ? (
                              <td
                                rowSpan={dateEntry.shifts.length}
                                className="px-2 py-1 font-medium text-center align-middle border border-[#3A3A3A] text-xs"
                                style={{
                                  background:
                                    "linear-gradient(to right, #817063, #817063cc)",
                                  color: "#FFFFFF",
                                }}
                              >
                                {dateEntry.date}
                              </td>
                            ) : null}

                            {shiftIndex === 0 ? (
                              <td
                                rowSpan={dateEntry.shifts.length}
                                className="px-1 py-1 font-bold text-center align-middle border border-[#3A3A3A] text-xs"
                                style={{
                                  background:
                                    "linear-gradient(to right, #605056, #605056cc)",
                                  color: "#FFFFFF",
                                }}
                              >
                                {dateEntry.day}
                              </td>
                            ) : null}

                            <td
                              className="px-1 py-1 border border-[#3A3A3A] whitespace-nowrap text-center"
                              style={{
                                backgroundColor: isDaylightShift 
                                  ? `rgba(240, 249, 255, 0.95)` 
                                  : `rgba(${parseInt(shiftColor.slice(1, 3), 16)}, ${parseInt(shiftColor.slice(3, 5), 16)}, ${parseInt(shiftColor.slice(5, 7), 16)}, 0.25)`,
                                color: isDaylightShift ? "#000000" : shiftColor,
                                textShadow: isDaylightShift ? "none" : "0 0 8px rgba(0, 0, 0, 0.7)",
                                fontWeight: "bold",
                              }}
                            >
                              <span
                                className={`text-[10px] whitespace-nowrap ${isDaylightShift ? "text-black" : ""}`}
                              >
                                {formatShiftTime(shiftEntry.time)}
                              </span>
                            </td>

                            {/* Only show machines that have the filtered operator */}
                            {machineFilter ? (
                              // If machine filter is active, only show that machine
                              <td
                                key={`${dateEntry.date}-${shiftEntry.time}-${machineFilter}`}
                                className="px-1 py-1 text-center border border-[#3A3A3A] text-[11px]"
                                colSpan={machines.length}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <span className="font-medium text-[#67e8f9]">{machineFilter}:</span>
                                  {shiftEntry.operators[machineFilter] ? (
                                    <div
                                      className="px-2 py-0.5 rounded whitespace-nowrap"
                                      style={{
                                        backgroundColor: getOperatorColor(shiftEntry.operators[machineFilter]),
                                        color: getContrastTextColor(getOperatorColor(shiftEntry.operators[machineFilter])),
                                      }}
                                    >
                                      {shiftEntry.operators[machineFilter]}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </div>
                              </td>
                            ) : (
                              // Otherwise show all machines with operators
                              <td
                                colSpan={machines.length}
                                className="px-1 py-1 text-center border border-[#3A3A3A] text-[11px]"
                              >
                                <div className="flex flex-wrap justify-center gap-2">
                                  {Object.entries(shiftEntry.operators).map(([machine, operator]) => {
                                    if (!operator) return null;
                                    
                                    const operatorColor = getOperatorColor(operator);
                                    const textColor = getContrastTextColor(operatorColor);
                                    const isHighlighted = shouldHighlightCell(operator);
                                    
                                    return (
                                      <div key={`${machine}-${operator}`} className="flex items-center relative">
                                        <span className="text-[10px] text-gray-300 mr-1">{machine}:</span>
                                        <div
                                          className="px-2 py-0.5 rounded whitespace-nowrap"
                                          style={{
                                            backgroundColor: operatorColor,
                                            color: textColor,
                                          }}
                                        >
                                          {operator}
                                        </div>
                                        {isHighlighted && (
                                          <div className="absolute inset-0 rounded border-2 pointer-events-none" 
                                            style={{
                                              borderColor: textColor === "#FFFFFF" ? "#FFFFFF" : "#000000",
                                              animation: "pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                                              boxShadow: "0 0 15px 4px rgba(103, 232, 249, 0.8)"
                                            }}
                                          ></div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))
                ) : (
                  // Regular view (unchanged)
                  weekDates.map((dateInfo, dateIndex) => (
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
                                textShadow: isDaylightShift ? "none" : "0 0 8px rgba(0, 0, 0, 0.7)",
                                fontWeight: "bold",
                              }}
                            >
                              {isEditing ? (
                                <select
                                  value={shift}
                                  onChange={(e) =>
                                    handleShiftChange(
                                      dateInfo.date,
                                      dateInfo.day,
                                      shift,
                                      e.target.value,
                                    )
                                  }
                                  className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-0.5 py-0.5 w-full text-[10px] focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent"
                                >
                                  {Object.keys(shiftColors).map((shiftOption) => (
                                    <option key={shiftOption} value={shiftOption}>
                                      {shiftOption}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span
                                  className={`text-[10px] whitespace-nowrap ${isDaylightShift ? "text-black" : ""}`}
                                >
                                  {formatShiftTime(shift)}
                                </span>
                              )}
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

                              const isDropTarget =
                                dragTarget &&
                                dragTarget.date === dateInfo.date &&
                                dragTarget.day === dateInfo.day &&
                                dragTarget.shift === shift &&
                                dragTarget.machine === machine;

                              const isHighlighted =
                                shouldHighlightCell(cellValue);

                              return (
                                <td
                                  key={`${dateInfo.date}-${shift}-${machine}`}
                                  className={`px-1 py-1 text-center border border-[#3A3A3A] text-[11px] 
                                    ${isDropTarget ? "ring-2 ring-[#67e8f9]" : ""}
                                    ${isHighlighted ? "relative" : ""}
                                  `}
                                  onDragEnter={() =>
                                    handleDragEnter(
                                      dateInfo.date,
                                      dateInfo.day,
                                      shift,
                                      machine,
                                    )
                                  }
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={handleDrop}
                                >
                                  {isEditing ? (
                                    <div className="relative">
                                      <div
                                        onClick={() =>
                                          setActiveDropdown(
                                            `${dateInfo.date}-${shift}-${machine}`,
                                          )
                                        }
                                        className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-2 py-1 w-full text-[11px] cursor-pointer flex justify-between items-center"
                                      >
                                        <span>{cellValue || "None"}</span>
                                        <i className="fas fa-chevron-down text-[8px] ml-1"></i>
                                      </div>

                                      {activeDropdown ===
                                        `${dateInfo.date}-${shift}-${machine}` && (
                                        <div className="absolute z-10 mt-1 w-full bg-[#1D1D1F] border border-[#3A3A3A] rounded shadow-lg max-h-32 overflow-y-auto">
                                          <div
                                            className="px-2 py-1 hover:bg-[#3A3A3A] cursor-pointer text-white text-xs"
                                            onClick={() => {
                                              handleCellChange(
                                                dateInfo.date,
                                                dateInfo.day,
                                                shift,
                                                machine,
                                                "",
                                              );
                                              setActiveDropdown(null);
                                            }}
                                          >
                                            None
                                          </div>
                                          {operators.map((operator) => (
                                            <div
                                              key={operator}
                                              className="px-2 py-1 hover:opacity-90 cursor-pointer text-xs flex items-center"
                                              style={{
                                                backgroundColor:
                                                  getOperatorColor(operator),
                                                color: getContrastTextColor(
                                                  getOperatorColor(operator),
                                                ),
                                              }}
                                              onClick={() => {
                                                handleCellChange(
                                                  dateInfo.date,
                                                  dateInfo.day,
                                                  shift,
                                                  machine,
                                                  operator,
                                                );
                                                setActiveDropdown(null);
                                              }}
                                            >
                                              {operator}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <>
                                      <div
                                        className={`px-1 py-0.5 rounded whitespace-nowrap ${isDragging ? "cursor-pointer" : ""}`}
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
                                        <div className="absolute inset-0 rounded border-2 pointer-events-none" 
                                          style={{
                                            borderColor: cellValue ? 
                                              (getContrastTextColor(operatorColor) === "#FFFFFF" ? "#FFFFFF" : "#000000") : 
                                              "#FFFFFF",
                                            animation: "pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                                            boxShadow: "0 0 15px 4px rgba(103, 232, 249, 0.8)"
                                          }}
                                        ></div>
                                      )}
                                    </>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between p-2">
            <button
              onClick={() => setShowOperatorManager(!showOperatorManager)}
              className="bg-[#3A3A3A] text-white font-medium px-3 py-1 rounded hover:bg-[#4A4A4A] transition-colors text-xs"
            >
              <i
                className={`fas fa-${showOperatorManager ? "chevron-up" : "chevron-down"} mr-1`}
              ></i>
              {showOperatorManager
                ? "Sakrij Operatori"
                : "Operatori"}
            </button>

            <button
              onClick={() => setShowShiftColorManager(!showShiftColorManager)}
              className="bg-[#3A3A3A] text-white font-medium px-3 py-1 rounded hover:bg-[#4A4A4A] transition-colors text-xs"
            >
              <i
                className={`fas fa-${showShiftColorManager ? "chevron-up" : "chevron-down"} mr-1`}
              ></i>
              {showShiftColorManager
                ? "Sakrij Smjene"
                : "Smjene"}
            </button>
            
            <button
              onClick={() => setShowMachineManager(!showMachineManager)}
              className="bg-[#3A3A3A] text-white font-medium px-3 py-1 rounded hover:bg-[#4A4A4A] transition-colors text-xs"
            >
              <i
                className={`fas fa-${showMachineManager ? "chevron-up" : "chevron-down"} mr-1`}
              ></i>
              {showMachineManager
                ? "Sakrij Vozila"
                : "Vozila"}
            </button>
          </div>

          {showOperatorManager && (
            <div className="mt-2 bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
              <div className="p-3 bg-[#2A2A2A] border-b border-[#3A3A3A]">
                <h3 className="text-sm font-bold text-[#67e8f9]">
                  Upravljanje Operatorima
                </h3>
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <h4 className="text-white text-sm mb-1.5">
                    Aktivni Operatori
                  </h4>
                  <div className="bg-[#2A2A2A] rounded overflow-hidden">
                    <table className="w-full text-sm text-left text-white border-collapse">
                      <thead className="text-xs uppercase bg-[#3A3A3A] text-[#67e8f9]">
                        <tr>
                          <th className="px-2 py-1.5 border border-[#4A4A4A]">
                            Ime Operatora
                          </th>
                          <th className="px-2 py-1.5 border border-[#4A4A4A] w-24">
                            Boja
                          </th>
                          <th className="px-2 py-1.5 border border-[#4A4A4A] w-20">
                            Radnje
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {operators.length > 0 ? (
                          operators.map((operator) => (
                            <tr
                              key={operator}
                              className="border-b border-[#4A4A4A]"
                            >
                              <td className="px-2 py-1.5 border border-[#4A4A4A]">
                                {editingOperator === operator ? (
                                  <input
                                    type="text"
                                    value={editedOperatorName}
                                    onChange={(e) =>
                                      setEditedOperatorName(e.target.value)
                                    }
                                    className={`bg-[#3A3A3A] text-white border ${operatorError ? (operatorError.type === "warning" ? "border-yellow-500" : "border-red-500") : "border-[#4A4A4A]"} rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent`}
                                    autoFocus
                                  />
                                ) : (
                                  operator
                                )}
                              </td>
                              <td className="px-2 py-1.5 border border-[#4A4A4A]">
                                <div className="flex items-center">
                                  <div
                                    className="h-5 w-5 rounded mr-2 relative group cursor-pointer"
                                    style={{
                                      backgroundColor:
                                        getOperatorColor(operator),
                                    }}
                                    onClick={() => {
                                      setColorPickerTarget(operator);
                                      setShowColorPicker(true);
                                    }}
                                  >
                                    <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-[#1D1D1F] text-xs text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                      {getOperatorColor(operator)}
                                    </div>
                                  </div>
                                  <span className="text-xs">
                                    {getOperatorColor(operator)}
                                  </span>
                                </div>
                              </td>
                              <td className="px-2 py-1.5 border border-[#4A4A4A]">
                                {editingOperator === operator ? (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={handleSaveOperatorEdit}
                                      className="text-green-400 hover:text-green-300"
                                      title="Save changes"
                                    >
                                      <i className="fas fa-check"></i>
                                    </button>
                                    <button
                                      onClick={handleCancelOperatorEdit}
                                      className="text-red-400 hover:text-red-300"
                                      title="Cancel"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() =>
                                        handleEditOperator(operator)
                                      }
                                      className="text-white hover:text-[#67e8f9]"
                                      title="Edit name"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setColorPickerTarget(operator);
                                        setShowColorPicker(true);
                                      }}
                                      className="text-[#67e8f9] hover:text-white"
                                      title="Change color"
                                    >
                                      <i className="fas fa-palette"></i>
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleRemoveOperator(operator)
                                      }
                                      className="text-red-400 hover:text-red-300"
                                      title="Remove operator"
                                    >
                                      <i className="fas fa-trash-alt"></i>
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="3"
                              className="px-2 py-3 text-center text-[#86868B] italic"
                            >
                              Još nema dodanih operatora
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-[#2A2A2A] rounded p-2">
                  <h4 className="text-white text-sm mb-1.5">
                    Dodaj Novog Operatora
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newOperatorName}
                      onChange={(e) => setNewOperatorName(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleDodajOperator()
                      }
                      placeholder="Ime operatora"
                      className={`bg-[#3A3A3A] text-white border ${operatorError ? (operatorError.type === "warning" ? "border-yellow-500" : "border-red-500") : "border-[#4A4A4A]"} rounded px-2 py-1 text-sm flex-1 min-w-0 focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent`}
                    />

                    <div
                      className="h-7 w-7 rounded cursor-pointer border border-[#4A4A4A] flex items-center justify-center relative group flex-shrink-0"
                      style={{
                        backgroundColor: newOperatorColor,
                        color: getContrastTextColor(newOperatorColor),
                      }}
                      onClick={() => {
                        setColorPickerTarget("new");
                        setShowColorPicker(true);
                      }}
                      title="Choose color"
                    >
                      <i className="fas fa-palette text-xs"></i>
                      <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-[#1D1D1F] text-xs text-white px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {newOperatorColor}
                      </div>
                    </div>

                    <div
                      className="h-7 w-7 rounded border border-[#4A4A4A] flex-shrink-0 flex items-center justify-center overflow-hidden relative group cursor-pointer"
                      title="Pomoć za dodavanje operatora"
                      onClick={() => setShowHelpModal(true)}
                    >
                      <div
                        className="w-full h-full flex items-center justify-center bg-[#3A3A3A] hover:bg-[#4A4A4A] transition-colors"
                      >
                        <span className="text-gray-300 font-bold">?</span>
                      </div>
                      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-[#1D1D1F] text-xs text-white p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal z-10 w-48 border border-[#3A3A3A]">
                        <p>Unesite ime operatora i izaberite boju. Kliknite za više informacija.</p>
                      </div>
                    </div>

                    <button
                      onClick={handleDodajOperator}
                      className="bg-gradient-to-r from-[#4a9eff] to-[#67e8f9] text-black font-medium px-2 py-1 rounded hover:opacity-90 transition-opacity text-sm whitespace-nowrap flex-shrink-0"
                    >
                      Dodaj
                    </button>
                  </div>
                  
                  {operatorError && (
                    <div className={`mt-2 p-2 rounded text-xs flex items-start ${
                      operatorError.type === "warning" 
                        ? "bg-yellow-900/30 border border-yellow-500/50 text-yellow-200" 
                        : "bg-red-900/30 border border-red-500/50 text-red-200"
                    }`}>
                      <div className="mr-2 mt-0.5 flex-shrink-0">
                        <i className={`fas ${operatorError.type === "warning" ? "fa-exclamation-triangle" : "fa-times-circle"} text-sm`}></i>
                      </div>
                      <div>
                        {operatorError.message}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showMachineManager && (
            <div className="mt-2 bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
              <div className="p-3 bg-[#2A2A2A] border-b border-[#3A3A3A]">
                <h3 className="text-sm font-bold text-[#67e8f9]">
                  Upravljanje Vozilima
                </h3>
              </div>
              
              <div className="p-4">
                <div className="mb-3">
                  <h4 className="text-white text-sm mb-1.5">
                    Aktivna vozila
                  </h4>
                  <div className="bg-[#2A2A2A] rounded overflow-hidden">
                    <table className="w-full text-sm text-left text-white border-collapse">
                      <thead className="text-xs uppercase bg-[#3A3A3A] text-[#67e8f9]">
                        <tr>
                          <th className="px-2 py-1.5 border border-[#4A4A4A]">
                            Vozilo ID
                          </th>
                          <th className="px-2 py-1.5 border border-[#4A4A4A] w-24">
                            Boja
                          </th>
                          <th className="px-2 py-1.5 border border-[#4A4A4A] w-24">
                            Radnje
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {machinesList.length > 0 ? (
                          machinesList.map((machine) => (
                            <tr
                              key={machine}
                              className="border-b border-[#4A4A4A]"
                            >
                              <td className="px-2 py-1.5 border border-[#4A4A4A]">
                                {editingMachine === machine ? (
                                  <input
                                    type="text"
                                    value={editedMachineName}
                                    onChange={(e) => setEditedMachineName(e.target.value)}
                                    className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent"
                                    autoFocus
                                  />
                                ) : (
                                  machine
                                )}
                              </td>
                              <td className="px-2 py-1.5 border border-[#4A4A4A]">
                                <div className="flex items-center">
                                  <div
                                    className="h-5 w-5 rounded mr-2 relative group cursor-pointer"
                                    style={{
                                      backgroundColor: machineColors[machine] || "#FF8C00",
                                    }}
                                    onClick={() => {
                                      setColorPickerTarget(`machine-${machine}`);
                                      setEditingMachineColor(machine);
                                      setShowColorPicker(true);
                                    }}
                                  >
                                    <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-[#1D1D1F] text-xs text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                      {machineColors[machine] || "#FF8C00"}
                                    </div>
                                  </div>
                                  <span className="text-xs">
                                    {machineColors[machine] || "#FF8C00"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-2 py-1.5 border border-[#4A4A4A]">
                                {editingMachine === machine ? (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => {
                                        // Reset any previous error
                                        setMachineError(null);
                                        
                                        // Check if machine name is empty
                                        if (editedMachineName.trim() === "") {
                                          setMachineError({
                                            type: "warning",
                                            message: "ID vozila ne može biti prazan!"
                                          });
                                          return;
                                        }
                                        
                                        // Check if machine name already exists (and it's not the current one being edited)
                                        if (editedMachineName !== editingMachine && machinesList.includes(editedMachineName.trim())) {
                                          setMachineError({
                                            type: "error",
                                            message: "Vozilo sa ovim ID-om već postoji! Molimo koristite drugi ID."
                                          });
                                          return;
                                        }
                                        
                                        if (
                                          editedMachineName.trim() !== "" &&
                                          (editedMachineName === editingMachine ||
                                            !machinesList.includes(editedMachineName.trim()))
                                        ) {
                                          const updatedMachines = machinesList.map((m) =>
                                            m === editingMachine ? editedMachineName.trim() : m
                                          );
                                          setMachinesList(updatedMachines);
                                          
                                          // Update machine colors when machine name changes
                                          if (editedMachineName !== editingMachine) {
                                            setMachineColors((prev) => {
                                              const newColors = { ...prev };
                                              newColors[editedMachineName.trim()] = newColors[editingMachine];
                                              delete newColors[editingMachine];
                                              return newColors;
                                            });
                                          }
                                          
                                          setEditingMachine(null);
                                          setEditedMachineName("");
                                          setMachineError(null);
                                        }
                                      }}
                                      className="text-green-400 hover:text-green-300"
                                      title="Save changes"
                                    >
                                      <i className="fas fa-check"></i>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingMachine(null);
                                        setEditedMachineName("");
                                        setMachineError(null);
                                      }}
                                      className="text-red-400 hover:text-red-300"
                                      title="Cancel"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => {
                                        setEditingMachine(machine);
                                        setEditedMachineName(machine);
                                      }}
                                      className="text-white hover:text-[#67e8f9]"
                                      title="Edit machine"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setColorPickerTarget(`machine-${machine}`);
                                        setEditingMachineColor(machine);
                                        setShowColorPicker(true);
                                      }}
                                      className="text-[#67e8f9] hover:text-white"
                                      title="Change color"
                                    >
                                      <i className="fas fa-palette"></i>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setMachinesList(machinesList.filter((m) => m !== machine));
                                        // Also remove from colors
                                        setMachineColors((prev) => {
                                          const newColors = { ...prev };
                                          delete newColors[machine];
                                          return newColors;
                                        });
                                      }}
                                      className="text-red-400 hover:text-red-300"
                                      title="Remove machine"
                                    >
                                      <i className="fas fa-trash-alt"></i>
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="3"
                              className="px-2 py-3 text-center text-[#86868B] italic"
                            >
                              No machines added yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-[#2A2A2A] rounded p-2">
                  <h4 className="text-white text-sm mb-1.5">
                    Dodaj novo vozilo
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newMachineName}
                      onChange={(e) => {
                        setNewMachineName(e.target.value);
                        setMachineError(null);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && newMachineName.trim() !== "") {
                          // Check if machine name is empty
                          if (newMachineName.trim() === "") {
                            setMachineError({
                              type: "warning",
                              message: "ID vozila ne može biti prazan!"
                            });
                            return;
                          }
                          
                          // Check if machine already exists
                          if (machinesList.includes(newMachineName.trim())) {
                            setMachineError({
                              type: "error",
                              message: "Vozilo sa ovim ID-om već postoji! Molimo koristite drugi ID."
                            });
                            return;
                          }
                          
                          setMachinesList([...machinesList, newMachineName.trim()]);
                          setMachineColors((prev) => ({
                            ...prev,
                            [newMachineName.trim()]: newMachineColor
                          }));
                          setNewMachineName("");
                          setMachineError(null);
                        }
                      }}
                      placeholder="Machine ID (e.g. M58-J-467)"
                      className={`bg-[#3A3A3A] text-white border ${machineError ? (machineError.type === "warning" ? "border-yellow-500" : "border-red-500") : "border-[#4A4A4A]"} rounded px-2 py-1 text-sm flex-1 min-w-0 focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent`}
                    />
                    
                    <div
                      className="h-7 w-7 rounded cursor-pointer border border-[#4A4A4A] flex items-center justify-center relative group flex-shrink-0"
                      style={{
                        backgroundColor: newMachineColor,
                        color: getContrastTextColor(newMachineColor),
                      }}
                      onClick={() => {
                        setColorPickerTarget("new-machine");
                        setShowColorPicker(true);
                      }}
                      title="Choose color"
                    >
                      <i className="fas fa-palette text-xs"></i>
                      <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-[#1D1D1F] text-xs text-white px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {newMachineColor}
                      </div>
                    </div>
                    
                    <div
                      className="h-7 w-7 rounded border border-[#4A4A4A] flex-shrink-0 flex items-center justify-center overflow-hidden relative group cursor-pointer"
                      title="Pomoć za dodavanje vozila"
                      onClick={() => setShowHelpModal(true)}
                    >
                      <div
                        className="w-full h-full flex items-center justify-center bg-[#3A3A3A] hover:bg-[#4A4A4A] transition-colors"
                      >
                        <span className="text-gray-300 font-bold">?</span>
                      </div>
                      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-[#1D1D1F] text-xs text-white p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal z-10 w-48 border border-[#3A3A3A]">
                        <p>Unesite ID vozila i izaberite boju. Kliknite za više informacija.</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        // Reset any previous error
                        setMachineError(null);
                        
                        // Check if machine name is empty
                        if (newMachineName.trim() === "") {
                          setMachineError({
                            type: "warning",
                            message: "ID vozila ne može biti prazan!"
                          });
                          return;
                        }
                        
                        // Check if machine already exists
                        if (machinesList.includes(newMachineName.trim())) {
                          setMachineError({
                            type: "error",
                            message: "Vozilo sa ovim ID-om već postoji! Molimo koristite drugi ID."
                          });
                          return;
                        }
                        
                        setMachinesList([...machinesList, newMachineName.trim()]);
                        setMachineColors((prev) => ({
                          ...prev,
                          [newMachineName.trim()]: newMachineColor
                        }));
                        setNewMachineName("");
                        setMachineError(null);
                      }}
                      className="bg-gradient-to-r from-[#4a9eff] to-[#67e8f9] text-black font-medium px-2 py-1 rounded hover:opacity-90 transition-opacity text-sm whitespace-nowrap flex-shrink-0"
                    >
                      Dodaj
                    </button>
                  </div>
                  
                  {machineError && !editingMachine && (
                    <div className={`mt-2 p-2 rounded text-xs flex items-start ${
                      machineError.type === "warning" 
                        ? "bg-yellow-900/30 border border-yellow-500/50 text-yellow-200" 
                        : "bg-red-900/30 border border-red-500/50 text-red-200"
                    }`}>
                      <div className="mr-2 mt-0.5 flex-shrink-0">
                        <i className={`fas ${machineError.type === "warning" ? "fa-exclamation-triangle" : "fa-times-circle"} text-sm`}></i>
                      </div>
                      <div>
                        {machineError.message}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showShiftColorManager && (
            <div className="mt-2 bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
              <div className="p-3 bg-[#2A2A2A] border-b border-[#3A3A3A]">
                <h3 className="text-sm font-bold text-[#67e8f9]">
                  Upravljanje Bojama Smjena
                </h3>
              </div>

              <div className="p-4">
                <div className="bg-[#2A2A2A] rounded overflow-hidden mb-4">
                  <table className="w-full text-sm text-left text-white border-collapse">
                    <thead className="text-xs uppercase bg-[#3A3A3A] text-[#67e8f9]">
                      <tr>
                        <th className="px-2 py-1.5 border border-[#4A4A4A]">
                          Smjena
                        </th>
                        <th className="px-2 py-1.5 border border-[#4A4A4A] w-24">
                          Boja
                        </th>
                        <th className="px-2 py-1.5 border border-[#4A4A4A] w-24">
                          Radnje
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(shiftColors).map((shift) => (
                        <tr key={shift} className="border-b border-[#4A4A4A]">
                          <td className="px-2 py-1.5 border border-[#4A4A4A]">
                            {editingShift === shift ? (
                              <input
                                type="text"
                                value={editedShiftTime}
                                onChange={(e) =>
                                  setEditedShiftTime(e.target.value)
                                }
                                className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent"
                                autoFocus
                                placeholder="Format: HH.MM-HH.MM"
                              />
                            ) : (
                              shift
                            )}
                          </td>
                          <td className="px-2 py-1.5 border border-[#4A4A4A]">
                            <div className="flex items-center">
                              <div
                                className="h-5 w-5 rounded mr-2 relative group cursor-pointer"
                                style={{
                                  backgroundColor: getShiftColor(shift),
                                }}
                                onClick={() => {
                                  setColorPickerTarget(`shift-${shift}`);
                                  setEditingShiftColor(shift);
                                  setShowColorPicker(true);
                                }}
                              >
                                <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-[#1D1D1F] text-xs text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                  {getShiftColor(shift)}
                                </div>
                              </div>
                              <span className="text-xs">
                                {getShiftColor(shift)}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-1.5 border border-[#4A4A4A]">
                            {editingShift === shift ? (
                              <>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => {
                                      if (editedShiftTime.trim() !== "") {
                                        // Check if the edited shift time already exists (and it's not the current one being edited)
                                        if (editedShiftTime !== shift && Object.keys(shiftColors).includes(editedShiftTime.trim())) {
                                          setShiftError({
                                            type: "error",
                                            message: "Smjena sa ovim vremenom već postoji! Molimo koristite drugo vrijeme."
                                          });
                                          return;
                                        }
                                        
                                        // Create a new shift colors object
                                        const updatedShiftColors = {
                                          ...shiftColors,
                                        };
                                        // Copy the color from the old shift
                                        updatedShiftColors[editedShiftTime] =
                                          updatedShiftColors[shift];
                                        // Remove the old shift if it's different
                                        if (editedShiftTime !== shift) {
                                          delete updatedShiftColors[shift];
                                        }
                                        setShiftColors(updatedShiftColors);

                                        setEditingShift(null);
                                        setEditedShiftTime("");
                                        setShiftError(null);
                                      }
                                    }}
                                    className="text-green-400 hover:text-green-300"
                                    title="Save changes"
                                  >
                                    <i className="fas fa-check"></i>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingShift(null);
                                      setEditedShiftTime("");
                                      setShiftError(null);
                                    }}
                                    className="text-red-400 hover:text-red-300"
                                    title="Cancel"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                                
                                {shiftError && (
                                  <div className="mt-2 p-1 rounded text-xs flex items-start bg-red-900/30 border border-red-500/50 text-red-200">
                                    <div className="mr-1 mt-0.5 flex-shrink-0">
                                      <i className="fas fa-exclamation-triangle text-yellow-400 text-xs"></i>
                                    </div>
                                    <div>
                                      {shiftError.message}
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingShift(shift);
                                    setEditedShiftTime(shift);
                                  }}
                                  className="text-white hover:text-[#67e8f9]"
                                  title="Edit shift time"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() => {
                                    setColorPickerTarget(`shift-${shift}`);
                                    setEditingShiftColor(shift);
                                    setShowColorPicker(true);
                                  }}
                                  className="text-[#67e8f9] hover:text-white"
                                  title="Change color"
                                >
                                  <i className="fas fa-palette"></i>
                                </button>
                                <button
                                  onClick={() => {
                                    // Create a new shift colors object without this shift
                                    const updatedShiftColors = {
                                      ...shiftColors,
                                    };
                                    delete updatedShiftColors[shift];
                                    setShiftColors(updatedShiftColors);
                                  }}
                                  className="text-red-400 hover:text-red-300"
                                  title="Delete shift time"
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#2A2A2A] rounded p-2">
                  <h4 className="text-white text-sm mb-1.5">
                    Dodaj novu smjenu
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newShiftTime}
                      onChange={(e) => {
                        setNewShiftTime(e.target.value);
                        setShiftError(null);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && newShiftTime.trim() !== "") {
                          // Check if shift already exists
                          if (Object.keys(shiftColors).includes(newShiftTime.trim())) {
                            setShiftError({
                              type: "error",
                              message: "Smjena sa ovim vremenom već postoji! Molimo koristite drugo vrijeme."
                            });
                            return;
                          }
                          setShiftColors((prev) => ({
                            ...prev,
                            [newShiftTime]: "#4a9eff",
                          }));
                          setNewShiftTime("");
                          setShiftError(null);
                        }
                      }}
                      placeholder="Format: HH.MM-HH.MM"
                      className={`bg-[#3A3A3A] text-white border ${shiftError ? "border-red-500" : "border-[#4A4A4A]"} rounded px-2 py-1 text-sm flex-1 min-w-0 focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent`}
                    />

                    <div
                      className="h-7 w-7 rounded cursor-pointer border border-[#4A4A4A] flex items-center justify-center relative group flex-shrink-0"
                      style={{
                        backgroundColor: "#4a9eff",
                        color: getContrastTextColor("#4a9eff"),
                      }}
                      title="Default color"
                    >
                      <i className="fas fa-palette text-xs"></i>
                    </div>

                    <button
                      onClick={() => {
                        if (newShiftTime.trim() !== "") {
                          // Check if shift already exists
                          if (Object.keys(shiftColors).includes(newShiftTime.trim())) {
                            setShiftError({
                              type: "error",
                              message: "Smjena sa ovim vremenom već postoji! Molimo koristite drugo vrijeme."
                            });
                            return;
                          }
                          setShiftColors((prev) => ({
                            ...prev,
                            [newShiftTime]: "#4a9eff",
                          }));
                          setNewShiftTime("");
                          setShiftError(null);
                        }
                      }}
                      className="bg-gradient-to-r from-[#4a9eff] to-[#67e8f9] text-black font-medium px-2 py-1 rounded hover:opacity-90 transition-opacity text-sm whitespace-nowrap flex-shrink-0"
                    >
                      Dodaj
                    </button>
                  </div>
                  
                  {shiftError && (
                    <div className="mt-2 p-2 rounded text-xs flex items-start bg-red-900/30 border border-red-500/50 text-red-200">
                      <div className="mr-2 mt-0.5 flex-shrink-0">
                        <i className="fas fa-exclamation-triangle text-yellow-400 text-sm"></i>
                      </div>
                      <div>
                        {shiftError.message}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {showHelpModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowHelpModal(false)}
            >
              <div
                className="bg-[#1D1D1F] rounded-lg p-4 max-w-md w-full max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-3 flex-shrink-0">
                  <h3 className="text-white font-bold text-lg">
                    {showOperatorManager ? "Pomoć za dodavanje operatora" : 
                     showShiftColorManager ? "Pomoć za upravljanje smjenama" : 
                     showMachineManager ? "Pomoć za upravljanje vozilima" : "Pomoć"}
                  </h3>
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="text-white hover:text-gray-300"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="overflow-y-auto pr-1 flex-grow" style={{ scrollbarWidth: 'thin' }}>
                  {showOperatorManager && (
                    <>
                      <div className="bg-[#2A2A2A] p-3 rounded mb-3">
                        <h4 className="text-[#67e8f9] font-medium mb-2">Kako dodati novog operatora:</h4>
                        <ol className="text-white text-sm space-y-2 list-decimal pl-4">
                          <li>Unesite ime operatora u polje za unos teksta</li>
                          <li>Izaberite boju za operatora klikom na dugme palete boja</li>
                          <li>Kliknite na dugme "Dodaj" da sačuvate novog operatora</li>
                        </ol>
                      </div>

                      <div className="bg-[#2A2A2A] p-3 rounded mb-3">
                        <h4 className="text-[#67e8f9] font-medium mb-2">Napomene:</h4>
                        <ul className="text-white text-sm space-y-2 list-disc pl-4">
                          <li>Ime operatora mora biti jedinstveno</li>
                          <li>Boja pomaže u lakšem prepoznavanju operatora u rasporedu</li>
                          <li>Možete pritisnuti Enter nakon unosa imena za brzo dodavanje</li>
                          <li>Dodani operatori će biti dostupni za raspoređivanje u smjene</li>
                        </ul>
                      </div>

                      <div className="bg-[#2A2A2A] p-3 rounded mb-3">
                        <h4 className="text-[#67e8f9] font-medium mb-2">Upravljanje operatorima:</h4>
                        <p className="text-white text-sm">
                          Nakon dodavanja, operatore možete uređivati, mijenjati im boju ili ih ukloniti 
                          koristeći opcije u tabeli "Aktivni Operatori".
                        </p>
                      </div>
                    </>
                  )}

                  {showShiftColorManager && (
                    <>
                      <div className="bg-[#2A2A2A] p-3 rounded mb-3">
                        <h4 className="text-[#67e8f9] font-medium mb-2">Kako dodati novu smjenu:</h4>
                        <ol className="text-white text-sm space-y-2 list-decimal pl-4">
                          <li>Unesite vrijeme smjene u formatu HH.MM-HH.MM (npr. 08.00-16.00)</li>
                          <li>Kliknite na dugme "Dodaj" da sačuvate novu smjenu</li>
                          <li>Smjena će automatski dobiti zadanu boju koju možete kasnije promijeniti</li>
                        </ol>
                      </div>

                      <div className="bg-[#2A2A2A] p-3 rounded mb-3">
                        <h4 className="text-[#67e8f9] font-medium mb-2">Napomene za smjene:</h4>
                        <ul className="text-white text-sm space-y-2 list-disc pl-4">
                          <li>Format vremena mora biti konzistentan (HH.MM-HH.MM)</li>
                          <li>Boja smjene se koristi za označavanje redova u rasporedu</li>
                          <li>Možete pritisnuti Enter nakon unosa vremena za brzo dodavanje</li>
                          <li>Smjene se mogu preklapati ako je potrebno (npr. 08.00-16.00 i 12.00-20.00)</li>
                        </ul>
                      </div>

                      <div className="bg-[#2A2A2A] p-3 rounded mb-3">
                        <h4 className="text-[#67e8f9] font-medium mb-2">Upravljanje smjenama:</h4>
                        <p className="text-white text-sm">
                          Nakon dodavanja, smjene možete uređivati, mijenjati im boju ili ih ukloniti 
                          koristeći opcije u tabeli smjena. Promjena boje smjene odmah će se odraziti 
                          na izgled rasporeda.
                        </p>
                      </div>
                    </>
                  )}

                  {showMachineManager && (
                    <>
                      <div className="bg-[#2A2A2A] p-3 rounded mb-3">
                        <h4 className="text-[#67e8f9] font-medium mb-2">Kako dodati novo vozilo:</h4>
                        <ol className="text-white text-sm space-y-2 list-decimal pl-4">
                          <li>Unesite ID vozila u polje za unos teksta (npr. M58-J-467)</li>
                          <li>Izaberite boju za vozilo klikom na dugme palete boja</li>
                          <li>Kliknite na dugme "Dodaj" da sačuvate novo vozilo</li>
                        </ol>
                      </div>

                      <div className="bg-[#2A2A2A] p-3 rounded mb-3">
                        <h4 className="text-[#67e8f9] font-medium mb-2">Napomene za vozila:</h4>
                        <ul className="text-white text-sm space-y-2 list-disc pl-4">
                          <li>ID vozila mora biti jedinstven</li>
                          <li>Boja pomaže u lakšem prepoznavanju vozila u rasporedu</li>
                          <li>Možete pritisnuti Enter nakon unosa ID-a za brzo dodavanje</li>
                          <li>Dodana vozila će se pojaviti kao nove kolone u rasporedu</li>
                        </ul>
                      </div>

                      <div className="bg-[#2A2A2A] p-3 rounded mb-3">
                        <h4 className="text-[#67e8f9] font-medium mb-2">Upravljanje vozilima:</h4>
                        <p className="text-white text-sm">
                          Nakon dodavanja, vozila možete uređivati, mijenjati im boju ili ih ukloniti 
                          koristeći opcije u tabeli "Aktivna vozila". Uklanjanje vozila će ukloniti 
                          i sve rasporede vezane za to vozilo.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setShowHelpModal(false)}
                  className="bg-gradient-to-r from-[#4a9eff] to-[#67e8f9] text-black font-medium px-3 py-1.5 rounded hover:opacity-90 transition-opacity text-sm mt-3 w-full flex-shrink-0"
                >
                  Razumijem
                </button>
              </div>
            </div>
          )}
          
          {showColorPicker && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowColorPicker(false)}
            >
              <div
                className="bg-[#1D1D1F] rounded-lg p-4 max-w-xs w-full color-picker-container"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-bold text-sm">
                    {colorPickerTarget === "new"
                      ? "Izaberite boju za novog operatora"
                      : colorPickerTarget === "new-machine"
                        ? "Izaberite boju za novo vozilo"
                        : colorPickerTarget?.startsWith("shift-")
                          ? `Izaberite boju za smjenu ${editingShiftColor}`
                          : colorPickerTarget?.startsWith("machine-")
                            ? `Izaberite boju za vozilo ${editingMachineColor}`
                            : `Izaberite boju za ${colorPickerTarget}`}
                  </h3>
                  <button
                    onClick={() => setShowColorPicker(false)}
                    className="text-white hover:text-gray-300"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="mb-4 bg-[#2A2A2A] p-2 rounded">
                  <div className="flex items-center">
                    <div
                      className="h-8 w-8 rounded mr-3 border border-white"
                      style={{
                        backgroundColor:
                          colorPickerTarget === "new"
                            ? newOperatorColor
                            : colorPickerTarget === "new-machine"
                              ? newMachineColor
                              : colorPickerTarget?.startsWith("shift-")
                                ? getShiftColor(editingShiftColor)
                                : colorPickerTarget?.startsWith("machine-")
                                  ? machineColors[editingMachineColor] || "#FF8C00"
                                  : getOperatorColor(colorPickerTarget),
                      }}
                    ></div>
                    <div>
                      <div className="text-white text-xs mb-1">
                        Trenutna boja:
                      </div>
                      <div className="text-white text-sm font-medium">
                        {colorPickerTarget === "new"
                          ? newOperatorColor
                          : colorPickerTarget === "new-machine"
                            ? newMachineColor
                            : colorPickerTarget?.startsWith("shift-")
                              ? getShiftColor(editingShiftColor)
                              : colorPickerTarget?.startsWith("machine-")
                                ? machineColors[editingMachineColor] || "#FF8C00"
                                : getOperatorColor(colorPickerTarget)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-white text-xs mb-2">Izaberite boju:</h4>
                  <div className="grid grid-cols-8 gap-1">
                    {distinctColors.map((color, index) => (
                      <button
                        key={`color-${index}`}
                        className="w-full h-6 rounded border hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: color,
                          borderColor:
                            (colorPickerTarget === "new"
                              ? newOperatorColor
                              : colorPickerTarget === "new-machine"
                                ? newMachineColor
                                : colorPickerTarget?.startsWith("shift-")
                                  ? getShiftColor(editingShiftColor)
                                  : colorPickerTarget?.startsWith("machine-")
                                    ? machineColors[editingMachineColor] || "#FF8C00"
                                    : getOperatorColor(colorPickerTarget)) === color
                              ? "white"
                              : "transparent",
                        }}
                        onTouchStart={() => {
                          if (colorPickerTarget?.startsWith("shift-")) {
                            handleShiftColorChange(editingShiftColor, color);
                          } else if (colorPickerTarget?.startsWith("machine-")) {
                            setMachineColors(prev => ({
                              ...prev,
                              [editingMachineColor]: color
                            }));
                          } else if (colorPickerTarget === "new-machine") {
                            setNewMachineColor(color);
                          } else {
                            handleColorChange(colorPickerTarget, color);
                          }
                        }}
                        onClick={() => {
                          if (colorPickerTarget?.startsWith("shift-")) {
                            handleShiftColorChange(editingShiftColor, color);
                          } else if (colorPickerTarget?.startsWith("machine-")) {
                            setMachineColors(prev => ({
                              ...prev,
                              [editingMachineColor]: color
                            }));
                          } else if (colorPickerTarget === "new-machine") {
                            setNewMachineColor(color);
                          } else {
                            handleColorChange(colorPickerTarget, color);
                          }
                        }}
                      ></button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-white text-xs mb-1">
                    Ili unesite prilagođenu boju:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={
                        colorPickerTarget === "new"
                          ? newOperatorColor
                          : colorPickerTarget === "new-machine"
                            ? newMachineColor
                            : colorPickerTarget?.startsWith("shift-")
                              ? getShiftColor(editingShiftColor)
                              : colorPickerTarget?.startsWith("machine-")
                                ? machineColors[editingMachineColor] || "#FF8C00"
                                : getOperatorColor(colorPickerTarget)
                      }
                      onChange={(e) => {
                        if (colorPickerTarget?.startsWith("shift-")) {
                          handleShiftColorChange(
                            editingShiftColor,
                            e.target.value,
                          );
                        } else if (colorPickerTarget?.startsWith("machine-")) {
                          setMachineColors(prev => ({
                            ...prev,
                            [editingMachineColor]: e.target.value
                          }));
                        } else if (colorPickerTarget === "new-machine") {
                          setNewMachineColor(e.target.value);
                        } else {
                          handleColorChange(colorPickerTarget, e.target.value);
                        }
                      }}
                      className="bg-[#3A3A3A] text-white border border-[#4A4A4A] rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-[#67e8f9] focus:border-transparent"
                      placeholder="#RRGGBB"
                    />
                    <div
                      className="w-8 h-8 rounded border border-white"
                      style={{
                        backgroundColor:
                          colorPickerTarget === "new"
                            ? newOperatorColor
                            : colorPickerTarget === "new-machine"
                              ? newMachineColor
                              : colorPickerTarget?.startsWith("shift-")
                                ? getShiftColor(editingShiftColor)
                                : colorPickerTarget?.startsWith("machine-")
                                  ? machineColors[editingMachineColor] || "#FF8C00"
                                  : getOperatorColor(colorPickerTarget),
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setShowColorPicker(false);
                    }}
                    className="bg-gradient-to-r from-[#4a9eff] to-[#67e8f9] text-black font-medium px-3 py-1.5 rounded hover:opacity-90 transition-opacity text-sm"
                  >
                    Gotovo
                  </button>
                  <button
                    onClick={() => {
                      if (colorPickerTarget === "new") {
                        setNewOperatorColor("#4a9eff");
                      } else if (colorPickerTarget === "new-machine") {
                        setNewMachineColor("#FF8C00");
                      } else if (colorPickerTarget?.startsWith("shift-")) {
                        handleShiftColorChange(editingShiftColor, "#4a9eff");
                      } else if (colorPickerTarget?.startsWith("machine-")) {
                        setMachineColors(prev => ({
                          ...prev,
                          [editingMachineColor]: "#FF8C00"
                        }));
                      } else {
                        handleColorChange(colorPickerTarget, distinctColors[0]);
                      }
                      setShowColorPicker(false);
                    }}
                    className="bg-[#3A3A3A] text-white font-medium px-3 py-1.5 rounded hover:bg-[#4A4A4A] transition-colors text-sm"
                  >
                    Poništi
                  </button>
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="operator-drag-container">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white text-xs">
                  Povuci Operatore na Raspored:
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-xs">{operators.length} operatora</span>
                </div>
              </div>
              <div 
                className="operator-list-container flex flex-wrap gap-2 pb-1 relative" 
                style={{ 
                  height: '80px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  paddingRight: '12px',
                  marginRight: '0px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#67e8f9 #1D1D1F',
                  scrollbarGutter: 'stable'
                }}>
                {operators.map((operator) => (
                  <div
                    key={operator}
                    draggable="true"
                    onDragStart={() => handleDragStart(operator)}
                    onDragEnd={handleDragEnd}
                    onClick={() => {
                      setDraggedOperator(operator);
                      setIsDragging(true);
                    }}
                    onTouchStart={() => {
                      setDraggedOperator(operator);
                      setIsDragging(true);
                    }}
                    className="px-1 py-0.5 rounded text-[10px] cursor-move transition-transform hover:scale-105 active:scale-95 mb-1 touch-manipulation inline-flex items-center justify-center"
                    style={{
                      backgroundColor: getOperatorColor(operator),
                      color: getContrastTextColor(getOperatorColor(operator)),
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none',
                      touchAction: 'manipulation',
                      fontSize: '10px',
                      lineHeight: '1',
                      margin: '1px',
                      display: 'inline-block',
                      width: 'auto'
                    }}
                  >
                    {operator}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StoryComponent() {
  const mockWeeks = [
    { weekNumber: 1, year: 2025, dateRange: "Jan 1 - Jan 7 2025" },
    { weekNumber: 2, year: 2025, dateRange: "Jan 8 - Jan 14 2025" },
    { weekNumber: 3, year: 2025, dateRange: "Jan 15 - Jan 21 2025" },
  ];

  const mockOperators = ["Adis", "Munib", "Sanin", "Farik", "Harun", "Almedin", "Enes"];

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
};
}