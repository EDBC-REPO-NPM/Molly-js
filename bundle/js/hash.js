module.exports = function(){

	function hash(id) {
	    _$('[hash]').map(x=>x.hidden=true);
		_$(`[hash*="${id}"]`).map(x=>x.hidden=false);
		_$(`[hash*="${id}"]`).map(x=>device.focus.focus(x));
    }

	window.addEventListener('hashchange',()=>{
		hash( window.location.hash.slice(1) || '' );
	}); hash( window.location.hash.slice(1) || '' );

}