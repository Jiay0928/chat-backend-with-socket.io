const express = require("express");
const router = express.Router();



const HandleLogin = async(req,res) => {
    const {username, room} = req.body;
    if (username === ''|| room === ''){
        return res.status(400).json({message: "no input"});
    }
    console.log(req.body);
    return res.status(200).json({message:"login succeed"})
}
router.post('/login', HandleLogin);
module.exports = router;