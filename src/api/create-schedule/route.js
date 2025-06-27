async function handler({ weekNumber, year, dateRange, entries }) {
  try {
    console.log("Create Schedule function called");
    console.log("Received data:", { weekNumber, year, dateRange, entries });

    // Validate required fields
    if (
      !weekNumber ||
      !year ||
      !dateRange ||
      !entries ||
      !Array.isArray(entries)
    ) {
      console.log("Validation failed - missing required fields");
      return {
        success: false,
        message:
          "Missing required fields: weekNumber, year, dateRange, and entries array",
      };
    }

    // Insert the schedule
    const scheduleResult = await sql`
      INSERT INTO schedules (week_number, year, date_range) 
      VALUES (${weekNumber}, ${year}, ${dateRange}) 
      RETURNING id
    `;

    if (!scheduleResult || scheduleResult.length === 0) {
      console.log("Failed to create schedule record");
      return {
        success: false,
        message: "Failed to create schedule record",
      };
    }

    const scheduleId = scheduleResult[0].id;
    console.log("Schedule created with ID:", scheduleId);

    // Process all entries using transaction
    const entryQueries = [];

    for (const entry of entries) {
      const { day, shift, machine, operator } = entry;

      // Validate entry fields
      if (!day || !shift || !machine || !operator) {
        console.log("Validation failed - entry missing required fields");
        return {
          success: false,
          message: "Each entry must have day, shift, machine, and operator",
        };
      }

      // Validate day value
      const validDays = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      if (!validDays.includes(day.toLowerCase())) {
        console.log("Validation failed - invalid day value:", day);
        return {
          success: false,
          message: `Invalid day value: ${day}`,
        };
      }

      // Validate shift value
      const validShifts = ["morning", "evening"];
      if (!validShifts.includes(shift.toLowerCase())) {
        console.log("Validation failed - invalid shift value:", shift);
        return {
          success: false,
          message: `Invalid shift value: ${shift}`,
        };
      }

      entryQueries.push(sql`
        INSERT INTO schedule_entries (schedule_id, day, shift, machine, operator) 
        VALUES (${scheduleId}, ${day.toLowerCase()}, ${shift.toLowerCase()}, ${machine}, ${operator})
      `);
    }

    // Execute all entry insertions in a transaction
    if (entryQueries.length > 0) {
      await sql.transaction(entryQueries);
      console.log(
        `${entryQueries.length} schedule entries created successfully`
      );
    }

    return {
      success: true,
      message: "Schedule created successfully",
      scheduleId,
    };
  } catch (error) {
    console.error("Error creating schedule:", error);

    // Check for unique constraint violation
    if (
      error.message &&
      error.message.includes("schedules_week_number_year_key")
    ) {
      return {
        success: false,
        message: "A schedule for this week and year already exists",
        error: error.message,
      };
    }

    return {
      success: false,
      message: "Failed to create schedule",
      error: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}