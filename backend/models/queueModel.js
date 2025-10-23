const mongoese = require("mongoose")

const queuelistSchema = new mongoese.Schema({
  req_url: { type: String },
  original_queue_url: { type: String, default: null },
  req_body: { type: String },
  forecastStatus: { type: String },
  whichIsIn: { type: String },
  expectedServiceTime: { type: String },
  lastUpdatedUTC: { type: String },
  error: { type: String },
  redirectUrl: { type: String, default: null },
  progress: { type: String, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const queuelist = mongoese.model("queuelist", queuelistSchema)
module.exports = queuelist
