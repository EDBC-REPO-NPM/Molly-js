# MollyJS A FullStack Framework
```
	npm install mollyjs
```
```
	
	const molly = require('mollyjs');

	const frontEndPath = `${__dirname}/view`;
	const backEndPath = `${__dirname}/controller`;

	const backend = new molly.createBackend( frontEndPath,backEndPath );
	const server = backend.createServer( process.env.PORT || 3000 );

```

##### Aditiona Things
```
	
	backend.cors = true; //adding Access-Control-Allow-Origin: * header
	backend.cache = true; //adding Cache-Control header
	backend.strict = true; //only same origin
	backend.iframe = false; //adding x-frame-options: DENY header

```

##### Dealing with additional headers
```
	
	backend.header = {
		/* place here aditiona headers */
	}

```

##### Dealing with states 
```
	
	backend.state['your_state'] = 'mystate';
	NOTE: states let you save data accross controllers

```

### Project Structure
```
	
	+-./
	+-------+-View
	|	+-index.html
	|	+-PageA.html
	|	+-PageB.html
	|	+-PageC.html
	|
	+-------+-Controller
	|	+-Controller1.js
	|	+-Controller2.js
	|	+-Controller3.js

	NOTE: Every Page and Controller is accesible fron its ouw name without extention.
	ej. 

	For Pages:
	http://localhost:3000/ for index.html
	http://localhost:3000/404 for 404.html
	http://localhost:3000/pageA
	http://localhost:3000/pageB
	http://localhost:3000/pageC

	For Controllers:
	http://localhost:3000/ControllerA
	http://localhost:3000/ControllerB
	http://localhost:3000/ControllerC

```

### Creating the first controller

#### from controllerA.js
```
	
	req.get( ()=>{
		res.send( 200,'hello world im a controller' );
	});

```

#### from index.html
```
	
	<script type="module">
		import mollyjs from "/mollyjs"
		mollyjs.onLoadPage( ()=>{
			ajax.get('./controllerA').then( async(response)=>{
				console.log( await response.text() );
			})
		});
	</script>

```

# MollyJS BackEnd API

#### Create Http Server
```
	
	const port = process.env.PORT || 3000;
	mollyJS.createServer( port );

```

#### Create Https Server
```
	
	const port = process.env.PORT || 3000;
	const cert = process.env.CERT
	const key = process.env.KEY
	mollyJS.createSecureServer( key,cert,port );

```

#### recive querys
```
	
	from http://localhost:port/ruta?var=hello
	
	req.query = { var: "hello" }

```

#### send text
```
	res.send( _status, _Data, _type='html' )
```

#### send files
```
	
	res.sendFile('PATH/TO/FILE.mp4');

	NOTE: this function automaticaly send files over status 206 if available

```

#### send json
```
	res.json( _status, _JSON )
```

#### redirect
```
	res.redirect('https://www.google.com');
```

#### 404 Page
```
	
	res._404()

	NOTE: this function will send you to 404.html page

```

#### req methods
```
	
	req.get( ()=>{
		res.send(200,'GET Message');
	});
	
	req.put( ()=>{
		res.send(200,'PUT Message');
	});
	
	req.post( ()=>{
		res.send(200,'POST Message');
	});
	
	req.patch( ()=>{
		res.send(200,'PATCH Message');
	});
	
	req.delete( ()=>{
		res.send(200,'DELETE Message');
	});

```

##### Download File From URL
```
	
	cont _url = 'HTPP://PATH/TO/FILE' or 'data:MIEMTYPE;base64,BASE64DATA';
	
	const _path = '/PATH';

	req.downloadFile( _url,_path)
	.then( ()=>{ /*  */ } )

```

#### Dealing With POST Methods

##### client
```
	
	ajax.post('./controller','body_content')
	.then( async(res)=>{ /*  */ })

```

##### Server
```
	
	req.post( ()=>{
	
		let data = new String();
	
		req.on('data',(chunk)=>{
			data += chunk;
		})
		
		req.on('end',()=>{
			console.log( data );
			res.send(200,'done');
		})
		
	});

```

#### Dealing with Forms 
```
	
	req.form()
	.then( { fields,files } ){
		/*  */
	}
	.catch( err ){ /*  */ }

```

# MollyJS FrontEnd API
```
	
	<script src="_mollyjs_"></script> <!-- NOTE: without .js extension -->
	<script> /*  */ </script>

```

#### Dom Selection
```
	
	$('div') //select only one div in the page 
	$$('div') //select all divs in the page

	NOTE:
	# - for IDs
	. - for Classes

```

#### Dom Events
```

	const _DomSelector = $('#mybutton');
	const _EventType = 'click'
	const _Callback = ()=>{
		alert('hello world')
	}

	// Adding Events
	const Event = addEvent( _DomSelector,_EventType,_Callback );

	// Removing Events
	removeEvent( Event );

```

#### Dom Modifiers
```

	appendElement( _ParentElement, _ChildElement );
		ej - appendElement( $('body'), createElement('button') );

	replaceElement( _ElementOld, _ElementNew );
		ej - replaceElement( $('#button[old]'), $('#button[new]') );

	createElement( _ElementType );
		ej - createElement('div');

	removeElement( _Element );
		ej - removeElement( $('#button') );

```

#### External Components
components are external peace of html code that can be downloaded and placed inside our main page 

```
	
	<!-- from component.html -->

	<script>
		console.log('hello im a component script')
	</script>

	<div>
		hello im a component
	</div>

```

```
	
	<!-- from index.html -->

	<component type="div" path="PATH/TO/COMPONENT"></component>
	
	<!-- NOTE "type" is optional and it defines the element type that will replace the component tag after downloading the component -->

```

#### Dealing With Lazy Content
```
	
	<img src="PATH/TO/PLACEHOLDER" data-src="PATH/TO/IMAGE" lazy >
	<video src="PATH/TO/PLACEHOLDER" data-src="PATH/TO/VIDEO" lazy >

```

#### Dealing With B64 Content
```
	
	<img b64="BASE64 IMAGE" type='image/jpeg' >
	<video b64="BASE64 VIDE" type='video/mp4' >

```

#### Dealing with XML
```
	
	XML.parse( _XMLString ); //this return a _XMLObject

	XML.stringify( _XMLObject ); //this return a _XMLString

```

#### Dealing with Clipboars
```
		
	clipboard.copy( _value );

	clipboard.paste()
	.then( _text=>{
		/*  */
	})

```

#### Dealing with Devices
```
		
	device.getBrowse();

	device.isMobile();

	device.getSize();

	device.getIP();

	device.getOS();

```

#### Dealing with Device Sensors
```
		
	device.battery()
	.then( _status ){
		/*  */
	}

	device.gyroscope((_gyro)=>{
		/*  */
	})
	
	device.accelerometer((_acc)=>{
		/*  */
	});
	
	device.geolocation( _constrains )
	.then( _status ){
		/*  */
	}

	NOTE: _constrains are optionals

```

#### Dealing with Media Devices
```
		
	device.getScreen( _constrains )
	.then( _stream ){
		/*  */ ej. video.srcObject = _stream;
	}	

	device.getCamera( _constrains )
	.then( _stream ){
		/*  */ ej. video.srcObject = _stream;
	}

	device.getMicrophone( _constrains )
	.then( _stream ){
		/*  */ ej. video.srcObject = _stream;
	}

	// Stop Streaming

	device.stopStream( _stream );

	NOTE: _constrains are optionals

```

#### Recording
```
		
	device.startRecording( _stream )
	then( _data=>{

		device.saveRecord( _data,_name )

	});

	device.stopRecording( _stream );

```

#### HLS Videos
```
	
	import hls from "/hls";
	.then( ()=>{
		hls.play( _VideoElement,_URL )
	})

```

#### WebP2P
```
	
	
	import peer from "/peer";

	peer = peer.createPeer( ID )

	// TODO: Peer Events
	peer.onopen
	peer.onclose
	peer.oncall;
	peer.onerror;
	peer.onstream;
	peer.onmessage;
	peer.onconnection;
	peer.ondisconnected;

	//Recive Peers
	peer.recive( _Stream );		

	//TODO: Connect Peers
	peer.connect( _ClientID, _Stream );	
	
```

#### WEB VAST ADS
	.... coming soon ....

#### WEB QR
	.... coming soon ....

