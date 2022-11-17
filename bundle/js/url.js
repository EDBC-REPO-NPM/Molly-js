const output = new Object();

function formatQuery( search ){
    const result = new Array();
    for( var i in search ){
        result.push(`${i}=${search[i]}`);
    }   return `?${ result.join('&') }`;
}

function parseQuery( search ){ const obj = new Object();
    const query = search.replace(/\?/i,'').split(/\&/gi);
    for( var i=query.length; i--; ){
        const params = query[i].split(/\=/i);
              obj[params[0]] = params[1];
    }   return obj;
}

output.format = function( URLObject ){
    try {
        const url = new URL(URLObject.host);
              url.pathname = URLObject.path||'/';
              url.search = formatQuery( URLObject.query );
        return url.toString();
    } catch(e) {
        console.error('somethig went wrong while formating URL');
    }
}

output.parse = function( URLString ){
    try {
        const url = new Object();
        const obj = new URL(URLString);
              url.host = obj.origin;
              url.path = obj.pathname||'/';
              url.query = parseQuery( obj.search );
        return url;
    } catch(e) {
        console.error('something went wrong while parsing URL');
    }
}

module.exports = output;