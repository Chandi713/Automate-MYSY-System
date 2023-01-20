const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");

// jwt secret key
const JWT_SECRET = process.env.JWT_SECRET;

// ROUTE 1: Create a User using : POST "api/auth/createUser" , No login required
router.post("/createUser", async (req, res) => {
  let success = false;

  // If there are error then return the bad request and error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
    if (req.body.name.isLength <= 2) {
      return res.status(400).json({
        success,
        errors: "Name must be atleast 2 characters long",
      });
    }

    // check whether the user with same mobile number exists already
    let user = await User.findOne({ mobileNo: req.body.mobileNo });
    if (user) {
      return res.status(400).json({
        success,
        errors: "Mobile Number is already registered",
      });
    }

    // hashing a password
    const salt = bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      admissionAfter: req.body.admissionAfter,
      board: req.body.board,
      stream: req.body.stream,
      passingYear: req.body.passingYear,
      admissionYear: req.body.admissionYear,
      seatNumber: req.body.seatNumber,
      name: req.body.name,
      mobileNo: req.body.mobileNo,
      password: secPass,
    });

    const data = {
      user: {
        id: user.id,
      },
    };

    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error\n" + error.message);
  }
});

//ROUTE 2  : login a Member using : POST "api/auth/signin" , No login required
router.post("/signin", async (req, res) => {
  let success = false;
  // If there are error then return the bad request and error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { mobileNo, password } = req.body;

  try {
    let user = await User.findOne({ mobileNo });
    if (!user) {
      success = false;
      return res
        .status(400)
        .json({ errors: "Please try to login with correct credentials" });
    }
    if (req.body.password === "") {
      return res.status(400).json({
        success,
        errors: "Password can not be blank",
      });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({
        success,
        errors: "Please try to login with correct credentials",
      });
    }
    const data = {
      user: {
        id: user.id,
      },
    };

    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 3 : Get loggedin User Details using : POST "/api/auth/getmember" Login required
router.get("/getUsers", async (req, res) => {
  try {
    const data = await User.find({});
    res.json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
module.exports = router;
