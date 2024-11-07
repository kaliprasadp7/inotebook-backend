const connectToMongo = require('./db');
const express = require('express');
connectToMongo();
const app = express();
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