const output = new Object();

output.copy = ( _value )=>{ navigator.clipboard.writeText( _value ); }
output.paste = async()=>{ return navigator.clipboard.readText(); }

module.exports = output;