# Molly-js

Molly-js es un framework de servidor web para Node.js que permite a los desarrolladores crear aplicaciones web de forma rápida y sencilla. Con una API similar a la popular biblioteca Express.js, Molly-js facilita la creación de servidores HTTP y HTTPS, y su arquitectura bien diseñada y optimizada para la transmisión de video permite una experiencia fluida para los usuarios.

Además, Molly-js ofrece la capacidad de crear múltiples instancias del servidor en varios hilos, lo que lo hace ideal para aplicaciones de alta carga. Basado en el patrón de diseño MVC, este framework fomenta una estructura organizada y escalable para tus aplicaciones web. Además, viene integrado con un generador de sitios estáticos, lo que facilita la creación de contenido estático para tus aplicaciones.

Con Molly-js, los desarrolladores pueden enfocarse en la creación de aplicaciones web de alta calidad y no preocuparse por la complejidad de la infraestructura subyacente. Únete a la comunidad de desarrollo de Molly-js y comienza a crear aplicaciones web impresionantes con facilidad.

## Características principales

- API similar a Express.js
- Basado en el patrón de diseño MVC
- Optimizado para transmisión de Videos
- Integrado con un generador de sitios estáticos
- Capacidad para crear múltiples instancias del servidor en varios hilos

## Instalación

Para instalar Molly-js en tu proyecto, simplemente ejecuta el siguiente comando en tu terminal:

```bash
  npm install molly-js 
```

## Uso

Para comenzar a usar Molly-js en tu proyecto, primero debes requerirlo en tu archivo de entrada:

```javascript
const molly = require('molly-js');
```

A partir de ahí, tienes que definir las rutas de los **controladores**, la ruta de los archivos **estaticos** y la cantidad de intanicas o threads del servidor:

```javascript
molly.createHTTPServer({
  controller: path.join(__dirname,'testServer','Controller'),//Controller Components Paths
  viewer: path.join(__dirname,'testServer','Viewer'),        //Viewer Components Paths
  thread: 1                                                  //Number of instances
});
```

Luego, para crear una nuevo controlador, simplemente creas un nuevo archivo `.js` dentro de la carpera `controlador` y defines el comportamiento del contrlador:
```javascript
module.exports = (req,res)=>{
    res.send(req.params,200);   
}
```

Para crear una pagina con generasion estatica, simplemente tienes que usar las etiquetas `/°°/` para generar codigo  o la etiqueta `<°°>`:

- Aqui un ejemplo para generar una pagina usando la etiqueta `/°°/`:
```html
    <body>
        /°(()=>{
            const result = new Array();
            for( var i=100; i--; ){
                result.push(`
                    <a style="background: #222; color: white" > hola mundo ${i} </a> <br>
                `);
            } return result.join('');
        })()°/    
    </body>
```

- Aqui un ejemplo para generar una pagina usando la etiqueta `<°°>`:
```html
    <body>
        <°PATH/TO/A/HTML_MODULE°>
    </body>
```

[aqui un ejemplo sencillo en Molly-js]()

## Contribución

¡Estamos abiertos a contribuciones! Si deseas ayudar a mejorar Molly-js, por favor envía un pull request o abre un issue en nuestro repositorio en GitHub.

## Licencia

Molly-js está disponible bajo la licencia MIT. Consulta el archivo LICENSE.md para obtener más información.
