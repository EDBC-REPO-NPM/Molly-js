const fs = require('fs');

function runModule( _path,req,res,protocol ){
	try{const __module__ = require(_path);
		return __module__(req,res,protocol);
	} catch(e) { console.log(e) }
}

module.exports = async function(I,O,P){
	
    const {req,res} = require(`${__dirname}/api`)(I,O,P);

    const cond = [
        `${process.molly.frontend}${req.parse.pathname}/index.html`,
        `${process.molly.frontend}${req.parse.pathname}.html`,
        `${process.molly.backend}${req.parse.pathname}.js`,
        `${process.molly.frontend}${req.parse.pathname}`,
        `${process.molly.root}/bundle/bundle.js`,
        `${process.molly.frontend}/404.html`,
    ];

	try{ 
		const condition = `${process.molly.backend}/main.js`;
		const module = fs.existsSync(condition);
		if( condition ){
			if( fs.existsSync(condition) ) {
				const done = await runModule( path[0],req,res,P ); 
				if( done ) return 0; 
			}
		}
	} catch(e) {  }
	
	try{
	
		if( req.parse.pathname == '/molly.js' ) res.sendFile( cond[4] );
		else if( process.molly.ui && req.parse.pathname == '/mollyUI.css' )
			res.sendFile( process.molly.ui.css );
		else if( process.molly.ui && req.parse.pathname == '/mollyUI.js' )
			res.sendFile( process.molly.ui.js );
		
        else if( fs.existsSync(cond[2]) ) runModule( cond[2],req,res,P );

		else if( fs.existsSync(cond[0]) ) res.sendFile(cond[0]);
		else if( fs.existsSync(cond[1]) ) res.sendFile(cond[1]);
		
		else if( fs.existsSync(cond[3]) ) res.sendFile(cond[3]);
		else if( fs.existsSync(cond[5]) ) res.sendFile(cond[5],404);
		else res.send(404,'Oops 404 not found');
		
	} catch(e) { console.log(e); res.send(404,e.message); }
			
}
