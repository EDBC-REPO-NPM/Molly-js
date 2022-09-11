const fs = require('fs');

const bundle = new Array();
const cssFiles = fs.readdirSync(`${process.cwd()}/bundle/uikit`)
    .sort( (A,B)=>{
        const a = Number(A.match(/^\d+/));
        const b = Number(B.match(/^\d+/));
        return a-b;
    });

cssFiles.map((file)=>{
    const data = fs.readFileSync(`${process.cwd()}/bundle/uikit/${file}`);
    bundle.push(data);
});

process.stdout.write(
    bundle.join('\n')
);