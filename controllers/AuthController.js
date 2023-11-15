const moment = require('moment');
const { MsgSend } = require("../utils/smsSend");
const rnd = require("random-number");
const OTP = require('../models/OTP');


exports.generateOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const isCode = await OTP.findOneAndDelete({
            phoneNumber: phoneNumber,
        });
        // if (isCode) {
        //     console.log(isCode);
        //     await isCode.delete();
        // }
        const code = rnd({ min: 100000, max: 999999, integer: true });
        await OTP.create({
            code: code,
            phoneNumber: phoneNumber,
        });
        const msgs = `${code} is your ${process.env.APP_NAME} Verification Code.`;
        console.log(msgs);
        await MsgSend(msgs, phoneNumber).then((success) => {
            return res.json({
                status: "success",
                message: "Verification code sent to your phone",
            });
        });
    } catch (err) {
        // throw new Error(err)
        return res.status(400).json({ status: "error",
        message: 'Registration error' });
    }
};

exports.confirmOTP = async (req, res) => {

    const { phoneNumber, code } = req.body;
    const confirmCode = await OTP.findOne({
        code: code,
        phoneNumber: phoneNumber,
    });
    if (!confirmCode) {
        return res.status(400).json({
            status: "error",
            message: "Invalid Code",
        });
    }
    // if (phoneNumber !== confirmCode.phoneNumber) {
    //     confirmCode.delete();
    //     throw new Error("Invalid Code phone Number");
    // }
    try {
        const expired = moment().diff(moment(confirmCode.createdAt));
        if (expired > 60000) {
            await confirmCode.deleteOne();
            return res.status(400).json({
                status: "error",
                message: "Code Expired, Try again",
            });
        }
        await confirmCode.deleteOne();
        return res.json({
            status: "success",
            message: "Code Verified",
        });
    } catch (error) {
        console.error(new Error(error));
        return res.status(400).json({
            status: "error",
            message: "Request error",
        });
    }
}
