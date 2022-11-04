const fsPromises = require("fs/promises");
const path = require("path");

const copyPath = path.join(__dirname, "files-copy");

const copyFromPath = path.join(__dirname, "files");

async function copyDir() {
  try {
    fsPromises.mkdir(copyPath, { recursive: true }, (err) => {
      if (err) throw err;
    });
    const copiedFrom = await fsPromises.readdir(copyFromPath);
    const isEmpty = (await fsPromises.readdir(copyPath)).length === 0;
    if (isEmpty) {
      copyFiles(copiedFrom, copyFromPath);
    } else {
      const clonedFiles = await fsPromises.readdir(copyPath);
      clonedFiles.forEach(async (i) => {
        const filePath = path.join(copyPath, i);
        await fsPromises.unlink(filePath, path.join(copyPath, i));
      });
      copyFiles(copiedFrom, copyFromPath);
    }
  } catch (err) {
    console.error(err);
  }
}

function copyFiles(arr, from) {
  arr.forEach(async (i) => {
    const filePath = path.join(from, i);
    await fsPromises.copyFile(filePath, path.join(copyPath, i));
  });
}

copyDir();
