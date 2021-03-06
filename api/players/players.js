import SimpleSchema from "simpl-schema";

import { TimestampSchema, UserDataSchema, BelongsTo } from "../default-schemas";

export const Players = new Mongo.Collection("players");

export const exitStatuses = [
  "gameFull",
  "gameCancelled",
  "gameLobbyTimedOut",
  "playerEndedLobbyWait",
  "playerLobbyTimedOut",
  "finished"
];

Players.schema = new SimpleSchema({
  // The Player `id` is used to uniquely identify the player to avoid
  // having a user play multiple times. It can be any string, for example
  // an email address, a Mechanical Turk ID, a manually assigned participation
  // number (saved as string), etc...
  id: {
    type: String,
    max: 256
  },

  // params contains any URL passed parameters
  urlParams: {
    type: Object,
    blackbox: true,
    defaultValue: {}
  },

  bot: {
    label: "Name of bot definition if player is a bot",
    type: String,
    optional: true,
    index: 1
  },

  // Time at witch the player became ready (done with intro)
  readyAt: {
    label: "Ready At",
    type: Date,
    optional: true
  },

  timeoutStartedAt: {
    label: "Time the first player arrived in the lobby",
    type: Date,
    optional: true
  },
  timeoutWaitCount: {
    label: "Number of time the player has waited for timeoutStartedAt",
    type: SimpleSchema.Integer,
    optional: true,
    min: 1
  },

  exitStepsDone: {
    type: Array,
    defaultValue: []
  },
  "exitStepsDone.$": {
    type: String
  },

  // Failed fields are filled when the player's participation in a game failed
  exitAt: {
    label: "Exited At",
    type: Date,
    optional: true
  },
  exitStatus: {
    label: "Failed Reason",
    type: String,
    optional: true,
    allowedValues: exitStatuses
  },

  // A player can be retired. Retired players should no longer be used in active
  // game, but NOTHING is done in the code to block that from happening. It's
  // more of an indicator for debugging down the line.
  retiredAt: {
    label: "Retired At",
    type: Date,
    optional: true
  },
  retiredReason: {
    label: "Retired Reason",
    type: String,
    optional: true,
    allowedValues: exitStatuses
  }
});

Players.schema.extend(TimestampSchema);
Players.schema.extend(UserDataSchema);
Players.schema.extend(BelongsTo("Games", false));
Players.schema.extend(BelongsTo("GameLobbies", false));
Players.attachSchema(Players.schema);
