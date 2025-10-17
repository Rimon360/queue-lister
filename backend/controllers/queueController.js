const queueModel = require("../models/queueModel")
const { wait, getRandomInRange } = require("../util")

module.exports.add = async (req, res) => {
  const { req_url, req_body } = req.body
  //   const ifExists = await queueModel.find({ req_url })
  //   if (ifExists.length > 0) {
  //     return res.status(400).json({
  //       message: "Already exists",
  //       error: true,
  //     })
  //   }
  const queue = await queueModel.create({
    req_url,
    req_body,
  })
  if (queue) {
    res.status(200).json({
      message: "Queue created successfully",
    })
    return
  }
  res.status(503).json({
    message: "Server error, unable to add",
    error: true,
  })
}

module.exports.get = async (req, res) => {
  try {
    const queues = await queueModel.find().sort({ createAt: -1 })
    if (queues.length > 0) {
      let queueInfo = []
      for (const queue of queues) {
        queueInfo.push(queue)
      }
      return res.status(200).json(queueInfo)
    } else {
      res.status(200).json([])
      return
    }
  } catch (error) {
    res.status(503).json({
      message: "Server error, unable to get",
      error: true,
    })
  }
}
module.exports.status = async (req, res) => {
  const { req_url } = req.body || { req_url: null }
  if (!req_url) {
    res.status(403).json([])
  }
  let queueInfo = []
  let queue = await queueModel.findOne({ req_url }).sort({ progress: 1 }).lean()

  try {
    let result = await fetch(queue.req_url, { method: "POST", body: queue.req_body, headers: { "content-type": "application/json" } })
    result = await result.json()
    let ticket = result.ticket

    if (result.redirectUrl) {
      if (result.redirectUrl.includes("/error?er")) {
        await queueModel.deleteMany({ req_url: queue.req_url })
        queue.req_url = "Expired"
        queue.forecastStatus = "Expired"
        return res.status(200).json([queue])
      }

      await queueModel.updateMany(
        { req_url: queue.req_url },
        {
          $set: {
            req_url: queue.req_url,
            forecastStatus: "Completed",
            progress: null,
            whichIsIn: null,
            expectedServiceTime: null,
            lastUpdatedUTC: null,
            redirectUrl: result.redirectUrl,
            added_date: queue.createdAt,
            error: false,
          },
        }
      )
      queue = await queueModel.findOne({ req_url }).sort({ progress: 1 })
      queueInfo.push(queue)
    } else if (ticket) {
      await queueModel.updateMany(
        { req_url: queue.req_url },
        {
          $set: {
            req_url: queue.req_url,
            forecastStatus: result.forecastStatus,
            progress: ticket.progress,
            whichIsIn: ticket.whichIsIn,
            expectedServiceTime: ticket.expectedServiceTime,
            lastUpdatedUTC: ticket.lastUpdatedUTC,
            redirectUrl: null,
            added_date: queue.createdAt,
            error: false,
          },
        }
      )
      queue = await queueModel.findOne({ req_url }).sort({ progress: 1 })
      queueInfo.push(queue)
    }
  } catch (error) {
    return res.status(200).json([])
  }

  res.status(200).json(queueInfo)
}
module.exports._delete = async (req, res) => {
  const { id } = req.params
  try {
    const result = await queueModel.deleteOne({ _id: id })
    if (result) {
      return res.status(200).json({ success: "true", id })
    } else {
      return res.status(504).json({ error: "true" })
    }
  } catch (error) {
    return res.status(504).json({ error: "true" })
  }
}
