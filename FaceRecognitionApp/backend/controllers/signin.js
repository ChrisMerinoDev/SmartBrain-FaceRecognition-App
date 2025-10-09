const handleSignIn = (req, res, DB, bcrypt) => {
    const email = (req.body.email || "").trim().toLowerCase();

    DB.select("email", "hash")
    .from("login")
    .where("email", email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
            return DB.select("*").from("users")
            .where("email", email)
            .then(user => {
                res.json(user[0])
            })
            .catch(error => res.status(400).json("Unable to get user"))
        } else {
            res.status(400).json("Wrong credentials")
        }
    })
    .catch(error => res.status(400).json("Wrong credentials"))
}

export default handleSignIn;