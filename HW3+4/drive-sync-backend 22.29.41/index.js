import express from 'express';
const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!")
  })
  
  app.get("/ping", (req, res) => {
    res.send({ success: true })
  })
  
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is listening on port 3000")
  })