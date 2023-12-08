// controllers/playerController.js
const Player = require('../models/Player');
const Account = require('../models/Account');
const { MsgSend } = require("../utils/smsSend");
const { placeBet } = require('./BetsController');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Box = require('../models/Box');



const generateAccNo = () => {
  // create user account no using id
  // const arrOfDigits = Array.from(String(user.id), Number);
  const rnumber = Date.now() % 9999; //number to generate account
  const arrOfDigits = Array.from(String(rnumber), Number);
  let AccountNo = [];
  let toChars = "";
  arrOfDigits.forEach((n) => {
    toChars = `${n >= 26 ? toChars(Math.floor(n / 26) - 1) : ""}${"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[n % 26]
      }`;
    AccountNo.push(toChars);
  });
  const potentialAccountNo = AccountNo.join("")
  //check if account number was already generated
  return Account.findOne({ accountNumber: potentialAccountNo }).then((existingAccount) => {
    if (existingAccount) {
      return generateAccNo();
    } else {
      // If the account number is unique, return it
      return potentialAccountNo;
    }
  }).catch((error) => {
    // Handle any errors during the database query
    throw error;
  });
  // return AccountNo;
};

exports.registerPlayer = async (req, res) => {
  try {
    const { phoneNumber, username, password } = req.body;
    const player = await Player.findOne({ phoneNumber: phoneNumber });
    if (player) {
      return res.json({
        status: "accepted", message: "User Already Exists"});
      // return res.json(player)
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newPlayer = await Player.create({
      phoneNumber: phoneNumber,
      username: username,
      role: "player",
      password: hashedPassword
    });
    const AccountNo = await generateAccNo();
    const account = new Account({
      accountNumber: AccountNo,
      player: newPlayer,
    });
    await account.save();
    newPlayer.account = account;
    await newPlayer.save();

    return res.json({ status: "success",
    message: "Registration successful" });
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: 'Registration failed' });
  }
};
exports.loginPlayer = async (req, res) => {
  const { phoneNumber, password } = req.body
  const user = await Player.findOne({ phoneNumber: phoneNumber });
  if (!user) {
    return res.status(400).json({
      status: "Error",message: "User Not Found"});
  }
  const isUser = await bcrypt.compare(password, user.password);
  if (!isUser) {
    return res.status(400).json({
      status: "Error",message: "Incorrect Password/Phone Number"});
  }
  const token = await jwt.sign(
    { userId: user.id, phoneNumber: user.phoneNumber },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );
  return res.json({
    userId: user.id,
    username: user.username,
    token,
    tokenValidity: 24000,
  });
},

exports.playerBet = async (req, res) => {
  try {
    const { choice, phoneNumber } = req.body;
    const box = choice.toLowerCase();

    if (box === 'box') {
      const message = "Karibu LUCKYBOX!\n**\nPESA TASLIMU na MALI KEMKEM zimewekwa kwenye sanduku TANO.\n**\nBox 1\nBox 2\nBox 3\nBox 4\nBox 5\n**\nChomoka na PESA au MALI.Tuma chaguo lako kwa 25250 USHINDE sasa hivi!\nSTOP?*456*9*5#";
      // MsgSend(message, phoneNumber);
      return res.json({
        status: "success",
        message: message
      })
    } else if (/^(box\s?[1-5]|^[1-5])$/i.test(box)) {
      const intValue = parseInt(box.match(/\d+/)[0]);
      return await Player.findOne({ phoneNumber: phoneNumber }).populate('account').then(async (player) => {
        if (!player) {
          // throw new Error("User Already Exists");
          return res.json({
            status: "Error",
            message: "Player Not Found"
          })
        }
        // handle betting
        const result = await placeBet(intValue, player)
        // console.log(result)
        return res.json(result)
        // return TransactionController.stkpush();
      });

    } else {
      const errorMessage = `Samahani! Umekosea.\n**\nUlichagua ${data}.\n**\nCheza kwa kuchagua NUMBER (1-5).\n**\nMfano: 1\n**\nChagua TENA USHINDE!\n1:BOX 1\n2:BOX 2\n3:BOX 3\n4:BOX4\n5:BOX5\n**\\**\nCheza Tena  uingie kwa DRAW ya leo!\nSTOP*456*9*5#\n`;
      // MsgSend(errorMessage, phoneNumber);
      return res.json({
        status: "success",
        message: errorMessage
      })
    }
  } catch (error) {
    res.json({
      status: "error",
      message: "Request Failed, try again"
    })
  }
};

exports.getboxes = async (req, res)=>{
  return await Box.find().select('boxes')
}

// handle Mobile Origin SMS
exports.handleMOSms = async (req, res) => {
  const data = req.body;
  const message = data.Message;
  const phoneNumber = data.Msisdn;
  const box = message.toLowerCase();

  if (box === 'box') {
    const sms = "Karibu LUCKYBOX!\n**\nPESA TASLIMU na MALI KEMKEM zimewekwa kwenye sanduku TANO.\n**\nBox 1\nBox 2\nBox 3\nBox 4\nBox 5\n**\nChomoka na PESA au MALI.Tuma chaguo lako kwa 25250 USHINDE sasa hivi!\nSTOP?*456*9*5#";
    MsgSend(sms, phoneNumber);
  } else if (/^(box\s?[1-5]|^[1-5])$/i.test(box)) {
    const intValue = parseInt(box.match(/\d+/)[0]);
    return await Player.findOne({ phoneNumber: phoneNumber }).populate('account').then((player) => {
      if (!player) {
        // throw new Error("User Already Exists");
        return res.json({
          status: "Error",
          message: "Player Not Found"
        })
      }
      // handle betting
      return BetsController.placeBet(intValue, player)
      // return TransactionController.stkpush();
    });

  } else {
    const errorMessage = `Samahani! Umekosea.\n**\nUlichagua ${message}.\n**\nCheza kwa kuchagua NUMBER (1-5).\n**\nMfano: 1\n**\nChagua TENA USHINDE!\n1:BOX 1\n2:BOX 2\n3:BOX 3\n4:BOX4\n5:BOX5\n**\\**\nCheza Tena  uingie kwa DRAW ya leo!\nSTOP*456*9*5#\n`;
    MsgSend(errorMessage, phoneNumber);
  }

  res.status(200).json("its okay");
};
