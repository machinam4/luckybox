// models/user.js
// This is the game player
// models/player.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const playerSchema = new Schema({
    username: String, // Nullable field
    phoneNumber: {
        type: String,
        required: true,
    },
    role: {
        // bot, player
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
      },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account', // This references the 'account' model
    },
    bets: [
        {
          type: Schema.Types.ObjectId,
          ref: "Box",
        },
      ],

}, {
    timestamps: true,
});

module.exports = mongoose.model('Player', playerSchema);
