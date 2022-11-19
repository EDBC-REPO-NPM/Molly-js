const headers = {
    "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
    'connection': 'keep-alive', 'Sec-Fetch-Site': 'cross-site',
    'sec-ch-ua-mobile': '?0', 'Sec-Fetch-User': '?1',
    'Accept-Encoding': 'gzip, deflate, br',
    "sec-ch-ua-platform": "\"Chrome OS\"",
    "accept-language": "es-419,es;q=0.9",
    'sec-fetch-mode': 'navigate',
    'Sec-Fetch-Dest': 'empty',
    "sec-fetch-mode": "cors",
    "accept": "*/*",
};

function parseProxy( _args ){

    let _url = _args[0]?.url || _args[0] || window.location.href;
        _url = _url.replace(/\.\//gi,window.location.href);
    let opt = new URL( _url ); 
        
    opt.port = typeof opt?.port == 'string' ? +opt.port : (/^https/i).test( _args[0]?.url || _args[0] ) ? 443 : 80;
    opt.protocol = (/^https/i).test(_url) ? 'https' : 'http';
    opt.currentUrl = _url; opt.referer = _url;
    opt.mode = 'cors';

    return { opt };
}

function parseURL( _args ){ 
    
    const { opt } = parseProxy( _args );

    opt.headers  = new Object();
    opt.body     = _args[1]?.body || _args[0]?.body || null; 
    opt.method   = _args[1]?.method || _args[0]?.method || 'GET';
    opt.redirect = _args[1]?.redirect || _args[0]?.redirect || false; 
    opt.timeout  = _args[1]?.timeout || _args[0]?.timeout || 100 * 60 * 1000 ;
    opt.response = _args[1]?.responseType || _args[0]?.responseType || 'json';
    const tmp_headers  = _args[1]?.headers || _args[0]?.headers || new Object();

    opt.cache = 'default'; opt.creadentials = 'omit'; 
    opt.redirect = opt.redirect ? 'follow' : 'manual';
    opt.referrerPolicy = "strict-origin-when-cross-origin";
    process.chunkSize = _args[1]?.chunkSize || _args[0]?.chunkSize || Math.pow(10,6) * 3;

    for( var i in headers ){ 
        const key = i.match(/\w+/gi).map(x=>{
            const st = x.match(/^\w/gi).join('');
            return x.replace(st,st.toLowerCase());
        }).join('-'); opt.headers[key] = headers[i]
    }

    for( var i in tmp_headers ){ 
        const key = i.match(/\w+/gi).map(x=>{
            const st = x.match(/^\w/gi).join('');
            return x.replace(st,st.toLowerCase());
        }).join('-'); opt.headers[key] = tmp_headers[i]
    }

    return { opt };
}

function parseBody( opt ){
    if( typeof opt.body == 'object' ){ 
        opt.body = JSON.stringify(opt.body);
        opt.headers['Content-Type'] = 'application/json';
    } else if( (/^\?/i).test(opt.body) ){ 
        opt.body = opt.body.replace(/^\?/i,'');
        opt.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else if( !opt.headers['Content-Type'] ) { 
        opt.headers['Content-Type'] = 'text/plain'; 
    }   
    opt.headers['Content-Length'] = (new TextEncoder().encode(opt.body)).length; 
    return opt;
}

function parseRange( range ){
    const size = process.chunkSize;
    const interval = range.match(/\d+/gi);
    const chunk = Number(interval[0])+size;
    return interval[1] ? range : range+chunk;
}

function HTTPrequest( ..._args ){
    return new Promise((response,reject)=>{
 
        let { opt } = parseURL( _args ); delete opt.headers.host;

        if( opt.headers.range && !opt.headers.nochunked ) opt.headers.range = parseRange(opt.headers.range);
            opt.headers.referer = opt.currentUrl; opt.headers.origin = opt.currentUrl;
        if( opt.body ){ opt = parseBody( opt ); }   

        const req = fetch( opt.currentUrl, opt ).then( async function(res){
            try{

                const schema = {
                    request: req, response: res, config: opt,
                    status: res.status, headers: res.headers,
                }; 
                
                if( opt.response == 'stream' ) schema.data = res;

                else if( opt.response == 'arraybuffer' ) schema.data = await res.arrayBuffer();
                else if( opt.response == 'blob' ) schema.data = await res.blob();
                else if( opt.response == 'text' ) schema.data = await res.text();
                else if( opt.response == 'json' )  try{ 
                    schema.data = await res.text();
                    schema.data = JSON.parse(schema.data);
                } catch(e) { }
                
                if( res.status >= 400 )
                     return reject( schema );
                else return response( schema );
                
            } catch(e) { reject(e); }
        }).catch(e=>{ reject(e); })
    
    });    
}


module.exports = HTTPrequest;