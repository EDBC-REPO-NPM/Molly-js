

HLS = require('./baseJS/hls');
HLS.play = function( _video, _url ){
    if ( HLS.isSupported() ) {
        const hls = new HLS(); 
        hls.loadSource( _url ); 
        hls.attachMedia( _video );
    } else if( _video.canPlayType('application/vnd.apple.mpegurl' )) 
        _video.src = _url;
}

module.exports = HLS;