const express = require("express");
const app = express();
const connectDb = require("./utils/db");
const blogRouter = require("./router/blog-router");

app.use(express.json());
app.use("/api/blog", blogRouter);

app.get("/", (req, res) => {
  res.status(200).send("Welcome First client");
});

const PORT = 5000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
});
