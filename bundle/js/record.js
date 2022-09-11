const output = new Object();

//TODO: stopStream ---------------------------------------------------------------------------//

output.stopMediaStream = function( _stream ){ _stream.getTracks().forEach(item=>item.stop()) }
	
//TODO: Record Element  ----------------------------------------------------------------------//

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