const createError = require("http-errors")
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const mongoose = require("mongoose")
const dbConfig = require("./config/dbConfig")
const indexRouter = require("./routes/index")
const queue = require("./routes/queue")
const helmet = require("helmet")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const app = express()

mongoose
  .connect(dbConfig.url)
  .then(() => {
    console.log("MongoDB connected")
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
  })

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100000, // limit each IP
})

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

app.use(limiter)
app.use(cors()) // Allow all origins, adjust as needed
app.use(helmet()) // for security headers
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/api/queue", queue)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: "Not found" })
})

const port = process.env.PORT || 8000

app.listen(port, "0.0.0.0", () => {
  console.log("Server running on port: http://localhost:" + port)
})
