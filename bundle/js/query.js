const output = new Object();

output.state = new window.device.state( 
    window.device.url.parse(window.location.href) 
);

window.addEventListener('hashchange',function(){
    output.state.set({ hash: window.location.hash });
});

output.set = function(obj){
    const result = new Array();
    for( var i in obj )
        result.push(`${i}=${obj[i]}`);
        document.cookie = result.join(';');
    return output.state.set(obj);
}

output.get = function(item){ return output.state.get(item) }
output.observeField = function(...args){ return output.state.observeField(...args) }
output.unObserveField = function(...args){ return output.state.unObserveField(...args) }

module.exports = output;