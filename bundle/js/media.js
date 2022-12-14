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
    
    var promise = new Promise( (res,rej)=>{
        _recorder.mediaRecorder.onerror = (err)=> rej(err);
        _recorder.mediaRecorder.onstop = ()=>res(data);
    });	return promise;
}

output.saveRecord = function( _blobs,_name ){ 	
    var _blob = new Blob( _blobs, {'type':_blobs[0].type});	
    var url = URL.createObjectURL( _blob );
    var a = createElement('a');
    $('body').appendChild(a);
        a.setAttribute('download',_name);
        a.setAttribute('href',url);
        a.style = "display: none";
        a.click();
    URL.revokeObjectURL(url);
    $('body').removeChild(a);
}

module.exports = output;