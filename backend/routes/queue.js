const express = require("express")
const router = express.Router()
const { add, get, _delete, status } = require("../controllers/queueController")

router.get("/get", get)
router.post("/add", add)
router.post("/status", status)
router.post("/delete/:id", _delete)

module.exports = router
