const output = new Object();

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

output.getScreen = function( _obj ){
    if( !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) )
        return console.error('screen recorder is not suported');

    if( typeof( _obj ) !== 'object' ){ 
        _obj = new Object();	
        _obj.video = true; 
        _obj.audio = true;
    }	
    
    return navigator.mediaDevices.getDisplayMedia( _obj );
}

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //
    
output.getCamera = function( _obj ){
    if( !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) )
        return console.error('camera is not suported');

    if( typeof( _obj ) !== 'object' ){ 
        _obj = new Object();	
        _obj.video = true; 
        _obj.audio = true;
    }	
    
    return navigator.mediaDevices.getUserMedia( _obj );
}

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //
    
output.getMicrophone = function( _obj ){
    if( !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) )
        return console.error('microphone is not suported');

    if( typeof( _obj ) !== 'object' ){ 
        _obj = new Object();	
        _obj.video = false;
        _obj.audio = true;
    }	
    
    return navigator.mediaDevices.getUserMedia( _obj );
}

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

output.getShot = function( _stream, _width=1024, _height=720, _type="image/webp" ){
    const video = createElement("video"); video.srcObject = _stream;
          video.width = _width; video.height = _height;

    const canvas = createElement("canvas"), ctx = canvas.getContext("2d");
    ctx.drawImage( video, 0,0, _width, _height ); 
    return canvas.toDataURL( _type );
}

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

output.stopMediaStream = function( _stream ){ _stream.getTracks().forEach(item=>item.stop()) }
	
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

output.stopRecording = function( _recorder ){ _recorder.mediaRecorder.stop(); }
output.startRecording = function( _recorder ){
    const mediaRecorder = new MediaRecorder( _recorder );
         _recorder.mediaRecorder = mediaRecorder;
    const data = new Array();

    _recorder.mediaRecorder.ondataavailable = (event)=>{
        data.push( event.data );
    };	_recorder.mediaRecorder.start();
    
    const promise = new Promise( (res,rej)=>{
        _recorder.mediaRecorder.onerror = (err)=> rej(err);
        _recorder.mediaRecorder.onstop = ()=>res(data);
    });	return promise;
}

output.saveRecord = function( _blobs,_name ){ 	
    const _blob = new Blob( _blobs, {'type':_blobs[0].type});	
    const url = URL.createObjectURL( _blob );
    const a = createElement('a');
    $('body').appendChild(a);
        a.setAttribute('download',_name);
        a.setAttribute('href',url);
        a.style = "display: none";
        a.click();
    URL.revokeObjectURL(url);
    $('body').removeChild(a);
}

module.exports = output;