const getProfile = (req, res, DB) => {
    const { id } = req.params;
    const user = DB.select("*").from("users").where({ id })
    .then(singleUser => {
        if (singleUser.length) {
            res.json(singleUser[0])
        } else {
            res.status(400).json("Not found")
        }
    })
    .catch(err => res.status(400).json("error getting user"))
    }

export default getProfile;