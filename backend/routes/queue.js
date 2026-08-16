const express = require("express")
const router = express.Router()
const { add, get, _delete, status, _deleteLimited } = require("../controllers/queueController")
const { getHistory, deleteHistory } = require("../controllers/historyController")

router.get("/get", get)
router.get("/history", getHistory)
router.post("/add", add)
router.post("/status", status)
router.post("/history/delete", deleteHistory)
router.post("/delete-limited", _deleteLimited)
router.post("/delete/:id", _delete)

module.exports = router
