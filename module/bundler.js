const { Buffer } = require('buffer');
const path = require('path');
const fs = require('fs');

let globalConfig = undefined;

function Meta( config ){
  const dir = path.join(__dirname,'../bundle/meta.html');
  const meta = fs.readFileSync(dir)
        .replace(/KEYWORDS/g,config.keywords.join())
        .replace(/DESCRIPTION/g,config.description)
        .replace(/CANONICAL/g,config.url)
        .replace(/AUTHOR/g,config.author)
        .replace(/IMAGE/g,config.image)
        .replace(/TITLE/g,config.title)
        .replace(/ICON/g,config.icon)
}

function Component( dir ){
  console.log(dir);
  dir = path.join(globalConfig.view,dir);
  dir = path.normalize(dir);
  return fs.readFileSync(dir);
}

function Loop( size, callback ){
  const result = new Array();
  for( var i=0; i<=size; i++ )
    result.push( callback(i) );
  return result.join('');
}

async function compile( data,req,res ){
    
    let loadr = data.match(/\<\°[^°]+\°\>/gi) || [];
    let style = data.match(/\/\°[^°]+\°\//gi) || [];
    if( !style.length && !loadr.length ) return data;

    for( var i in style ){ const item = style[i];
      try {
        let path = item.replace(/\/\°|\°\//gi,'');
        data = data.replace( item,eval(path)||'');
      } catch(e) {
        const error = `/* something went wrong: ${e} */`;
        data = data.replace( item,error );
        console.log(e);
      }
    }

    for( var i in loadr ){ const item = loadr[i];
      try {
        
        const raw = item.replace(/\<\°|\°\>| /gi,'');
        const cmp = raw.match(/.+/gi).join('');

        const inf = Component( cmp );
				data = data.replace( item,inf );

      } catch(e) {
        const error = `/* something went wrong: ${e} */`;
        data = data.replace( item,error );
        console.log(e);
      }
    }
    
    return compile( data,req,res );
}

module.exports = ( req,res,raw,mimeType,config )=>{
  return new Promise(async(response,reject)=>{

    globalConfig = config
    
    const arr = new Array(); const data = raw.toString();
    const style = data.match(/\/\°[^°]+\°\/|\<\°[^°]+\°\>/gi) || [];

    if( (style.length>=1) && (/^text|^application/).test(mimeType) )
         arr.push( Buffer.from(await compile( data,req,res )) );
    else arr.push( raw );

    return response( arr[0] );
  });
};
