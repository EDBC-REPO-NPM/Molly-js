const output = new Object();

output.battery = function(){
    if( !window.BatteryManager ) 
        return console.error(' battery is not supported ');
    return navigator.getBattery();
}

output.gyroscope = function( callback ){ 
    if( !window.DeviceOrientationEvent ) 
        return console.error(' gyroscope is not supported ');
    addEvent( window,'deviceorientation', (event)=>callback(event) );
}

output.accelerometer = function( callback ){ 
    if( !window.DeviceMotionEvent )
        return console.error(' Accelerometer is not supported ');
    addEvent( window,'deviceorientation', (event)=>callback(event) ); 
}

output.geolocation = function( _obj ){
    if( !window.navigator.geolocation )
        return console.error(' geolocation is not supported ');
        
    if( typeof( _obj ) !== 'object' ){ _obj = new Object();	
         _obj.enableHighAccuracy = true;
          _obj.timeout = 5000;
          _obj.maximumAge = 0;
    }	

    const promise = new Promise( function(res,rej){
        navigator.geolocation.getCurrentPosition( res,rej,_obj );
    });	return promise;
}

module.exports = output;