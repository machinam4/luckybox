const Player = require("./models/Player");
const { faker } = require('@faker-js/faker');
const { getBoxes } = require("./utils/gamePlay");
const Box = require("./models/Box");

exports.createBots = async () => {
    try {
        console.log("creating bots");
        await Player.findOne({role:"bot"}).then(async(bot)=>{
            if(bot){
            return "ok"
        }
        for (let i = 0; i < 50; i++) {
            const winner = await Player.create({
                username: faker.internet.userName(),
                phoneNumber: "254700000000",
                role: "bot",
                password: faker.internet.password()
            });
            console.log(`Bot ${i + 1} created:`, winner);
        }
        console.log('Creation of bots completed.');
        return "ok"})
    } catch (error) {
        console.error('Error creating bots:', error.message);
        throw new Error(error)
    }
};

exports.botplay = async (io) => {
    try {
        const skipR = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
        await Player.findOne({ role: "bot" }).skip(skipR).then(async (bot)=>{
            if(!bot){
                return
            }
            console.log(bot)
        if (bot) {
            console.log('Random Bot Player:', bot);
            box = Math.floor(Math.random() * 6) + 1;
            await getBoxes(box).then(async (boxes) => {
                betStatus = "lose"
                if (Object.values(boxes)[box - 1] != 0) {
                    betStatus = "win"
    
                }
                const winner = await Box({
                    amount: process.env.BET_AMOUNT,
                    choice: box,
                    status: betStatus,
                    boxes: boxes,
                    account: bot,
                    player: bot
                })
                await winner.save()            
                // Emit the random winner
                io.sockets.emit('bet_winner', winner);
            })
        } else {
            return "ok"
        }
        });
        
    
        
    } catch (error) {
        console.error('Error fetching bots:', error.message);
        throw new Error(error)
    }
    const randomTimeInterval = Math.floor(Math.random() * (120000 - 10000 + 1)) + 10000;    // Random time interval between 1 to 2mins
        // const randomTimeInterval = Math.floor(Math.random() * 5000) + 1000;
        setTimeout(() => exports.botplay(io), randomTimeInterval); // Schedule the next emit
}