// controllers/imageEntries.js
export default async function imageEntries(req, res, DB) {
    try {
      const rawId = req.body?.id;
      const id = Number(rawId);
  
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid or missing user id" });
      }
  
      // Try standard increment+returning (Postgres supports this)
      let rows = await DB("users")
        .where({ id })
        .increment("entries", 1)
        .returning(["entries"]); // -> [{ entries: '5' }] (often a string)
  
      // Fallback for environments where returning with increment misbehaves
      if (!rows || rows.length === 0) {
        rows = await DB("users")
          .where({ id })
          .update({ entries: DB.raw("COALESCE(entries, 0) + 1") }, ["entries"]);
      }
  
      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const entries = Number(rows[0].entries);
      return res.json(entries); // frontend expects a number
    } catch (err) {
      console.error("imageEntries error:", err);
      return res.status(500).json({ error: "Unable to update entries" });
    }
  }
  