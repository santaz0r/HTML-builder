const path = require("path");
const fs = require("fs");

const newPath = path.join(__dirname, "text.txt");

const stream = new fs.ReadStream(newPath, { encoding: "utf-8" });

stream.on("data", (data) => {
  process.stdout.write(data);
});
