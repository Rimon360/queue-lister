const mongoese = require("mongoose")

const historySchema = new mongoese.Schema({
  req_url: { type: String },
  original_queue_url: { type: String, default: null },
  redirectUrl: { type: String, default: null },
  outcome: { type: String }, // Completed | Expired | TimedOut | Abandoned | Deleted
  forecastStatus: { type: String, default: null },
  whichIsIn: { type: String, default: null },
  expectedServiceTime: { type: String, default: null },
  lastUpdatedUTC: { type: String, default: null },
  progress: { type: String, default: null },
  addedAt: { type: Date, default: null }, // createdAt of the live row
  finishedAt: { type: Date, default: Date.now }, // when it left the live table
  waitedMs: { type: Number, default: null },
})

// one row per session per outcome, so re-archiving is a no-op
historySchema.index({ req_url: 1, outcome: 1 }, { unique: true })
historySchema.index({ finishedAt: -1 })
historySchema.index({ outcome: 1, finishedAt: -1 })

const history = mongoese.model("queuehistory", historySchema)
module.exports = history
