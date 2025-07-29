async function handler({ id }) {
  if (!id) {
    return {
      error: "Template ID is required",
    };
  }

  try {
    // Get the template
    const templates = await sql`
      SELECT * FROM schedule_templates 
      WHERE id = ${id}
    `;

    if (templates.length === 0) {
      return {
        error: "Template not found",
      };
    }

    const template = templates[0];

    // Get the template entries
    const entries = await sql`
      SELECT * FROM template_entries 
      WHERE template_id = ${id}
      ORDER BY 
        CASE 
          WHEN day = 'monday' THEN 1
          WHEN day = 'tuesday' THEN 2
          WHEN day = 'wednesday' THEN 3
          WHEN day = 'thursday' THEN 4
          WHEN day = 'friday' THEN 5
          WHEN day = 'saturday' THEN 6
          WHEN day = 'sunday' THEN 7
        END,
        shift,
        machine
    `;

    return {
      template,
      entries,
    };
  } catch (error) {
    return {
      error: error.message || "Failed to retrieve template",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}