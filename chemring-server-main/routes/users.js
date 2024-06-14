var express = require("express");
const UsersDatabase = require("../models/User");
const { hashPassword } = require("../utils");
var router = express.Router();

router.get("/", async function (req, res, next) {
  const users = await UsersDatabase.find();

  res.status(200).json({ code: "Ok", data: users });
});

/* GET users listing. */
router.get("/:email", async function (req, res, next) {
  const { email } = req.params;

  const user = await UsersDatabase.findOne({ email: email });

  if (!user) {
    res.status(404).json({ message: "user not found" });
    return;
  }

  res.status(200).json({ code: "Ok", data: user });
});

router.get("/art/:_id/:transactionId", async function (req, res, next) {
  const { _id, transactionId } = req.params;

  try {
    const user = await UsersDatabase.findOne({ _id: _id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let item = user.collections.find(col => col._id=== transactionId);

    if (!item) {
      item = user.artWorks.find(art => art._id === transactionId);
      if (!item) {
        return res.status(404).json({ message: "Collection or Artwork not found" });
      }
    }
    
    return res.status(200).json({ code: "Ok", data: item.data });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "An error occurred", error });
  }
});
    
router.delete("/:email/delete", async function (req, res, next) {
  const { email } = req.params;

  const user = await UsersDatabase.findOne({ email: email });

  if (!user) {
    res.status(404).json({ message: "user not found" });
    return;
  }

  user.deleteOne();

  res.status(200).json({ code: "Ok" });
});

router.put("/:_id/profile/update", async function (req, res, next) {
  const { _id } = req.params;
  const { name, email, balance, condition } = req.body;

  try {
    const user = await  UsersDatabase.findOne({ _id: _id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;
    user.balance = balance || user.balance;

    // Update the condition in verification[0].status
    if (user.verification) {
      updateFields["verification.0.status"] = condition;
    } else {
      return res.status(400).json({ message: "Verification data not found" });
    }

    // Perform the update using updateOne with $set
    await user.updateOne(
      { _id },
      { $set: updateFields }
    );

    res.status(200).json({
      success: true,
      message: "Update was successful",
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: "Oops! An error occurred",
    });
  }
});



router.put("/:_id/accounts/update", async function (req, res, next) {
  const { _id } = req.params;
  const accountDict = req.body;
  const data = accountDict.values;

  const user = await UsersDatabase.findOne({ _id: _id });

  if (!user) {
    res.status(404).json({ message: "user not found" });
    return;
  }

  const cummulative = Object.assign({}, user.accounts, JSON.parse(data));

  console.log(cummulative);

  try {
    await user.updateOne({
      accounts: {
        ...cummulative,
      },
    });

    return res.status(200).json({
      message: "Account was updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:_id/accounts", async function (req, res, next) {
  const { _id } = req.params;

  const user = await UsersDatabase.findOne({ _id: _id });

  if (!user) {
    res.status(404).json({ message: "user not found" });
    return;
  }

  return res.status(200).json({
    data: user.accounts,
    message: "update was successful",
  });
});

module.exports = router;
