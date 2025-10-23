const express = require("express")
const router = express.Router()
const { add, get, _delete, status, _deleteLimited } = require("../controllers/queueController")

router.get("/get", get)
router.post("/add", add)
router.post("/status", status)
router.post("/delete-limited", _deleteLimited)
router.post("/delete/:id", _delete)

module.exports = router
