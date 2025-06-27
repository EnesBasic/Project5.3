async function handler({ name, description, scheduleId }) {
  try {
    if (!name) {
      return {
        success: false,
        error: "Template name is required",
      };
    }

    // Create the template
    const templateResult = await sql`
      INSERT INTO schedule_templates (name, description)
      VALUES (${name}, ${description || null})
      RETURNING id, name, description, created_at, updated_at
    `;

    if (!templateResult || templateResult.length === 0) {
      return {
        success: false,
        error: "Failed to create template",
      };
    }

    const newTemplate = templateResult[0];

    // If scheduleId is provided, copy entries from that schedule
    if (scheduleId) {
      // Check if schedule exists
      const scheduleCheck = await sql`
        SELECT id FROM schedules WHERE id = ${scheduleId}
      `;

      if (scheduleCheck.length === 0) {
        // Delete the template we just created since we can't copy entries
        await sql`DELETE FROM schedule_templates WHERE id = ${newTemplate.id}`;

        return {
          success: false,
          error: "Schedule not found",
        };
      }

      // Copy entries from the schedule to the new template
      await sql`
        INSERT INTO template_entries (template_id, day, shift, machine, operator)
        SELECT ${newTemplate.id}, day, shift, machine, operator
        FROM schedule_entries
        WHERE schedule_id = ${scheduleId}
      `;
    }

    return {
      success: true,
      template: newTemplate,
      message: "Template created successfully",
    };
  } catch (error) {
    console.error("Error creating template:", error);
    return {
      success: false,
      error: "Failed to create template",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}