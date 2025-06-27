async function handler({ templateId, name, description, entries }) {
  try {
    // Validate required fields
    if (!templateId) {
      return {
        success: false,
        error: "Template ID is required",
      };
    }

    // Check if template exists
    const templateCheck = await sql`
      SELECT id FROM schedule_templates WHERE id = ${templateId}
    `;

    if (templateCheck.length === 0) {
      return {
        success: false,
        error: "Template not found",
      };
    }

    // Start a transaction for updating template and entries
    const result = await sql.transaction(async (txn) => {
      // Update template details if provided
      if (name || description) {
        const updateFields = [];
        const updateValues = [];
        let paramCount = 1;

        if (name) {
          updateFields.push(`name = $${paramCount}`);
          updateValues.push(name);
          paramCount++;
        }

        if (description) {
          updateFields.push(`description = $${paramCount}`);
          updateValues.push(description);
          paramCount++;
        }

        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

        const updateQuery = `
          UPDATE schedule_templates 
          SET ${updateFields.join(", ")} 
          WHERE id = $${paramCount}
          RETURNING id, name, description
        `;

        updateValues.push(templateId);

        const updatedTemplate = await txn(updateQuery, updateValues);
      }

      // Update template entries if provided
      if (entries && Array.isArray(entries) && entries.length > 0) {
        // Delete existing entries
        await txn`
          DELETE FROM template_entries WHERE template_id = ${templateId}
        `;

        // Insert new entries
        for (const entry of entries) {
          await txn`
            INSERT INTO template_entries 
            (template_id, day, shift, machine, operator)
            VALUES 
            (${templateId}, ${entry.day}, ${entry.shift}, ${entry.machine}, ${entry.operator})
          `;
        }
      }

      // Get updated template with entries
      const updatedTemplate = await txn`
        SELECT id, name, description, created_at, updated_at
        FROM schedule_templates
        WHERE id = ${templateId}
      `;

      const updatedEntries = await txn`
        SELECT id, day, shift, machine, operator
        FROM template_entries
        WHERE template_id = ${templateId}
        ORDER BY day, shift, machine
      `;

      return {
        template: updatedTemplate[0],
        entries: updatedEntries,
      };
    });

    return {
      success: true,
      message: "Template updated successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error updating template:", error);

    // Handle unique constraint violations
    if (error.code === "23505") {
      return {
        success: false,
        error:
          "Duplicate entry found. Each combination of day, shift, and machine must be unique.",
      };
    }

    return {
      success: false,
      error: "Failed to update template",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}