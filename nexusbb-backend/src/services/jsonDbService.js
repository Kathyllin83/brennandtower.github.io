const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

const readData = (fileName) => {
  const filePath = path.join(dataDir, fileName);
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading file ${fileName}:`, error);
    return null;
  }
};

const writeData = (fileName, data) => {
  const filePath = path.join(dataDir, fileName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing file ${fileName}:`, error);
  }
};

module.exports = { readData, writeData };