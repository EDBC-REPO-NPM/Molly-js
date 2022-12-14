const output = new Object();

output.gamepad = function( callback ){
    if( !window.Gamepad )
        return console.error(' gamepad is not supported ');
    addEvent( window,'gamepadconnected', (event)=>callback(event) );
}

output.battery = function( callback ){
    return new Promise( async (response,reject)=>{
        if( !window.BatteryManager ) 
            return console.error(' battery is not supported ');
               callback( await navigator.getBattery() );
        return response();
    });
}

output.gyroscope = function( callback ){ 
    if( !window.DeviceOrientationEvent ) 
        return console.error(' gyroscope is not supported ');
    addEvent( window,'deviceorientation', (event)=>callback(event) );
}

output.accelerometer = function( callback ){ 
    if( !window.DeviceMotionEvent )
        return console.error(' Accelerometer is not supported ');
    addEvent( window,'devicemotion', (event)=>callback(event) ); 
}

output.geolocation = async function( callback, _obj ){
    if( !window.navigator.geolocation )
        return console.error(' geolocation is not supported ');
        
    if( typeof( _obj ) !== 'object' ){ 
        _obj = new Object();
        _obj.timeout = 5000;
        _obj.maximumAge = 0;
        _obj.enableHighAccuracy = true;
    }	

    const promise = new Promise( function(res,rej){
        navigator.geolocation.getCurrentPosition( res,rej,_obj );
    });	callback( await promise );
}

module.exports = output;