const mongoese = require("mongoose")

const queuelistSchema = new mongoese.Schema({
  req_url: { type: String },
  req_body: { type: String },
  redirectUrl: { type: String, default: null },
  progress: { type: String, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const queuelist = mongoese.model("queuelist", queuelistSchema)
module.exports = queuelist
