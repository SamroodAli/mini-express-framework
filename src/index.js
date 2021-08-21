import express from "./express.js"; // this is my own express

const port = 5500;
const app = express();

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});
