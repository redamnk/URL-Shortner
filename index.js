const express = require("express");
const server = express();
const PORT = 4000;
const DATABASE = new Map();

server.use(express.json());

// GET route to greet
server.get("/api/v1/greet", (req, res) => {
  console.log("Request received");
  res.send({
    success: true,
    message: "Hello, babey!",
  });
});

// POST route to create a short URL
server.post("/api/v1/short-url/new", (req, res) => {
  console.log(req.body);
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      message: "URL is required",
    });
  }

  // Generate a 6-character unique ID
  const keyid = generateUniqueID(6);

  // Link URL to the unique ID
  DATABASE.set(keyid, url);

  res.status(201).json({
    success: true,
    message: "Short URL created",
    shortUrl: `http://localhost:${request.host}/${keyid}`,
  });
});

// GET route to handle redirection
server.get("/:keyid", (req, res) => {
  const { keyid } = req.params;

  // Check if the key exists in the database
  if (!DATABASE.has(keyid)) {
    return res.status(404).json({
      success: false,
      message: "Error: Key not found in database",
    });
  }

  // Redirect to the original URL
  const originalUrl = DATABASE.get(keyid);
  res.redirect(originalUrl);
});

// Start the server
server.listen(PORT, () => {
  console.log("Server is started on PORT:", PORT);
});

// Function to generate a unique ID
function generateUniqueID(charCount) {
  const possibleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < charCount; i++) {
    const uniqueIndex = Math.floor(Math.random() * possibleChars.length);
    result += possibleChars[uniqueIndex];
  }
  return result;
}
