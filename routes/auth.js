const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "mysecretsignature%#@"

// Create a user using: POST "/api/auth/createuser" doesn't require auth
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be 5 character').isLength({ min: 5 })
], async (req, res) => {
    // If there are errors return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    try {
        // Check wheather the user exist already or not
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry the user is already exists" });
        }

        const salt = await bcrypt.genSaltSync(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        const data = {
            user:{
                id:user.id
            }
        }
        const authtoken = jwt.sign(data, 'JWT_SECRET');
        res.send({authtoken});
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})






// Login a user using: POST "/api/auth/login" No login required
router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be empty').exists()
], async (req, res) => {
    // If there are errors return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error : "Please login with correct credentials"});
        }

        const passwordcompare = await bcrypt.compare(password, user.password);
        if(!passwordcompare){
            return res.status(400).json({error : "Please login with correct credentials"});
        }

        const data = {
            user:{
                id:user.id
            }
        }
        const authtoken = jwt.sign(data, 'JWT_SECRET');
        res.send({authtoken});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})

module.exports = router