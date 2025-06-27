async function handler({
  scheduleId,
  weekNumber,
  year,
  dateRange,
  entries,
  operatorColors,
}) {
  try {
    console.log("Update Schedule function called");
    console.log("Received data:", {
      scheduleId,
      weekNumber,
      year,
      dateRange,
      entries,
      operatorColors,
    });

    // Validate required fields
    if (!scheduleId) {
      console.log("Validation failed - missing required field: scheduleId");
      return {
        status: 400,
        body: {
          success: false,
          message: "Schedule ID is required",
        },
      };
    }

    // Validate inputs
    if (weekNumber !== undefined && !Number.isInteger(weekNumber)) {
      return {
        status: 400,
        body: {
          success: false,
          message: "Week number must be an integer",
        },
      };
    }

    if (year !== undefined && !Number.isInteger(year)) {
      return {
        status: 400,
        body: {
          success: false,
          message: "Year must be an integer",
        },
      };
    }

    // Check if schedule exists
    const existingSchedule = await sql`
      SELECT * FROM schedules WHERE id = ${scheduleId}
    `;

    if (existingSchedule.length === 0) {
      console.log("No schedule found with ID:", scheduleId);
      return {
        status: 404,
        body: {
          success: false,
          message: "Schedule not found",
        },
      };
    }

    // Start transaction
    const updates = await sql.transaction(async (txn) => {
      // Build update query dynamically based on provided fields
      let updateFields = [];
      let updateValues = [];
      let paramCount = 1;

      if (weekNumber !== undefined) {
        updateFields.push(`week_number = $${paramCount++}`);
        updateValues.push(weekNumber);
      }

      if (year !== undefined) {
        updateFields.push(`year = $${paramCount++}`);
        updateValues.push(year);
      }

      if (dateRange !== undefined) {
        updateFields.push(`date_range = $${paramCount++}`);
        updateValues.push(dateRange);
      }

      if (operatorColors !== undefined) {
        updateFields.push(`operator_colors = $${paramCount++}`);
        updateValues.push(JSON.stringify(operatorColors));
      }

      // Always update the updated_at timestamp
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

      // If no fields to update, return the existing schedule
      if (updateFields.length === 0) {
        console.log("No changes to update for schedule ID:", scheduleId);
        return {
          status: 400,
          body: {
            success: false,
            message: "No fields to update",
          },
        };
      }

      // Complete the query
      const updateQuery = `UPDATE schedules SET ${updateFields.join(
        ", "
      )} WHERE id = $${paramCount++} RETURNING *`;
      updateValues.push(scheduleId);

      // Execute update query
      const result = await txn(updateQuery, updateValues);

      if (!result || result.length === 0) {
        console.log("No schedule found with ID:", scheduleId);
        return {
          status: 404,
          body: {
            success: false,
            message: "No schedule found with the specified ID",
          },
        };
      }

      const updatedSchedule = result[0];
      console.log("Schedule updated successfully with ID:", updatedSchedule.id);

      // If entries are provided, update them
      if (entries && Array.isArray(entries)) {
        // First, delete all existing entries for this schedule
        await txn`
          DELETE FROM schedule_entries WHERE schedule_id = ${scheduleId}
        `;

        // Then, insert the new entries
        for (const dayEntry of entries) {
          const { day, shifts } = dayEntry;

          if (!shifts || !Array.isArray(shifts)) continue;

          for (const shift of shifts) {
            const { time, operators } = shift;

            if (!operators || typeof operators !== "object") continue;

            for (const [machine, operator] of Object.entries(operators)) {
              if (!operator) continue; // Skip empty operator assignments

              // Convert day to lowercase for database constraint
              const dayLower = day.toLowerCase();

              // Convert shift time to morning/evening for database constraint
              const shiftType = time.startsWith("08") ? "morning" : "evening";

              await txn`
                INSERT INTO schedule_entries 
                (schedule_id, day, shift, machine, operator)
                VALUES (${scheduleId}, ${dayLower}, ${shiftType}, ${machine}, ${operator})
                ON CONFLICT (schedule_id, day, shift, machine) 
                DO UPDATE SET operator = EXCLUDED.operator
              `;
            }
          }
        }
      }

      // Get all entries for this schedule with structured format
      const scheduleEntries = await txn`
        SELECT * FROM schedule_entries WHERE schedule_id = ${scheduleId}
      `;

      return {
        updatedSchedule,
        scheduleEntries,
      };
    });

    // If transaction returned an error status
    if (updates.status) {
      return updates;
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Schedule updated successfully",
        schedule: {
          ...updates.updatedSchedule,
          entries: updates.scheduleEntries,
        },
      },
    };
  } catch (error) {
    console.error("Error updating schedule:", error);
    return {
      status: 500,
      body: {
        success: false,
        message: "Failed to update schedule",
        error: error.message,
      },
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}