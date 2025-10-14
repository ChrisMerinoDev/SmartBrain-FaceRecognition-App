// controllers/register.js
const handleRegister = async (req, res, DB, bcrypt) => {
    const { email, name, password } = req.body || {};
  
    // Basic validation
    if (!email?.trim() || !name?.trim() || !password?.trim()) {
      return res.status(400).json({ error: "Please provide name, email, and password." });
    }
    const normalizedEmail = String(email).toLowerCase().trim();
    const trimmedName = String(name).trim();
  
    // Very light email check (optional: use a stricter validator lib)
    const emailOk = /^\S+@\S+\.\S+$/.test(normalizedEmail);
    if (!emailOk) return res.status(400).json({ error: "Please enter a valid email address." });
  
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }
  
    try {
      const hash = await bcrypt.hash(password, 10);
  
      const user = await DB.transaction(async (trx) => {
        // Insert into login
        const [loginRow] = await trx("login")
          .insert({ email: normalizedEmail, hash })
          .returning(["email"]);
  
        // Insert into users
        const [newUser] = await trx("users")
          .insert({
            email: loginRow.email,
            name: trimmedName,
            joined: new Date(),
            entries: 0, // ensure default exists (optional)
          })
          .returning(["id", "name", "email", "entries", "joined"]);
  
        return newUser;
      });
  
      return res.status(201).json(user);
    } catch (error) {
      console.error("Register error:", {
        code: error?.code,
        detail: error?.detail,
        message: error?.message,
        constraint: error?.constraint,
        stack: error?.stack,
      });
      if (error?.code === "23505") {
        return res.status(409).json({ error: "Email already exists." });
      }
      return res.status(400).json({ error: "Unable to register." });
    }
  };
  
  export default handleRegister;
  