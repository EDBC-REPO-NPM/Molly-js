const fs = require('fs');
const path = require('path');

function runModule( _path,req,res,protocol ){
	try{const __module__ = require(_path);
		return __module__(req,res,protocol);
	} catch(e) { console.log(e) }
}

module.exports = async function(I,O,C,P){
	
    const {req,res} = require( path.join(__dirname,'api') )(I,O,C,P);

    const cond = [
        path.join( C.view, req.parse.pathname, 'index.html' ),
		path.join( C.controller, req.parse.pathname+'.js' ),
        path.join( C.view, req.parse.pathname+'.html' ),
		path.join( C.view, req.parse.pathname ),
		path.join( C.view, '404.html' )
    ];

	try{ 
		const path = path.join(C.controller,'main.js');
		if( fs.existsSync(path) ) {
			const done = await runModule( path,req,res,P ); 
			if( done ) return 0; 
		}
	} catch(e) {  }
	
	try{
	
			 if( req.parse.pathname == '/molly.js' ) 	return res.sendFile( path.join(C.root,'/bundle/bundle.js') );
        else if( fs.existsSync(cond[1]) ) 				return runModule( cond[1],req,res,P );
		else if( fs.existsSync(cond[0]) ) 				return res.sendFile(cond[0]);
		else if( fs.existsSync(cond[2]) ) 				return res.sendFile(cond[2]);
		else if( fs.existsSync(cond[3]) ) 				return res.sendFile(cond[3]);
		else if( fs.existsSync(cond[4]) ) 				return res.sendFile(cond[4],404);
		else 							 				return res.send('Oops 404 not found',404);
		
	} catch(e) { res.send(e.message,404); /* console.log(e);*/ }
			
}
