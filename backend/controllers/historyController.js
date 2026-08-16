const historyModel = require("../models/historyModel")

const SORTABLE = ["finishedAt", "addedAt", "outcome", "waitedMs", "redirectUrl", "original_queue_url", "forecastStatus"]
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/**
 * Mongo filter shared by the history list and the history purge, so the rows a
 * purge removes are exactly the rows the table was showing.
 */
const buildFilter = ({ from, to, outcome, search }) => {
  const filter = {}
  if (outcome && outcome !== "All") filter.outcome = outcome
  if (from || to) {
    filter.finishedAt = {}
    if (from) filter.finishedAt.$gte = new Date(from)
    // a bare date means "up to the end of that day", not midnight
    if (to) filter.finishedAt.$lte = DATE_ONLY.test(to) ? new Date(to + "T23:59:59.999Z") : new Date(to)
  }
  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), "i")
    filter.$or = [{ redirectUrl: rx }, { original_queue_url: rx }, { req_url: rx }]
  }
  return filter
}

/**
 * Copy a live queue row into the history collection before it is deleted.
 * Idempotent: upserted on (req_url, outcome), so calling it twice is a no-op.
 */
module.exports.archive = async (queue, outcome) => {
  if (!queue || !queue.req_url) return
  const addedAt = queue.createdAt ? new Date(queue.createdAt) : null
  try {
    await historyModel.updateOne(
      { req_url: queue.req_url, outcome },
      {
        $setOnInsert: {
          original_queue_url: queue.original_queue_url || null,
          redirectUrl: queue.redirectUrl || null,
          forecastStatus: queue.forecastStatus || null,
          whichIsIn: queue.whichIsIn || null,
          expectedServiceTime: queue.expectedServiceTime || null,
          lastUpdatedUTC: queue.lastUpdatedUTC || null,
          progress: queue.progress == null ? null : String(queue.progress),
          addedAt,
          finishedAt: new Date(),
          waitedMs: addedAt ? Date.now() - addedAt.getTime() : null,
        },
      },
      { upsert: true }
    )
  } catch (error) {
    // a concurrent upsert of the same (req_url, outcome) is expected — archiving
    // must never take down the request that triggered it
  }
}

module.exports.getHistory = async (req, res) => {
  try {
    const { sortBy, sortDir, page, limit } = req.query
    const filter = buildFilter(req.query)

    const sortField = SORTABLE.includes(sortBy) ? sortBy : "finishedAt"
    const dir = sortDir === "asc" ? 1 : -1
    const perPage = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200)
    const current = Math.max(parseInt(page, 10) || 1, 1)

    const [items, total, grouped] = await Promise.all([
      historyModel
        .find(filter)
        .sort({ [sortField]: dir })
        .skip((current - 1) * perPage)
        .limit(perPage)
        .lean(),
      historyModel.countDocuments(filter),
      historyModel.aggregate([{ $group: { _id: "$outcome", count: { $sum: 1 } } }]),
    ])

    const counts = {}
    for (const g of grouped) counts[g._id || "Unknown"] = g.count

    return res.status(200).json({
      items,
      total,
      counts,
      page: current,
      perPage,
      pages: Math.ceil(total / perPage) || 1,
    })
  } catch (error) {
    return res.status(503).json({
      message: "Server error, unable to get history",
      error: true,
    })
  }
}

module.exports.deleteHistory = async (req, res) => {
  try {
    const params = { ...req.query, ...req.body }
    const filter = buildFilter(params)

    // an empty filter would wipe the whole archive, so make that an explicit choice
    const wantsAll = params.all === true || params.all === "true"
    if (Object.keys(filter).length === 0 && !wantsAll) {
      return res.status(400).json({
        message: "Refusing to delete all history without a filter or all=true",
        error: true,
      })
    }

    const result = await historyModel.deleteMany(filter)
    return res.status(200).json({ success: "true", deleted: result.deletedCount })
  } catch (error) {
    return res.status(503).json({
      message: "Server error, unable to delete history",
      error: true,
    })
  }
}
