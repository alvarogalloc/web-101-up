const fs = require('fs');

fs.readFile('./data/input.txt', 'utf8', (err, data) => {
  if (err) {
    // failure
    console.error('Error reading the secret msg:', err);
    return;
  }
  console.log('Secret message is:', data);
});
