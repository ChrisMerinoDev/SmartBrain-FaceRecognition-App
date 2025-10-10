// controllers/signin.js
const handleSignIn = async (req, res, DB, bcrypt) => {
    try {
      const { email, password } = req.body || {};
  
      // Basic validation
      if (!email?.trim() || !password?.trim()) {
        return res.status(400).json({ error: "Please enter both email and password." });
      }
  
      const normalizedEmail = String(email).toLowerCase().trim();
  
      // Find login row
      const loginRow = await DB("login")
        .select("email", "hash")
        .where({ email: normalizedEmail })
        .first();
  
      // Generic error to avoid user enumeration
      if (!loginRow) {
        return res.status(400).json({ error: "Invalid credentials." });
      }
  
      // Compare password
      const isValid = await bcrypt.compare(password, loginRow.hash);
      if (!isValid) {
        return res.status(400).json({ error: "Invalid credentials." });
      }
  
      // Load user profile
      const user = await DB("users")
        .select("id", "name", "email", "entries", "joined")
        .where({ email: normalizedEmail })
        .first();
  
      if (!user) {
        // Still keep it generic for security
        return res.status(400).json({ error: "Invalid credentials." });
      }
  
      // Success
      return res.status(200).json(user);
    } catch (err) {
      console.error("Signin error:", err);
      return res.status(500).json({ error: "Unable to sign in. Please try again later." });
    }
  };
  
  export default handleSignIn;
  