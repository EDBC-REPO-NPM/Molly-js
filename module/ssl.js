const fs = require('fs'); module.exports = ()=>{
    const path = `${process.molly.root}/json/certification.json`;
    const SSL = fs.readFileSync(path).toString().split('|');
    return { cert: SSL[0], key: SSL[1] };
}