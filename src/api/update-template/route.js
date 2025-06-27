async function handler({ templateId, name, description }) {
  try {
    if (!templateId) {
      return {
        success: false,
        error: "Template ID is required",
      };
    }

    const templateCheck = await sql`
      SELECT id FROM schedule_templates WHERE id = ${templateId}
    `;

    if (templateCheck.length === 0) {
      return {
        success: false,
        error: "Template not found",
      };
    }

    const updateFields = [];
    const updateValues = [];
    let paramCounter = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramCounter}`);
      updateValues.push(name);
      paramCounter++;
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramCounter}`);
      updateValues.push(description);
      paramCounter++;
    }

    updateFields.push(`updated_at = $${paramCounter}`);
    updateValues.push(new Date());
    paramCounter++;

    if (updateFields.length === 0) {
      return {
        success: false,
        error: "No fields to update",
      };
    }

    const updateQuery = `
      UPDATE schedule_templates 
      SET ${updateFields.join(", ")} 
      WHERE id = $${paramCounter} 
      RETURNING id, name, description, updated_at
    `;

    updateValues.push(templateId);

    const result = await sql(updateQuery, updateValues);

    if (result.length > 0) {
      return {
        success: true,
        template: result[0],
        message: "Template updated successfully",
      };
    } else {
      return {
        success: false,
        error: "Failed to update template",
      };
    }
  } catch (error) {
    console.error("Error updating template:", error);
    return {
      success: false,
      error: "Failed to update template",
      details: error.message,
    };
  }
}

function MainComponent({
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
  isEditing = false,
  setIsEditing = () => {},
}) {
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

  const formattedHeaderDate = formatHeaderDate(selectedWeek.dateRange);

  return (
    <div className="w-full bg-[#1D1D1F] rounded-lg shadow-lg overflow-hidden">
      <div className="p-3 bg-[#2A2A2A] border-b border-[#3A3A3A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handlePreviousWeek}
              className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded-l px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-center text-xs hover:bg-[#3A3A3A] transition-colors h-7 w-7"
              disabled={
                allWeeks.findIndex(
                  (week) =>
                    week.weekNumber === selectedWeek.weekNumber &&
                    week.year === selectedWeek.year
                ) === 0
              }
              title="Previous Week"
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className="relative inline-block mx-1">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-between text-xs h-7"
                style={{ minWidth: "110px" }}
              >
                <span>
                  {formatDropdownText(
                    selectedWeek.weekNumber,
                    selectedWeek.dateRange
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

            <button
              onClick={handleNextWeek}
              className="bg-[#1D1D1F] text-white border border-[#3A3A3A] rounded-r px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#67e8f9] focus:border-transparent flex items-center justify-center text-xs hover:bg-[#3A3A3A] transition-colors h-7 w-7"
              disabled={
                allWeeks.findIndex(
                  (week) =>
                    week.weekNumber === selectedWeek.weekNumber &&
                    week.year === selectedWeek.year
                ) ===
                allWeeks.length - 1
              }
              title="Next Week"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <div className="flex-grow text-center">
            <h2 className="text-lg font-bold bg-gradient-to-r from-[#4a9eff] to-[#67e8f9] text-transparent bg-clip-text px-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] filter-none transform scale-105 transition-transform duration-300">
              {formattedHeaderDate}
            </h2>
            <div className="h-0.5 w-32 bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40 mx-auto mt-1 rounded-full shadow-sm"></div>
          </div>

          <div className="w-[110px]"></div>
        </div>
      </div>

      <div className="p-1 bg-[#2A2A2A] border-b border-[#3A3A3A] flex items-center justify-between">
        <button
          onClick={onBack}
          className="bg-[#3A3A3A] text-[#67e8f9] border border-[#3A3A3A] h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center"
          title="Nazad"
        >
          <i className="fas fa-arrow-left text-sm"></i>
        </button>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowSearch(false);
              setShowFilterPanel(!showFilterPanel);
            }}
            className={`${
              showFilterPanel || activeFilters > 0
                ? "bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40"
                : "bg-[#3A3A3A]"
            } text-[#67e8f9] border ${
              showFilterPanel || activeFilters > 0
                ? "border-[#67e8f9]/30"
                : "border-[#3A3A3A]"
            } h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center relative`}
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
            className={`${
              showSearch
                ? "bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40"
                : "bg-[#3A3A3A]"
            } text-[#67e8f9] border ${
              showSearch ? "border-[#67e8f9]/30" : "border-[#3A3A3A]"
            } h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center`}
            title="Pretraži"
          >
            <i className="fas fa-search text-sm"></i>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`${
              isEditing
                ? "bg-gradient-to-r from-[#4a9eff]/40 to-[#67e8f9]/40"
                : "bg-[#3A3A3A]"
            } text-[#67e8f9] border ${
              isEditing ? "border-[#67e8f9]/30" : "border-[#3A3A3A]"
            } h-7 w-7 rounded hover:opacity-90 transition-all shadow-md flex items-center justify-center`}
            title={isEditing ? "Otkaži Uređivanje" : "Uredi"}
          >
            <i className={`fas fa-${isEditing ? "times" : "edit"} text-sm`}></i>
          </button>
        </div>
      </div>

      <div className={`p-4 ${isEditMode ? "pb-[200px]" : "pb-6"}`}>
        {/* ... rest of the component ... */}
      </div>

      {isEditMode && <></>}
    </div>
  );
}
export async function POST(request) {
  return handler(await request.json());
}