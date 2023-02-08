const express = require('express')
const multer = require('multer')
const winston = require('winston')
const cors = require("cors")
const app = express()
const port = 3001

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


app.use(express.json())
app.use(cors())


app.get("/", (req, res) => {
  res.json({ message: "hi" })
})
app.post('/logs', upload.single('logFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file was uploaded' });
  }

  if (!req.file.buffer) {
    return res.status(400).json({ error: 'File buffer is undefined' });
  }

  const logContents = req.file.buffer.toString();

  const logs = logContents.split('\n')
  const filteredLogs = logs
    .filter((log) => log.includes('error') || log.includes('warn'))
    .map((log) => {
      const logArray = log.split(' - ')
      const timestamp = new Date(logArray[0]).getTime()
      const loglevel = logArray[1]
      const logObject = JSON.parse(logArray[2])
      return {
        timestamp,
        loglevel,
        transactionId: logObject.transactionId,
        err: logObject.err,
      }
    })
  res.json(filteredLogs)
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
