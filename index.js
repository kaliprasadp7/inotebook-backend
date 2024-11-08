const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors')
connectToMongo();
const app = express();
// cors is used to fetch api data in the fronted. without cors you can't hit the url endpoint using function
app.use(cors())
app.use(express.json())
const port = 3001


// Available routes
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook app listening on port ${port}`)
})