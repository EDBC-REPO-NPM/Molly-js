const { Buffer } = require('buffer');
const fs = require('fs');

function component( path ){
  path = `${process.molly.frontend}/${path}`;
  path = path.replace('./','');
  return fs.readFileSync(path);
}

function hide( data ){

  const b64 = new Array();
  const chunk = new Array();
  const line = data.split('\n');
  
  for( var i in line ) b64.push(Buffer.from(line[i]).toString('base64'));
  const result = (`eval(function(c,o,d,e){
    e = new Array(); o = c.split('||').reverse();
    for( var i in o ) e.push(atob(o[i])); return e.join('\\n');
  }('${b64.reverse().join('||')}'))`).replace(/\n|\t/gi,'');

  return result;
}

async function compile( data,req,res ){
    
    let loadr = data.match(/\#\°[^°]+\°\#/gi) || [];
    let style = data.match(/\/\°[^°]+\°\//gi) || [];
    if( !style.length && !loadr.length ) return data;

    for( var i in style ){ const item = style[i];
      try {
        let path = item.replace(/\/\°|\°\//gi,'');
        data = data.replace( item,await eval(path) );
      } catch(e) {
        const error = `/* something went wrong: ${e} */`;
        data = data.replace( item,error );
        console.error(e);
      }
    }

    for( var i in loadr ){ const item = loadr[i];
      try {
        
        const raw = item.replace(/\#\°|\°\#| /gi,'');
        const cmp = raw.match(/.+/);

        const inf = component( cmp );
				data = data.replace( item,inf );

      } catch(e) {
        const error = `/* something went wrong: ${e} */`;
        data = data.replace( item,error );
        console.error(e);
      }
    }
    
    return compile( data,req,res );
}

module.exports = ( req,res,raw,mimeType )=>{
  return new Promise(async(response,reject)=>{
    
    const arr = new Array(); const data = raw.toString();
    const style = data.match(/\/\°[^°]+\°\/|\#\°[^°]+\\\#/gi) || [];

    if( (style.length>=1) && (/^text|^application/).test(mimeType) ){

      if( /*process.molly.strict*/ (/javascript/).test(mimeType) )
           arr.push( Buffer.from(hide(await compile( data,req,res ))) );
      else arr.push( Buffer.from(await compile( data,req,res )) );

    } else {

      if( /*process.molly.strict*/ (/javascript/).test(mimeType) )
           arr.push( Buffer.from(hide(raw.toString())) );      
      else arr.push( raw );
      
    }

    return response( arr[0] );
  });
};
