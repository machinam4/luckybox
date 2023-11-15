let probability = process.env.GAME_PROBABILITY
function checkIsWin (box) {
    const randomValue = Math.random();
    
    if (randomValue < probability) {
        // console.log(`${randomValue} is less than  ${probability}`)
        const Boxes = [1, 2, 3, 4, 5, 6];
        const index = Boxes.indexOf(box);
        return box === Boxes[index];
    } else {
        return false; // Default value when the probability condition isn't met
    }
}

function claculateWin(box) {
    if (checkIsWin(box)) {
        multiplier = Math.random().toFixed(2);//multiplier less than bet amount
        ///lower odds for higher win amount > 3x
        probability = Math.pow(probability, 2)
        if (checkIsWin(box)) {
            multiplier = ((Math.random() * 3) + 1).toFixed(2);//multiplier less than bet amount 
            //lower odds for higher win amount > 20x  
            probability = Math.pow(probability, 2)
            if (checkIsWin(box)) {
                multiplier = ((Math.random() * 20) + 1).toFixed(2);//multiplier less than bet amount
            }
        }
        won = parseInt(process.env.BET_AMOUNT * multiplier) //calculate win amount in whole nuimbers then apply the 20% tax
        // console.log(won)
        return won

    }
    return 0;
}
exports.getBoxes = async(box) => {
    const prizes = [
        new Intl.NumberFormat().format(Math.round(Math.random() * 100) + 10.00),
        new Intl.NumberFormat().format(Math.round(Math.random() * 1000) + 100),
        new Intl.NumberFormat().format(Math.round(Math.random() * 10000) + 1000),
        new Intl.NumberFormat().format(Math.round(Math.random() * 100000) + 10000),
        new Intl.NumberFormat().format(Math.round(Math.random() * 1000000) + 100000),
        new Intl.NumberFormat().format(Math.round(Math.random() * 10000000) + 1000000),
        "SmartPhone",
        "Motorbike",
        `${new Intl.NumberFormat().format(Math.round(Math.random() * 10000000) + 100)} Voucher`,
        "Smart TV",
        "Water Dispenser",
        "Standing Cooker",
        0
    ];
    const winAmount = await claculateWin(box);
    switch (box) {
        case 1:
            return {
                box1: winAmount,
                box2: prizes[Math.floor(Math.random() * prizes.length)],
                box3: prizes[Math.floor(Math.random() * prizes.length)],
                box4: prizes[Math.floor(Math.random() * prizes.length)],
                box5: prizes[Math.floor(Math.random() * prizes.length)],
                box6: prizes[Math.floor(Math.random() * prizes.length)]
            };
        case 2:
            return {
                box1: prizes[Math.floor(Math.random() * prizes.length)],
                box2: winAmount,
                box3: prizes[Math.floor(Math.random() * prizes.length)],
                box4: prizes[Math.floor(Math.random() * prizes.length)],
                box5: prizes[Math.floor(Math.random() * prizes.length)],
                box6: prizes[Math.floor(Math.random() * prizes.length)]
            };
        case 3:
            return {
                box1: prizes[Math.floor(Math.random() * prizes.length)],
                box2: prizes[Math.floor(Math.random() * prizes.length)],
                box3: winAmount,
                box4: prizes[Math.floor(Math.random() * prizes.length)],
                box5: prizes[Math.floor(Math.random() * prizes.length)],
                box6: prizes[Math.floor(Math.random() * prizes.length)]
            };
        case 4:
            return {
                box1: prizes[Math.floor(Math.random() * prizes.length)],
                box2: prizes[Math.floor(Math.random() * prizes.length)],
                box3: prizes[Math.floor(Math.random() * prizes.length)],
                box4: winAmount,
                box5: prizes[Math.floor(Math.random() * prizes.length)],
                box6: prizes[Math.floor(Math.random() * prizes.length)]
            };
        case 5:
            return {
                box1: prizes[Math.floor(Math.random() * prizes.length)],
                box2: prizes[Math.floor(Math.random() * prizes.length)],
                box3: prizes[Math.floor(Math.random() * prizes.length)],
                box4: prizes[Math.floor(Math.random() * prizes.length)],
                box5: winAmount,
                box6: prizes[Math.floor(Math.random() * prizes.length)]
            };
        case 6:
            return {
                box1: prizes[Math.floor(Math.random() * prizes.length)],
                box2: prizes[Math.floor(Math.random() * prizes.length)],
                box3: prizes[Math.floor(Math.random() * prizes.length)],
                box4: prizes[Math.floor(Math.random() * prizes.length)],
                box5: prizes[Math.floor(Math.random() * prizes.length)],
                box6: winAmount,
            };
        default:
            return {
                box1: "!!ERROR!!",
                box2: "!!ERROR!!",
                box3: "!!ERROR!!",
                box4: "!!ERROR!!",
                box5: "!!ERROR!!",
                box6: "!!ERROR!!"
            };
    }
}

// Example usage
// const box = "Box 1";
// const result = placeBet(box);
// console.log(result);

