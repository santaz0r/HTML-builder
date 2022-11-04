const fs = require("fs");
const path = require("path");
const { stdin, stdout } = process;

const textPath = path.join(__dirname, "text.txt");

fs.open(textPath, "w", (err) => {
  if (err) throw err;
});

stdout.write("Введите текст\n");
stdin.on("data", (data) => {
  const text = data.toString().trim();
  text === "exit" ? handleBye() : appendText(text + " ");
});
process.on("SIGINT", handleBye);

function appendText(text) {
  fs.appendFile(textPath, text, (err) => {
    if (err) throw err;
  });
}

function handleBye() {
  stdout.write("Пока-пока");
  process.exit();
}
