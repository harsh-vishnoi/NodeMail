const express = require('express');
const path = require('path');
const app = express();

const pathDirectory = path.join(__dirname + "/src");

// console.log(pathDirectory);
app.use(express.static(pathDirectory));

app.listen(3000, () => {
  console.log('Server is running.')
})
