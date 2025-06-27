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
  const [showShiftColorManager, setShowShiftColorManager] = React.useState(false);
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

  return (<div></div>);
}

function StoryComponent() {
  return (<div><MainComponent /></div>);
});
}