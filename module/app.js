const db = new Object();
const fs = require('fs');
const path = require('path');

function runModule( _path,req,res,protocol ){
	try{ const __module__ = require(_path);
		return __module__(req,res,protocol);
	} catch(e) { console.log(e) }
}

setInterval(()=>Object.keys(db).map(x=>delete db[x]),1000*60);

module.exports = async function(I,O,C,P){
	
    const {req,res} = require( path.join(__dirname,'api') )(I,O,C,P);
	if( P=='HTTP' && C.HTTPSredirect ) return res.HTTPSredirect();
	if( P=='HTTPS' && C.HTTPredirect ) return res.HTTPredirect();

    const cond = [
        path.join( C.viewer, req.parse.pathname, 'index.html' ),
		path.join( C.controller, req.parse.pathname+'.js' ),
        path.join( C.viewer, req.parse.pathname+'.html' ),
		path.join( C.viewer, req.parse.pathname ),
		path.join( C.root,'/bundle/bundle.js' ),
		path.join( C.viewer, '404.html' ),
    ];

	try{ 
		const dir = path.join(C.controller,'main.js');
		const sec = path.join(__dirname,'security.js');
		if( req.parse.pathname == '/main' ) return res.redirect( '/' );
		if( C.security && await runModule( sec,req,res,db ) ) return 0;
		if( fs.existsSync(dir) && await runModule( dir,req,res,P )) return 0;
	} catch(e) {  }
	
	try{
			 if( req.parse.pathname == '/molly' ) 		return res.sendFile( cond[4] );
        else if( fs.existsSync(cond[1]) ) 				return runModule( cond[1],req,res,P );
		else if( fs.existsSync(cond[0]) ) 				return res.sendFile(cond[0]);
		else if( fs.existsSync(cond[2]) ) 				return res.sendFile(cond[2]);
		else if( fs.existsSync(cond[3]) ) 				return res.sendFile(cond[3]);
		else if( fs.existsSync(cond[4]) ) 				return res.sendFile(cond[5],404,'html');
		else 							 				return res.send('Oops 404 not found',404,'html');
	} catch(e) { res.send(e.message,404); /* console.log(e);*/ }
			
}
