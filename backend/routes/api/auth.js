const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

// @route    GET api/auth/users
// @desc     get user by college id
// @access   Private
router.get("/users/list", [auth], async (req, res) => {
  let user = await User.find().select("-password");
  // console.log(user[0]._id,req.user._id,user[0]._id.toString())
  user = user.filter((u) => u._id.toString() != req.user._id.toString());
  return res.status(200).send({
    success: true,
    message: "",
    data: user,
  });
});

// @route    POST api/auth/login
// @desc     login route
// @access   Public
router.post(
  "/login",
  [
    check("email", "include email").isEmail(),
    check("password", "correct password required").exists("password required"),
  ],
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   console.log(errors);
    //   return res.status(400).json({
    //     success: false,
    //     message: errors.message,
    //     data: "",
    //   });
    // }
    console.log("===================================================ffffffffffffffffffffffff")
    console.log(req.body);
    const { email, password } = req.body;
    try {
      //see if user exists
      let user = await User.findOne({ email });
       

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "invalid id or password",
          data: "",
        });
      }
      //   console.log(user.type)
      if (user.verified === false && user.type != undefined) {
        errors.message =
          "Please contact your supervisor to verify your profile";
        console.log(errors);
        return res.status(400).send({
          success: false,
          message: errors.message,
          data: "",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "invalid id or password",
          data: "",
        });
      }
      delete user["password"];
      //return JWT
      const payload = {
        user,
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).send({
            success: true,
            message: "",
            data: { token, user },
          });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        message: err.message,
        data: "",
      });
    }
  }
);

// @route    PUT api/auth/register
// @desc     register route
// @access   Private
router.post(
  "/register",
  [
    check("email", "include email").isEmail(),
    check("password", "correct password required").exists("password required"),
    check("first_name", "Enter First Name").exists(),
    check("last_name", "Enter Last Name").exists(),
  ],
  async (req, res) => {
    // Check Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({
        success: false,
        message: errors,
        data: "",
      });
    }

    try {
      const { first_name, last_name, email, password } = req.body;
      const user = await User.findOne({ email }).select("-password");

      if (user) {
        errors.message = "Email already exists";
        console.log(errors);
        return res.status(400).send({
          success: false,
          message: errors.message,
          data: "",
        });
      }

      const newUser = new User({
        first_name,
        last_name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);
      await newUser.save();
      const sendingUser = await User.findOne({ email: email });
        // .select("-password");

      const payload = {
        user: sendingUser,
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).send({
            success: true,
            message: "",
            data: { token, user: sendingUser },
          });
        }
      );
    } catch (error) {
      console.error(error)
      res.status(500).send({
        success: false,
        message: error.message,
        data: "",
      });
    }
  }
);

// @route    PUT api/auth/update
// @desc     Update route
// @access   Private
router.put("/update", auth, async (req, res) => {
  try {
    let { email, first_name, last_name, phone, verified } = req.body;

    const updateUserBody = {
      email: email ? email : req.user.email,
      first_name: first_name ? first_name : req.user.first_name,
      last_name: last_name ? last_name : req.user.last_name,
      phone: phone ? phone : req.user.phone,
    };
    await User.findByIdAndUpdate(req.user._id, updateUserBody);

    let user = await User.findById(req.user._id)
      .select("-password")
      .populate("collegeId")
      .populate("agencyId");

    user = await User.findById(req.user._id)
      .select("-password")
      .populate("collegeId")
      .populate("agencyId");
    res.status(200).json({
      success: true,
      message: "",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: "",
    });
  }
});

// @route    DELETE api/auth/delete
// @desc     delete route
// @access   Private
router.delete("/delete", [auth], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({
      success: false,
      message: errors,
      data: "",
    });
  }

  try {
    const user = await User.findByIdAndRemove(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      data: "",
    });
  }
});

// @route    POST api/auth/change/password
// @desc     change password
// @access   Private
router.post(
  "/change/password",
  [
    auth,
    check("old_password", "include old password").exists(),
    check("new_password", "include new password").exists(),
    check("confirm_password", "include confirm password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({
        success: false,
        message: errors,
        data: "",
      });
    }
    try {
      const { old_password, new_password, confirm_password } = req.body;
      let user = await User.findOne({ email: req.user.email });

      if (!user || !bcrypt.compareSync(old_password, user.password)) {
        return res.status(400).json({
          success: false,
          message: "old password doesn't match",
          data: "",
        });
      }
      if (new_password !== confirm_password) {
        return res.status(400).json({
          success: false,
          message: "new password and confirm password doesn't match",
          data: "",
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(new_password, salt);
      user.save();
      user = await User.findById(user._id).select("-password").lean();

      res.status(200).send({
        success: true,
        message: "",
        data: user,
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        success: false,
        message: err.message,
        data: "",
      });
    }
  }
);

// @route    POST api/auth/update/password
// @desc     updatew password
// @access   Private
router.post(
  "/update/password",
  [
    check("linkId", "include linkId").exists(),
    check("password", "include password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({
        success: false,
        message: errors,
        data: "",
      });
    }
    try {
      const { password, linkId } = req.body;
      const forget_user = await ForgetPassword.findOne({ linkId }).select(
        "userId"
      );
      let user = await User.findById(forget_user.userId).select("-password");
      const updateUserBody = {
        password,
      };
      const salt = await bcrypt.genSalt(10);
      updateUserBody.password = await bcrypt.hash(password, salt);
      await User.findByIdAndUpdate(user._id, updateUserBody).select(
        "-password"
      );
      user = await User.findById(user._id).select("-password");

      res.status(200).send({
        success: true,
        message: "",
        data: user,
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send({
        success: false,
        message: err.message,
        data: "",
      });
    }
  }
);

// @route    POST api/auth/userverify
// @desc     verify email
// @access   Public
router.post("/userverify/:userId/:token", async (req, res) => {
  try {
    const { userId, token } = req.params;

    const user = await User.findById(userId);

    const { verificationToken } = user;

    if (token !== verificationToken) {
      return res.status(500).send({
        success: false,
        message: "Token is not valid",
        data: "",
      });
    }

    await User.findByIdAndUpdate(userId, { emailVerified: true });

    return res.status(200).send({
      success: true,
      message: "",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
      data: "",
    });
  }
});

module.exports = router;
