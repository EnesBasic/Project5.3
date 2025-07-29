async function handler({
  imageData,
  imageUrl,
  imageSection = "1",
  previousResults = null,
}) {
  try {
    if (!imageUrl && !imageData) {
      return {
        success: false,
        error: "Image data is required (either imageUrl or imageData)",
      };
    }

    let finalImageUrl = imageUrl;
    let base64Data = null;

    if (!imageUrl && imageData) {
      base64Data = imageData.includes("base64,") ? imageData : imageData;

      const uploadResult = await upload({ base64: base64Data });
      if (uploadResult.error) {
        return {
          success: false,
          error: `Failed to upload image: ${uploadResult.error}`,
        };
      }
      finalImageUrl = uploadResult.url;
    }

    console.log(`Processing image section ${imageSection}`);
    console.log(`Has previous results: ${previousResults !== null}`);

    // Use Claude Sonnet 3.5 instead of GPT Vision
    const systemContent = `You are an expert at analyzing work schedules from images in Croatian/Bosnian format.
    
    Look at this schedule image and extract:
    1. The month and year (if visible)
    2. The date range of the schedule (if visible)
    3. The week number (if visible)
    4. For each day of the week and each shift:
       - Which machines are scheduled
       - Which operators are assigned to each machine
    
    The schedule follows this specific structure:
    - Column headers include: Datum (Date), Dan u sedmici (Day of week), Smjena (Shift), and machine codes (like M58-J-467)
    - Days are in Croatian/Bosnian: ponedjeljak (Monday), utorak (Tuesday), srijeda (Wednesday), četvrtak (Thursday), petak (Friday), subota (Saturday), nedjelja (Sunday)
    - There are two shifts: Morning (08:00-16:00) and Evening (20:00-04:00)
    - Machine codes follow patterns like M58-J-467, M53-E-929, A35-J-924
    - Operators are assigned to specific machines for specific shifts
    
    This is part ${imageSection} of a potentially multi-part schedule image.
    ${
      previousResults ? "Combine this with the previously extracted data." : ""
    }`;

    const userContent = previousResults
      ? `Please analyze this work schedule image and extract all the information in a structured format. I need the week number, year, date range, and all schedule entries with day, shift, machine, and operator information. Look for Croatian/Bosnian day names (ponedjeljak, utorak, srijeda, četvrtak, petak, subota, nedjelja) and machine codes like M58-J-467. This is part ${imageSection} of the schedule. Please analyze and combine with the previous data: ${JSON.stringify(
          previousResults
        )}`
      : `Please analyze this work schedule image and extract all the information in a structured format. I need the week number, year, date range, and all schedule entries with day, shift, machine, and operator information. Look for Croatian/Bosnian day names (ponedjeljak, utorak, srijeda, četvrtak, petak, subota, nedjelja) and machine codes like M58-J-467. This is part ${imageSection} of the schedule.`;

    const response = await fetch("/integrations/anthropic-claude-sonnet-3-5/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: systemContent,
          },
          {
            role: "user",
            content:
              userContent +
              (imageData
                ? ` The image is provided as a base64 string: ${imageData}`
                : ` The image URL is: ${finalImageUrl}`),
          },
        ],
        json_schema: {
          name: "schedule_extraction",
          schema: {
            type: "object",
            properties: {
              month: { type: "string" },
              year: { type: "integer" },
              dateRange: { type: "string" },
              weekNumber: { type: "integer" },
              schedule: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    day: {
                      type: "string",
                      enum: [
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                      ],
                    },
                    shift: {
                      type: "string",
                      enum: ["morning", "evening"],
                    },
                    machine: { type: "string" },
                    operator: { type: "string" },
                  },
                  required: ["day", "shift", "machine", "operator"],
                  additionalProperties: false,
                },
              },
            },
            required: ["month", "year", "dateRange", "weekNumber", "schedule"],
            additionalProperties: false,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Claude API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    if (
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      throw new Error("Invalid response from Claude");
    }

    let scheduleData;
    try {
      scheduleData = JSON.parse(data.choices[0].message.content);

      // Ensure we have all required fields with defaults if needed
      if (!scheduleData.schedule) {
        scheduleData.schedule = [];
      }

      if (!scheduleData.month) {
        const currentDate = new Date();
        scheduleData.month = currentDate.toLocaleString("default", {
          month: "long",
        });
      }

      if (!scheduleData.year) {
        scheduleData.year = new Date().getFullYear();
      }

      if (!scheduleData.dateRange) {
        scheduleData.dateRange = "Current Week";
      }

      if (!scheduleData.weekNumber) {
        const currentDate = new Date();
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const pastDaysOfYear = (currentDate - firstDayOfYear) / 86400000;
        scheduleData.weekNumber = Math.ceil(
          (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
        );
      }
    } catch (parseError) {
      console.error("Error parsing Claude response:", parseError);
      return {
        success: false,
        error: "Error parsing the analysis result",
        rawResult: data.choices[0].message.content,
      };
    }

    // If we have previous results, merge them with the new data
    if (previousResults) {
      const existingEntries = previousResults.schedule || [];
      const newEntries = scheduleData.schedule || [];

      const combinedEntries = [...existingEntries];

      for (const newEntry of newEntries) {
        const isDuplicate = existingEntries.some(
          (existing) =>
            existing.day === newEntry.day &&
            existing.shift === newEntry.shift &&
            existing.machine === newEntry.machine &&
            existing.operator === newEntry.operator
        );

        if (!isDuplicate) {
          combinedEntries.push(newEntry);
        }
      }

      scheduleData = {
        ...previousResults,
        ...scheduleData,
        schedule: combinedEntries,
      };
    }

    // Store the schedule data in the database if it has a week number and year
    if (scheduleData.weekNumber && scheduleData.year) {
      try {
        const existingSchedule = await sql`
          SELECT id FROM schedules 
          WHERE week_number = ${scheduleData.weekNumber} 
          AND year = ${scheduleData.year}
        `;

        let scheduleId;

        if (existingSchedule.length > 0) {
          scheduleId = existingSchedule[0].id;

          await sql`
            DELETE FROM schedule_entries 
            WHERE schedule_id = ${scheduleId}
          `;
        } else {
          const dateRange =
            scheduleData.dateRange ||
            `Week ${scheduleData.weekNumber}, ${scheduleData.year}`;
          const newSchedule = await sql`
            INSERT INTO schedules (week_number, year, date_range)
            VALUES (${scheduleData.weekNumber}, ${scheduleData.year}, ${dateRange})
            RETURNING id
          `;
          scheduleId = newSchedule[0].id;
        }

        if (scheduleData.schedule && scheduleData.schedule.length > 0) {
          const batchSize = 50;
          const entries = scheduleData.schedule;

          for (let i = 0; i < entries.length; i += batchSize) {
            const batch = entries.slice(i, i + batchSize);

            let placeholders = [];
            let params = [];
            let paramIndex = 1;

            for (const entry of batch) {
              placeholders.push(
                `($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${
                  paramIndex + 3
                }, $${paramIndex + 4})`
              );
              params.push(
                scheduleId,
                entry.day,
                entry.shift,
                entry.machine,
                entry.operator || "-"
              );
              paramIndex += 5;
            }

            const query = `
              INSERT INTO schedule_entries 
              (schedule_id, day, shift, machine, operator)
              VALUES ${placeholders.join(", ")}
              ON CONFLICT (schedule_id, day, shift, machine) DO UPDATE
              SET operator = EXCLUDED.operator
            `;

            await sql(query, params);
          }
        }

        scheduleData.id = scheduleId;

        const confidence = {
          weekInfo: scheduleData.weekNumber && scheduleData.year ? 0.9 : 0.5,
          scheduleData: scheduleData.schedule.length > 0 ? 0.8 : 0.3,
        };

        confidence.overall =
          (confidence.weekInfo + confidence.scheduleData) / 2;
        scheduleData.confidence = confidence;
      } catch (dbError) {
        console.error("Database error:", dbError);
        return {
          success: false,
          error: "Database error: " + dbError.message,
          scheduleData,
        };
      }
    }

    return {
      success: true,
      message: `Schedule data extracted successfully from part ${imageSection}`,
      scheduleData,
    };
  } catch (error) {
    console.error("Error in analyze-schedule-image:", error);
    return {
      success: false,
      error: "Error analyzing schedule image: " + error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}