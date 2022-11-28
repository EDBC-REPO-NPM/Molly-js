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
        `${process.molly.frontend}/404.html`,
    ];

	try{ 
		const path = `${process.molly.backend}/main.js`;
		if( fs.existsSync(path) ) {
			const done = await runModule( path,req,res,P ); 
			if( done ) return 0; 
		}
	} catch(e) {  }
	
	try{
	
			 if( req.parse.pathname == '/molly.js' ) 	return res.sendFile(`${process.molly.root}/bundle/bundle.js`);
        else if( fs.existsSync(cond[2]) ) 				return runModule( cond[2],req,res,P );
		else if( fs.existsSync(cond[0]) ) 				return res.sendFile(cond[0]);
		else if( fs.existsSync(cond[1]) ) 				return res.sendFile(cond[1]);
		else if( fs.existsSync(cond[3]) ) 				return res.sendFile(cond[3]);
		else if( fs.existsSync(cond[4]) ) 				return res.sendFile(cond[4],404);
		else 							 				return res.send(404,'Oops 404 not found');
		
	} catch(e) { res.send(404,e.message); /* console.log(e);*/ }
			
}
