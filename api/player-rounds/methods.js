import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import { PlayerRounds } from "./player-rounds";
import shared from "../../shared.js";

export const updatePlayerRoundData = new ValidatedMethod({
  name: "PlayerRounds.methods.updateData",

  validate: new SimpleSchema({
    playerRoundId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    key: {
      type: String
    },
    value: {
      type: String
    },
    append: {
      type: Boolean,
      optional: true
    },
    noCallback: {
      type: Boolean,
      optional: true
    }
  }).validator(),

  run({ playerRoundId, key, value, append, noCallback }) {
    const playerRound = PlayerRounds.findOne(playerRoundId);
    if (!playerRound) {
      throw new Error("playerRound not found");
    }
    // TODO check can update this record playerRound

    const val = JSON.parse(value);
    let update = { [`data.${key}`]: val };
    const modifier = append ? { $push: update } : { $set: update };

    PlayerRounds.update(playerRoundId, modifier, {
      autoConvert: false,
      filter: false,
      validate: false
    });

    if (Meteor.isServer && !noCallback) {
      shared.callOnChange({
        playerId: playerRound.playerId,
        playerRoundId,
        playerRound,
        key,
        value: val,
        prevValue: playerRound.data && playerRound.data[key],
        append
      });
    }
  }
});
