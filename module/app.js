const worker = require('worker_threads');
const fs = require('fs');

function runWorker( _path,req,res,protocol ){
	return new Promise((response,reject)=>{

		const wrk = new worker.Worker( _path,{
			env: worker.SHARE_ENV, stdin: true,
			workerData: {
				fornt: process.molly.frontend,
				back: process.molly.backend,
				headers: req.headers,
				path: process.cwd(),
				protocol: protocol,
				method: req.method,
				parse: req.parse,
				query: req.query
			}
		});
	
		wrk.on('message',(msg)=>{
			if( msg == 'next' ) response(false);
			else if( msg == 'drain' ) req.pipe( wrk.stdin );
			else res[msg.api]( ...msg.atr ); response(true); 
		});
		wrk.on('exit',(e)=>{ console.log(e); response(false); });
		wrk.on('error',(e)=>{ console.log(e); response(false); });

	});
}

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
        `${process.molly.backend}${req.parse.pathname}.ws`,
        `${process.molly.backend}${req.parse.pathname}.js`,
        `${process.molly.frontend}${req.parse.pathname}`,
        `${process.molly.root}/bundle/bundle.js`,
        `${process.molly.frontend}/404.html`,
    ];

	try{ 
		const path = [
			`${process.molly.backend}/main.js`,
			`${process.molly.backend}/main.ws`
		];	const module = fs.existsSync(path[0]);
			const worker = fs.existsSync(path[1]);

		if( fs.existsSync(cond[0]) || fs.existsSync(cond[1]) || process.molly.debbug ){
			if( module ){ const done = await runModule( path[0],req,res,P ); if( done ) return 0; } 
			else if( worker ){ const done = await runWorker( path[1],req,res,P ); if( done ) return 0; }
		}
	} catch(e) {  }
	
	try{
	
		if( req.parse.pathname == '/molly.js' ) res.sendFile( cond[5] );
		else if( process.molly.ui && req.parse.pathname == '/mollyUI.css' )
			res.sendFile( process.molly.ui.css );
		else if( process.molly.ui && req.parse.pathname == '/mollyUI.js' )
			res.sendFile( process.molly.ui.js );
		
        else if( fs.existsSync(cond[2]) ) runWorker( cond[2],req,res,P );
        else if( fs.existsSync(cond[3]) ) runModule( cond[3],req,res,P );

		else if( fs.existsSync(cond[0]) ) res.sendFile(cond[0]);
		else if( fs.existsSync(cond[1]) ) res.sendFile(cond[1]);
		
		else if( fs.existsSync(cond[4]) ) res.sendFile(cond[4]);
		else if( fs.existsSync(cond[6]) ) res.sendFile(cond[6],404);
		else res.send(404,'Oops 404 not found');
		
	} catch(e) { console.log(e); res.send(404,e.message); }
			
}
