const fs = require('fs');
['src/pages/Lobby.jsx', 'src/pages/Duel.jsx', 'src/pages/Results.jsx'].forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.split('\\\\$').join('$');
  content = content.split('\\\\`').join('`');
  content = content.split('\\$').join('$');
  content = content.split('\\`').join('`');
  fs.writeFileSync(f, content);
});
console.log('Fixed');
