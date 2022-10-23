const fs = require('fs');

const bundle = new Array();
const cssFiles = fs.readdirSync(`${process.cwd()}/bundle/css`)
    .sort( (A,B)=>{
        const a = Number(A.match(/^\d+/));
        const b = Number(B.match(/^\d+/));
        return a-b;
    });

function compileCSS( _raw ){
    const script = _raw.match(/\/\°[^°]+\°\//gi) || [];
    script.map((x)=>{
        const code = x.replace(/\/\°|\°\//gi,'');
        _raw = _raw.replace( x,eval(code) );
    }); return _raw;
}

cssFiles.map((file)=>{
    let data = fs.readFileSync(`${process.cwd()}/bundle/css/${file}`);
        data = compileCSS( data.toString() );
    bundle.push(data);
});

process.stdout.write(
    bundle.join('\n')
);