async function handler({ name, description, entries }) {
  try {
    // Validate input
    if (!name || !Array.isArray(entries) || entries.length === 0) {
      return {
        success: false,
        error: "Name and at least one entry are required",
      };
    }

    // Create the template first
    const [template] = await sql`
      INSERT INTO schedule_templates (name, description)
      VALUES (${name}, ${description || null})
      RETURNING id, name, description, created_at, updated_at
    `;

    if (!template || !template.id) {
      return {
        success: false,
        error: "Failed to create template",
      };
    }

    // Prepare entries for insertion
    const templateId = template.id;
    const entryValues = [];
    const entryParams = [];

    entries.forEach((entry, index) => {
      const baseIndex = index * 4;
      entryValues.push(
        `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${
          baseIndex + 4
        }, $${baseIndex + 5})`
      );
      entryParams.push(
        templateId,
        entry.day,
        entry.shift,
        entry.machine,
        entry.operator
      );
    });

    // Insert all entries in a single query
    const entriesQuery = `
      INSERT INTO template_entries (template_id, day, shift, machine, operator)
      VALUES ${entryValues.join(", ")}
      RETURNING id, template_id, day, shift, machine, operator, created_at, updated_at
    `;

    const insertedEntries = await sql(entriesQuery, entryParams);

    return {
      success: true,
      template,
      entries: insertedEntries,
    };
  } catch (error) {
    console.error("Error creating template:", error);

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
      error: error.message || "Failed to create template",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}