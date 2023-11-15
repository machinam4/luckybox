const Organization = require("../models/Organization");
const Transaction = require("../models/Transaction");


exports.deposit = async (data) => {
  const transactionData = {
    amount: data.amount,
    transCode: data.transCode,
    type: "deposit",
    account: data.account,
  };
  try {
    const OrganizationData = await Organization.findOne().sort({
      createdAt: -1,
    });
    // console.log(OrganizationData);
    let newOrganizationData = {};
    if (!OrganizationData) {
      newOrganizationData = {
        totalFunds: Number(transactionData.amount),
        walletFunds: Number(transactionData.amount),
        houseFunds: 0,
        waitingFunds: 0,
        withdrawals: 0,
      };
    } else {
      newOrganizationData = {
        totalTax: OrganizationData.totalTax,
        totalFunds:
          OrganizationData.totalFunds + Number(transactionData.amount),
        walletFunds:
          OrganizationData.walletFunds + Number(transactionData.amount),
        houseFunds: OrganizationData.houseFunds,
        waitingFunds: OrganizationData.waitingFunds,
        withdrawals: OrganizationData.withdrawals,
      };
    }
    await Organization.create(newOrganizationData);
    await Transaction.create(transactionData);
    // emit Organization update event
    return "ok";
  } catch (error) {
    // console.log(error)
    return "failed";
  }
}

exports.betlose = async (account) => {
  const transactionData = {
    amount: parseInt(Number(process.env.BET_AMOUNT)),
    transCode: await generateTransCode(),
    type: "bet",
    account: account,
  };
  const OrganizationData = await Organization.findOne().sort({
    createdAt: -1,
  });
  const newOrganizationData = {
    totalTax: OrganizationData.totalTax,
    totalFunds: OrganizationData.totalFunds,
    walletFunds:
      OrganizationData.walletFunds - parseInt(Number(transactionData.amount)),
    houseFunds: OrganizationData.houseFunds +Number(transactionData.amount),
    waitingFunds:
      OrganizationData.waitingFunds,
    withdrawals: OrganizationData.withdrawals,
  };
  await Organization.create(newOrganizationData);
  await Transaction.create(transactionData);
  // emit Organization update event
  return "ok";
}

generateTransCode = async () => {
  const arrOfDigits = Array.from(String(Date.now()), Number);
  let Code = [];
  let toChars = "";
  await arrOfDigits.forEach((n) => {
    toChars = `${n >= 26 ? toChars(Math.floor(n / 26) - 1) : ""}${"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[n % 26]
      }`;
    Code.push(toChars);
  });
  Code = await Code.join("");
  return Code;
}

exports.betWin = async (data) => {
  const transactionData = {
    taxAmount: data.taxAmount,
    winnings: data.winnings,
    winAmount: data.winAmount,
    amount: data.amount,
    transCode: await generateTransCode(),
    type: "bet",
    account: data.account,
  };
  const OrganizationData = await Organization.findOne().sort({
    createdAt: -1,
  });
  // const payIns =
  //   OrganizationData.waitingFunds - Number(transactionData.amount);
  const newOrganizationData = {
    totalTax: OrganizationData.totalTax + transactionData.taxAmount,
    totalFunds: OrganizationData.totalFunds,
    walletFunds:
      OrganizationData.walletFunds + Number(transactionData.amount),
    houseFunds: OrganizationData.houseFunds-Number(transactionData.amount),
    waitingFunds: OrganizationData.waitingFunds,
    withdrawals: OrganizationData.withdrawals,
  };
  // console.log(OrganizationData)
  // console.log(newOrganizationData)
  await Organization.create(newOrganizationData);
  await Transaction.create(transactionData);
  // emit Organization update event
  return "ok";
}

exports.withdraw = async (data) => {
  const transactionData = {
    amount: data.amount,
    transCode: data.transCode,
    type: "withdrawal",
    account: data.account,
  };
  try {
    const OrganizationData = await Organization.findOne().sort({
      createdAt: -1,
    });
    const newOrganizationData = {
      totalTax: OrganizationData.totalTax,
      totalFunds:
        OrganizationData.totalFunds - Number(transactionData.amount),
      walletFunds:
        OrganizationData.walletFunds - Number(transactionData.amount),
      houseFunds: OrganizationData.houseFunds,
      waitingFunds: OrganizationData.waitingFunds,
      withdrawals:
        OrganizationData.withdrawals + Number(transactionData.amount),
    };
    await Organization.create(newOrganizationData);
    await Transaction.create(transactionData);
    // emit Organization update event
    return "ok";
  } catch (error) {
    // console.log(error)
    return "failed";
  }
}

