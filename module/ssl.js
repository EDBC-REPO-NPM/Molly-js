const path = require('path'); const fs = require('fs'); 
module.exports = ()=>{
    const dir = path.join(__dirname,'../json/certification.json');
    const SSL = fs.readFileSync(dir).toString().split('|');
    return { cert: SSL[0], key: SSL[1] };
}