const express = require("express");
const app = express();
const connectDb = require("./utils/db");
const blogRouter = require("./router/blog-router");

// Set the JSON and URL-encoded payload limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Blog router
app.use("/api/blog", blogRouter);

// Root route
app.get("/", (req, res) => {
  res.status(200).send("Welcome First client");
});

const PORT = 5000;

// Start server after DB connection
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
});
