const { Buffer } = require('buffer');
const path = require('path');
const fs = require('fs');

let globalConfig = undefined;

function Component( dir ){
  dir = path.join(globalConfig.view,dir);
  dir = path.normalize(dir);
  return fs.readFileSync(dir);
}

function matchScript( data ){
  const result = new Array(); const index = [0,0];
  Array.from(data).map((x,i)=>{
         if((/\/\°/i).test(data[i]+data[i+1])) index[0] = i;
    else if((/\°\//i).test(data[i]+data[i+1])){
        index[1] = i+2; result.push(
          data.slice(index[0],index[1])
        );
    }
  }); return result;
}

async function compile( data,req,res ){
    
  const style = matchScript(data) || [];
  const loadr = data.match(/\<\°[^°]+\°\>/gi) || [];
  if( !style.length && !loadr.length ) return data;

  for( var i in style ){ const item = style[i];
    try {
      const path = item.replace(/\/\°|\°\//gi,'');
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
	  	data = data.replace( item,Component( raw ) );
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
    const style = data.match(/\/\°|\°\/|\<\°|\°\>/gi) || [];

    if( (style.length>=1) && !(/audio|video/).test(mimeType) )
         arr.push( Buffer.from(await compile( data,req,res )) );
    else arr.push( raw );

    return response( arr[0] );
  });
};
