async function handler({ scheduleId }) {
  if (!scheduleId) {
    return { error: "Schedule ID is required" };
  }

  try {
    // Get all entries for the specified schedule
    const entries = await sql`
      SELECT * FROM schedule_entries 
      WHERE schedule_id = ${scheduleId}
      ORDER BY day, shift, operator
    `;

    if (entries.length === 0) {
      return { conflicts: [], message: "No schedule entries found" };
    }

    const conflicts = [];
    const dayOrder = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 7,
    };

    // Check for same shift conflicts (operator assigned to multiple machines in same shift)
    const sameShiftConflicts = [];
    const shiftMap = {};

    entries.forEach((entry) => {
      const key = `${entry.day}-${entry.shift}-${entry.operator}`;
      if (!shiftMap[key]) {
        shiftMap[key] = [];
      }
      shiftMap[key].push(entry);
    });

    // Find operators assigned to multiple machines in the same shift
    Object.values(shiftMap).forEach((shiftEntries) => {
      if (shiftEntries.length > 1) {
        sameShiftConflicts.push({
          type: "same_shift",
          operator: shiftEntries[0].operator,
          day: shiftEntries[0].day,
          shift: shiftEntries[0].shift,
          machines: shiftEntries.map((entry) => entry.machine),
          entries: shiftEntries,
        });
      }
    });

    // Check for consecutive shift conflicts (not enough rest between shifts)
    const consecutiveShiftConflicts = [];
    const operatorSchedule = {};

    // Group entries by operator
    entries.forEach((entry) => {
      if (!operatorSchedule[entry.operator]) {
        operatorSchedule[entry.operator] = [];
      }
      operatorSchedule[entry.operator].push(entry);
    });

    // Sort each operator's entries by day and shift
    Object.keys(operatorSchedule).forEach((operator) => {
      operatorSchedule[operator].sort((a, b) => {
        if (dayOrder[a.day] !== dayOrder[b.day]) {
          return dayOrder[a.day] - dayOrder[b.day];
        }
        return a.shift === "morning" ? -1 : 1;
      });

      // Check for consecutive shifts
      const shifts = operatorSchedule[operator];
      for (let i = 0; i < shifts.length - 1; i++) {
        const currentShift = shifts[i];
        const nextShift = shifts[i + 1];

        // Check if shifts are consecutive (same day evening followed by next day morning)
        if (
          (currentShift.shift === "evening" &&
            nextShift.shift === "morning" &&
            dayOrder[nextShift.day] === dayOrder[currentShift.day] + 1) ||
          // Or same day morning to evening (no rest between shifts)
          (currentShift.shift === "morning" &&
            nextShift.shift === "evening" &&
            currentShift.day === nextShift.day)
        ) {
          consecutiveShiftConflicts.push({
            type: "consecutive_shift",
            operator: operator,
            firstShift: {
              day: currentShift.day,
              shift: currentShift.shift,
              machine: currentShift.machine,
            },
            secondShift: {
              day: nextShift.day,
              shift: nextShift.shift,
              machine: nextShift.machine,
            },
            entries: [currentShift, nextShift],
          });
        }
      }
    });

    conflicts.push(...sameShiftConflicts, ...consecutiveShiftConflicts);

    return {
      conflicts,
      sameShiftConflicts: sameShiftConflicts.length,
      consecutiveShiftConflicts: consecutiveShiftConflicts.length,
      totalConflicts: conflicts.length,
    };
  } catch (error) {
    console.error("Error checking schedule conflicts:", error);
    return {
      error: "Failed to check schedule conflicts",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}