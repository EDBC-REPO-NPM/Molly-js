const size = new Array();

module.exports = (callback)=>{

    function detectDevTool(allow) {
        if( isNaN(+allow) ) allow=100; size.push(+new Date()); 
        if( size.length < 2 ){ debugger; detectDevTool(allow); }
        if( isNaN(size[0]) || isNaN(size[1]) || size[1] - size[0] > allow )
            if( !callback ) window.location = 'https://google.com'; else callback();
    }   window.addEventListener('mousemove', detectDevTool);
        window.addEventListener('resize', detectDevTool);
        window.addEventListener('focus', detectDevTool);
        window.addEventListener('load', detectDevTool);
        window.addEventListener('blur', detectDevTool);

};