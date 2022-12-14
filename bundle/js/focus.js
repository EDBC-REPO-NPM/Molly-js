const output = new Object();

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

output.state = new device.state({
    parent: null, target: null,
    button:'', ok:0, key:'',
    event:'', topology:null,
});

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

output.set = function(obj){ output.state.set(obj) }
output.get = function(item){ return output.state.get(item) }
output.observeField = function(...args){ return output.state.observeField(...args) }
output.unObserveField = function(...args){ return output.state.unObserveField(...args) }

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

output.state.observeField('target',(a,b)=>{
    a?.setAttribute('focused',false);
    b?.setAttribute('focused',true);
    a?.removeAttribute('focused');
});

const options = {
    size: 1,     // int -> horizontal bondary
    loop: false, // bool-> loop Interval
    keep: false, // bool -> persistence 
};

function setFocus( element ){
    output.set({ target: element });
    return element;
}

function parseOpt( element ){
    const attr = element.getAttribute('focus')
                        .replace(/\t|\n| /gi,'')
                        .split(';');
    const obj = new Object();
    for( var i in options ) obj[i] = options[i];
    for( var i in attr ){
        const data = attr[i].split(':');
        if(!data[1]) continue; 
        obj[data[0]]= data[1];
    }   return obj;
}

function parseFocus( element ){
    const node = new Object();
          node.opt = parseOpt( element );
          node.pos = [0,0];

    if( node.opt.size == 'horizontal' )
        node.opt.size = element.querySelectorAll('[focus-item]').length;

    if( node.opt.keep ) 
        node.pos = element.hasAttribute('pos') ? 
                   element.getAttribute('pos').split(' ').map(x=>+x) : [0,0];

    else if( node.opt.size == 'vertical' ) node.opt.size = 0;
    
    else node.opt.size = +node.opt.size;

    return node;
}

output.focus = function( element ){
    
    if( !element.hasAttribute('focus') ){
        var parent = element.parentElement;
        do {
            try{parent.scrollTo({ 
                    left: element.offsetLeft-(element.clientWidth/2),
                    top: element.offsetTop-(element.clientHeight/2),
                    behavior: 'smooth',
                }); parent = parent.parentElement;
            } catch(e) { break; }
        } while ( parent != $('html') );   
          return setFocus(element);
    }   
    
    output.state.set({
        parent: element,
        topology: parseFocus( element )
    }); return setFocus( element.querySelector('[focus-item]') );

} 

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

function setTarget( X,Y ){
    try{

        output.state.state.topology.pos = [ 
            output.state.state.topology.pos[0] + X, 
            output.state.state.topology.pos[1] + Y 
        ];

        Array.from(document.querySelectorAll('[focus-item]'))
                           .map(x=>x?.setAttribute('focused',false));    

        const items = output.state.state.parent.querySelectorAll('[focus-item]');
        const YSize = Math.ceil(items.length / output.state.state.topology.opt.size);
        const XSize = Math.ceil(output.state.state.topology.opt.size);
        const pos = output.state.state.topology.pos;

        if( pos[0] < 0 ){
            if( output.state.state.topology.opt.loop )
                 output.state.state.topology.pos[0] = XSize-1;
            else output.state.state.topology.pos[0] = 0;
            output.set({ event: 'left' });
            return setTarget( 0,0 );
        }
        else if( pos[0] >= XSize ){
            if( output.state.state.topology.opt.loop )
                 output.state.state.topology.pos[0] = 0;
            else output.state.state.topology.pos[0] = XSize-1;
            output.set({ event: 'right' });
            return setTarget( 0,0 );
        }

        if( pos[1] < 0 ){
            if( output.state.state.topology.opt.loop )
                 output.state.state.topology.pos[1] = YSize-1;
            else output.state.state.topology.pos[1] = 0;
            output.set({ event: 'top' });
            return setTarget( 0,0 );
        }
        else if( pos[1] >= YSize ){
            if( output.state.state.topology.opt.loop )
                 output.state.state.topology.pos[1] = 0;
            else output.state.state.topology.pos[1] = YSize-1;
            output.set({ event: 'bottom' });
            return setTarget( 0,0 );
        } 

        try{
            output.focus( items[pos[0]+pos[1]*XSize] );
        } catch(e) { return setTarget( -1,0 ); }

        if( output.state.state.topology.opt.keep )
            output.state.state.parent.setAttribute('pos',pos.join(' '));

    } catch(e) { }
}

output.state.observeField('button',(a,b)=>{

         if( b == 'up' )   setTarget( 0,-1);
    else if( b == 'down' ) setTarget( 0, 1);
    else if( b == 'left' ) setTarget(-1, 0);
    else if( b == 'right') setTarget( 1, 0);
    else if( b == 'back' )  
        return output.set({ event: 'back' });
    else if( b == 'ok' ){
        output.state.get('target').click();
        return output.set({ event: 'ok' });
    } 

});

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

window.addEventListener('keydown',({key})=>{ output.state.set({ key: key });
    if( (/enter/i).test(key) )      return output.state.set({ button: 'ok' });
    if( (/arrowup/i).test(key))     return output.state.set({ button: 'up' });
    if( (/escape/i).test(key) )     return output.state.set({ button: 'menu' });
    if( (/arrowdown/i).test(key) )  return output.state.set({ button: 'down' });
    if( (/arrowleft/i).test(key) )  return output.state.set({ button: 'left' });
    if( (/backspace/i).test(key) )  return output.state.set({ button: 'back' });
    if( (/arrowright/i).test(key))  return output.state.set({ button: 'right' });
});

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

window.focus = output.focus;
module.exports = output;