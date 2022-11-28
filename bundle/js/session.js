const output = new Object();

function getState(){
    const state = new Object();
    const storage = window.sessionStorage;
    for( var i=storage.length; i--; ){
        const key = storage.key(i);
        const data = storage.getItem(key);
        state[key] = data;
    }   return state;
}

output.state = new window.device.state( getState() );

output.set = function(obj){ let state;
    try { state = obj(output.state.state); } 
    catch(e) { state = obj } output.state.set(obj);
    for( var i in state ) window.sessionStorage.setItem(i,state[i]);
}

output.clear = function(){ 
    output.state.state = new Object();
    return window.sessionStorage.clear();
}

output.get = function(item){ return output.state.get(item) }
output.observeField = function(...args){ return output.state.observeField(...args) }
output.unObserveField = function(...args){ return output.state.unObserveField(...args) }

module.exports = output;