const handleRegister = async(req, res, DB, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) return res.status(400).json("Missing fields");

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await DB.transaction(async (trx) => {
            const [loginRow] = await trx("login")
            .insert({ 
                email: email.toLowerCase(), 
                hash: hashedPassword 
            })
            .returning(["email"]);

            const [newUser] = await trx("users")
            .insert({
                email: loginRow.email,
                name,
                joined: new Date()
            })
            .returning("*");

            return newUser;
        });
        return res.status(201).json(user);
    } catch (error) {
        if (error.code === "23505") return res.status(409).json("Email already exists.");
        console.error(error);
        res.status(400).json("Unable to register");
    }
}

export default handleRegister;