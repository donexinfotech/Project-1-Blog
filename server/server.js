const cors = require("cors");
const express = require("express");
const app = express();
const connectDb = require("./utils/db");
const blogRouter = require("./router/blog-router");
const authRouter = require("./router/auth-router");
const commentRouter = require("./router/comment-router")
const quizRouter = require("./router/quiz-router")

app.use(cors({
  origin: '*',
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  allowedHeaders: 'Content-Type,Authorization'
}))

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Blog router
app.use("/api/blog", blogRouter);
app.use("/api/auth", authRouter);
app.use("/api/comment", commentRouter);
app.use("/api/quiz", quizRouter);

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
