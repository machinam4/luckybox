const Box = require("../models/Box");
const Player = require("../models/Player");
const { getBoxes } = require("../utils/gamePlay");
const { betWin, betlose } = require("./TransactionController");

exports.placeBet = async (box, player) => {
    try {
        amount = process.env.BET_AMOUNT
        // chck account balance, if low balance, insufficient balance else place bet
        account = player.account
        if (account.balance <= 0 || account.balance < amount || amount <= 0) {
            return {
                status: "error",
                message: "Insufficient funds on the account",
            };
        }
        
        account.balance = account.balance - parseInt(amount)        
        account.save()
        // transfer account funds
        
        // console.log(account)
        //   CHECK BOXES
        return await getBoxes(box).then(async (boxes) => {            
            winAmount = Object.values(boxes)[box-1]
            console.log(winAmount)   
            let taxAmount = 0 //calculate the tax         
            console.log(boxes)
            betStatus = "lose"
            if (winAmount != 0) {
                betStatus = "win"

                taxAmount = Object.values(boxes)[box-1]*0.2 //calculate the tax
                console.log("tax is", taxAmount)
                
                // winnings to db
                // handle winning in accounts
                const winnings = winAmount;
                // const winAmount = winnings;
                // const taxAmount = taxAmount;
                const taxedAmount = winnings - taxAmount;
                const deductData = {
                    taxAmount,
                    winnings,
                    winAmount,
                    amount: taxedAmount,
                    account: account,
                };
                try {
                    console.log(deductData);
                    await betWin(deductData);

                    account.balance += taxedAmount;
                    account.save();
                } catch (error) {
                    console.log(error);
                    return {
                        status: "error",
                        message: "Request Failed Player"
                    }
                }
                // end winningfto db
            }
            if (winAmount == 0) {
                betlose(account);
            }
            // save betboxes yto db 
            await Box.create({
                amount: process.env.BET_AMOUNT,
                choice:box,
                status: betStatus,
                tax: taxAmount,
                boxes: boxes,
                account: account,
                player:player
            })
            return  {
                status: "success",
                boxes: boxes,
                message: betStatus
            }
        })
        // calculate win amount
    } catch (error) {
        console.log(error)
        return {
            status: "error",
            message: "Request Failed"
        }
    }
}
