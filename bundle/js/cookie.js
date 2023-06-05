const output = new Object();

function getState(){
    const state = new Object();
    const cookie = document.cookie.split(';');
    if( document.cookie == '' ) return state;
    for( let i in cookie ){
        const data = cookie[i].split('=');
              state[data[0]] = data[1];
    }   return state;
}

output.state = new window.device.state( getState() );

output.set = function(obj){ 
    const result = new Array(); let state;
    try { state = obj(output.state.state); } 
    catch(e) { state = obj } output.state.set(obj);
    for( let i in obj )
        result.push(`${i}=${obj[i]}`); 
        document.cookie = result.join(';');
}

output.get = function(item){ return output.state.get(item) }
output.observeField = function(...args){ return output.state.observeField(...args) }
output.unObserveField = function(...args){ return output.state.unObserveField(...args) }

module.exports = output;