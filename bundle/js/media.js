const output = new Object();

//TODO: Desktop ------------------------------------------------------------------------------//
		
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

//TODO: Camera  ------------------------------------------------------------------------------//
    
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

//TODO: Microphone  --------------------------------------------------------------------------//
    
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

module.exports = output;