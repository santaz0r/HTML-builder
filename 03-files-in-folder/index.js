const { readdir, stat } = require("fs/promises");
const path = require("path");

const secretPath = path.join(__dirname, "secret-folder");
async function someFunc() {
  try {
    const files = await readdir(secretPath);
    const filesPaths = files.map((i) =>
      path.join(__dirname, "secret-folder", i)
    );

    filesPaths.forEach(async (filePath) => {
      const isDirectory = (await stat(filePath)).isDirectory();
      const fileInfo = await stat(filePath);
      if (!isDirectory) {
        const fileName = path.basename(filePath).split(".")[0];
        const extName = path.extname(filePath).replace(".", "");
        const fileSize = fileInfo.size;
        console.log(`${fileName} - ${extName} - ${fileSize}`);
      }
    });
  } catch (err) {
    console.error(err);
  }
}
someFunc();
