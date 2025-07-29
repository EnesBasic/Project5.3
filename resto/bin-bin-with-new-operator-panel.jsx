"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  initialData = [],
  initialOperators = [],
  onSave,
  readOnly = false,
}) {
  const [data, setData] = React.useState(initialData);
  const [operators, setOperators] = React.useState(initialOperators);
  const [isOperatorPanelExpanded, setIsOperatorPanelExpanded] = React.useState(false);
  const [newOperatorName, setNewOperatorName] = React.useState("");
  const [showAddOperatorForm, setShowAddOperatorForm] = React.useState(false);
  const [draggedOperator, setDraggedOperator] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragTarget, setDragTarget] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingCell, setEditingCell] = React.useState(null);
  const [editValue, setEditValue] = React.useState("");

  const handleDragStart = (e, operator) => {
    setDraggedOperator(operator);
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", operator);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, date, shift, machine) => {
    e.preventDefault();
    setDragTarget({ date, shift, machine });
  };

  const handleDragLeave = () => {
    setDragTarget(null);
  };

  const handleDrop = (e, date, shift, machine) => {
    e.preventDefault();
    setIsDragging(false);
    setDragTarget(null);

    const operator = e.dataTransfer.getData("text/plain") || draggedOperator;
    if (!operator) return;

    const newData = [...data];
    const dateIndex = newData.findIndex((d) => d.date === date);

    if (dateIndex === -1) {
      // Date doesn't exist, create new entry
      newData.push({
        date,
        day: getDayAbbreviation(date),
        shifts: [
          {
            time: shift,
            operators: {
              [machine]: operator,
            },
          },
        ],
      });
    } else {
      // Date exists, find shift
      const shiftIndex = newData[dateIndex].shifts.findIndex(
        (s) => s.time === shift
      );

      if (shiftIndex === -1) {
        // Shift doesn't exist, create new shift
        newData[dateIndex].shifts.push({
          time: shift,
          operators: {
            [machine]: operator,
          },
        });
      } else {
        // Shift exists, update operator
        newData[dateIndex].shifts[shiftIndex].operators[machine] = operator;
      }
    }

    setData(newData);
    if (onSave) {
      onSave(newData);
    }
  };

  const handleCellClick = (date, shift, machine, currentValue) => {
    if (readOnly) return;
    
    setIsEditing(true);
    setEditingCell({ date, shift, machine });
    setEditValue(currentValue || "");
  };

  const handleCellBlur = () => {
    if (!isEditing) return;
    
    const { date, shift, machine } = editingCell;
    
    if (editValue !== "") {
      const newData = [...data];
      const dateIndex = newData.findIndex((d) => d.date === date);

      if (dateIndex === -1) {
        // Date doesn't exist, create new entry
        newData.push({
          date,
          day: getDayAbbreviation(date),
          shifts: [
            {
              time: shift,
              operators: {
                [machine]: editValue,
              },
            },
          ],
        });
      } else {
        // Date exists, find shift
        const shiftIndex = newData[dateIndex].shifts.findIndex(
          (s) => s.time === shift
        );

        if (shiftIndex === -1) {
          // Shift doesn't exist, create new shift
          newData[dateIndex].shifts.push({
            time: shift,
            operators: {
              [machine]: editValue,
            },
          });
        } else {
          // Shift exists, update operator
          newData[dateIndex].shifts[shiftIndex].operators[machine] = editValue;
        }
      }

      setData(newData);
      if (onSave) {
        onSave(newData);
      }
    }
    
    setIsEditing(false);
    setEditingCell(null);
    setEditValue("");
  };

  const handleCellKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCellBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditingCell(null);
      setEditValue("");
    }
  };

  const handleAddOperator = () => {
    if (newOperatorName.trim() === "") return;
    
    const updatedOperators = [...operators, newOperatorName.trim()];
    setOperators(updatedOperators);
    setNewOperatorName("");
    setShowAddOperatorForm(false);
  };

  const handleRemoveOperator = (operatorToRemove) => {
    const updatedOperators = operators.filter(op => op !== operatorToRemove);
    setOperators(updatedOperators);
    
    // Also remove this operator from any assignments in the schedule
    const newData = data.map(dateItem => ({
      ...dateItem,
      shifts: dateItem.shifts.map(shift => ({
        ...shift,
        operators: Object.fromEntries(
          Object.entries(shift.operators).map(([machine, operator]) => [
            machine,
            operator === operatorToRemove ? "" : operator
          ])
        )
      }))
    }));
    
    setData(newData);
    if (onSave) {
      onSave(newData);
    }
  };

  const getDayAbbreviation = (dateStr) => {
    const [day, month] = dateStr.split(".");
    const date = new Date(2023, parseInt(month) - 1, parseInt(day));
    const days = ["N", "P", "U", "S", "Č", "P", "S"];
    return days[date.getDay()];
  };

  const getOperatorForCell = (date, shift, machine) => {
    const dateItem = data.find((d) => d.date === date);
    if (!dateItem) return "";

    const shiftItem = dateItem.shifts.find((s) => s.time === shift);
    if (!shiftItem) return "";

    return shiftItem.operators[machine] || "";
  };

  const isEditingThisCell = (date, shift, machine) => {
    return (
      isEditing &&
      editingCell &&
      editingCell.date === date &&
      editingCell.shift === shift &&
      editingCell.machine === machine
    );
  };

  const isDragTargetCell = (date, shift, machine) => {
    return (
      isDragging &&
      dragTarget &&
      dragTarget.date === date &&
      dragTarget.shift === shift &&
      dragTarget.machine === machine
    );
  };

  const dates = ["01.01", "02.01", "03.01", "04.01", "05.01", "06.01", "07.01"];
  const shifts = ["08.00-16.00", "20.00-04.00"];
  const machines = ["M58-J-467", "M53-E-929", "A35-J-924"];

  return (
    <div className="flex flex-col h-full bg-[#121214] text-white">
      <div className="flex-grow overflow-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#1D1D1F] sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-[#2A2A2A]">
                Date
              </th>
              <th className="p-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-[#2A2A2A]">
                Day
              </th>
              <th className="p-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-[#2A2A2A]">
                Shift
              </th>
              {machines.map((machine) => (
                <th
                  key={machine}
                  className="p-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-[#2A2A2A]"
                >
                  {machine}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dates.map((date) => (
              <React.Fragment key={date}>
                {shifts.map((shift, shiftIndex) => (
                  <tr
                    key={`${date}-${shift}`}
                    className={`${
                      shiftIndex % 2 === 0 ? "bg-[#1A1A1C]" : "bg-[#222224]"
                    } hover:bg-[#2A2A2C]`}
                  >
                    {shiftIndex === 0 && (
                      <>
                        <td
                          rowSpan={shifts.length}
                          className="p-2 text-sm border-b border-[#2A2A2A] whitespace-nowrap"
                        >
                          {date}
                        </td>
                        <td
                          rowSpan={shifts.length}
                          className="p-2 text-sm border-b border-[#2A2A2A] whitespace-nowrap"
                        >
                          {getDayAbbreviation(date)}
                        </td>
                      </>
                    )}
                    <td className="p-2 text-sm border-b border-[#2A2A2A] whitespace-nowrap">
                      {shift}
                    </td>
                    {machines.map((machine) => (
                      <td
                        key={`${date}-${shift}-${machine}`}
                        className={`p-2 text-sm border-b border-[#2A2A2A] ${
                          isDragTargetCell(date, shift, machine)
                            ? "bg-[#3A3A3C]"
                            : ""
                        }`}
                        onDragOver={(e) => handleDragOver(e, date, shift, machine)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, date, shift, machine)}
                        onClick={() =>
                          handleCellClick(
                            date,
                            shift,
                            machine,
                            getOperatorForCell(date, shift, machine)
                          )
                        }
                      >
                        {isEditingThisCell(date, shift, machine) ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleCellBlur}
                            onKeyDown={handleCellKeyDown}
                            className="w-full bg-[#3A3A3C] text-white p-1 rounded border border-[#67e8f9] focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <div className="min-h-[24px]">
                            {getOperatorForCell(date, shift, machine) && (
                              <div className="inline-flex items-center bg-[#2A2A2A] text-white text-xs rounded px-2 py-1">
                                <i className="fas fa-user-circle mr-1 text-[#67e8f9]"></i>
                                {getOperatorForCell(date, shift, machine)}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`mt-2 bg-[#1D1D1F] rounded-lg transition-all duration-300 ${isOperatorPanelExpanded ? 'max-h-[300px]' : 'max-h-[120px]'}`}>
        <div className="p-3 border-b border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="text-white text-sm font-medium">Operators</h3>
              <span className="ml-2 bg-[#2A2A2A] text-xs text-gray-300 px-2 py-0.5 rounded-full">
                {operators.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddOperatorForm(true)}
                className="text-[#67e8f9] hover:text-[#a5f3ff] text-xs flex items-center"
              >
                <i className="fas fa-plus-circle mr-1"></i>
                Add
              </button>
              <button
                onClick={() => setIsOperatorPanelExpanded(!isOperatorPanelExpanded)}
                className="text-[#67e8f9] hover:text-[#a5f3ff] text-xs flex items-center"
              >
                {isOperatorPanelExpanded ? (
                  <>
                    <i className="fas fa-chevron-down mr-1"></i>
                    Collapse
                  </>
                ) : (
                  <>
                    <i className="fas fa-chevron-up mr-1"></i>
                    Expand
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-3 overflow-y-auto" style={{ maxHeight: isOperatorPanelExpanded ? '250px' : '70px' }}>
          {showAddOperatorForm ? (
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={newOperatorName}
                onChange={(e) => setNewOperatorName(e.target.value)}
                placeholder="Enter operator name"
                className="flex-grow bg-[#2A2A2A] text-white text-xs rounded-l px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#67e8f9]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddOperator();
                  if (e.key === 'Escape') setShowAddOperatorForm(false);
                }}
                autoFocus
              />
              <button
                onClick={handleAddOperator}
                className="bg-[#67e8f9] text-[#121214] text-xs font-medium px-2 py-1 rounded-r hover:bg-[#a5f3ff]"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddOperatorForm(false)}
                className="ml-2 text-gray-400 hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {operators.length > 0 ? (
                operators.map((operator, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, operator)}
                    className="bg-[#2A2A2A] text-white text-xs rounded-full px-3 py-1.5 cursor-grab hover:bg-[#3A3A3A] active:cursor-grabbing flex items-center group"
                  >
                    <i className="fas fa-user-circle mr-1.5 text-[#67e8f9]"></i>
                    {operator}
                    {!readOnly && (
                      <button
                        onClick={() => handleRemoveOperator(operator)}
                        className="ml-1.5 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <i className="fas fa-times-circle"></i>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-xs">
                  No operators available. Click "Add" to create one.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StoryComponent() {
  const [scheduleData, setScheduleData] = React.useState([
    {
      date: "01.01",
      day: "P",
      shifts: [
        {
          time: "08.00-16.00",
          operators: {
            "M58-J-467": "John Doe",
            "M53-E-929": "Jane Smith",
            "A35-J-924": "",
          },
        },
        {
          time: "20.00-04.00",
          operators: {
            "M58-J-467": "",
            "M53-E-929": "Mark Johnson",
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
            "M58-J-467": "Jane Smith",
            "M53-E-929": "",
            "A35-J-924": "John Doe",
          },
        },
        {
          time: "20.00-04.00",
          operators: {
            "M58-J-467": "Mark Johnson",
            "M53-E-929": "",
            "A35-J-924": "",
          },
        },
      ],
    },
  ]);

  const operators = ["John Doe", "Jane Smith", "Mark Johnson"];

  const handleSave = (newData) => {
    console.log("Saving schedule data:", newData);
    setScheduleData(newData);
  };

  return (
    <div className="p-4 bg-[#121214] min-h-screen">
      <h2 className="text-white text-xl mb-4">BinBin with New Operator Panel</h2>
      
      <div className="mb-8 border border-[#2A2A2A] rounded-lg p-4">
        <h3 className="text-white text-lg mb-4">Interactive Schedule</h3>
        <div className="h-[600px]">
          <MainComponent 
            initialData={scheduleData} 
            initialOperators={operators} 
            onSave={handleSave} 
          />
        </div>
      </div>
      
      <div className="mb-8 border border-[#2A2A2A] rounded-lg p-4">
        <h3 className="text-white text-lg mb-4">Read-Only Schedule</h3>
        <div className="h-[600px]">
          <MainComponent 
            initialData={scheduleData} 
            initialOperators={operators} 
            readOnly={true} 
          />
        </div>
      </div>
      
      <div className="border border-[#2A2A2A] rounded-lg p-4">
        <h3 className="text-white text-lg mb-4">Empty Schedule</h3>
        <div className="h-[600px]">
          <MainComponent 
            initialData={[]} 
            initialOperators={operators} 
            onSave={handleSave} 
          />
        </div>
      </div>
    </div>
  );
});
}