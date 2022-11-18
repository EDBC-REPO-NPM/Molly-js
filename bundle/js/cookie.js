const output = new Object();

output.state = new window.device.state(()=>{
    const cookie = document.cookie.split(';');
    const state = new Object();
    for( var i in cookie ){
        const data = cookie[i].split('=');
              state[data[0]] = data[1];
    }   return state;
});

output.set = function(obj){ 
    const result = new Array(); let state;
    try { state = obj(output.state.state); } 
    catch(e) { state = obj } output.state.set(obj);
    for( var i in obj )
        result.push(`${i}=${obj[i]}`); 
        document.cookie = result.join(';');
}

output.get = function(item){ return output.state.get(item) }
output.observeField = function(...args){ return output.state.observeField(...args) }
output.unObserveField = function(...args){ return output.state.unObserveField(...args) }

module.exports = output;