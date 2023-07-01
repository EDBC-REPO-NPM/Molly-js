# Molly-js

Molly-js is a web server framework for Node.js that allows developers to quickly and easily create web applications. With an API similar to the popular Express.js library, Molly-js makes it easy to create HTTP and HTTPS servers, and its well-designed architecture optimized for video streaming provides a smooth experience for users.

In addition, Molly-js offers the ability to create multiple instances of the server in multiple threads, making it ideal for high-load applications. Based on the MVC design pattern, this framework encourages an organized and scalable structure for your web applications. It also comes integrated with a static site generator, making it easier to create static content for your applications.

With Molly-js, developers can focus on creating high-quality web applications without worrying about the complexity of the underlying infrastructure. Join the Molly-js development community and start creating impressive web applications with ease.

## Key Features

- API similar to Express.js
- Based on the MVC design pattern
- Optimized for video streaming
- Integrated with a static site generator
- Ability to create multiple instances of the server in multiple threads

## Installation

To install Molly-js in your project, simply run the following command in your terminal:

```bash
npm install molly-js 
```

## Usage

To start using Molly-js in your project, you first need to require it in your entry file:

```javascript
const molly = require('molly-js');
```

From there, you need to define the routes of the **controllers**, the path to the static files and the number of instances or threads of the server:

```javascript
molly.createHTTPServer({
  controller: path.join(__dirname,'testServer','Controller'),//Controller Components Paths
  viewer: path.join(__dirname,'testServer','Viewer'),        //Viewer Components Paths
  thread: 1                                                  //Number of instances
});
```

Then, to create a new controller, simply create a new `.js` file inside the `controller` folder and define the behavior of the controller:

```javascript
module.exports = (req,res)=>{
    res.send(req.params,200);   
}
```

To create a page with static generation, you simply have to use the `/°°/` tags to generate code or the `<°°>` tag:

- Here's an example of how to generate a page using the `/°°/` tag:

```html
<body>
    /°(()=>{
        const result = new Array();
        for( var i=100; i--; ){
            result.push(`
                <a style="background: #222; color: white" > hello world ${i} </a> <br>
            `);
        } return result.join('');
    })()°/    
</body>
```

- Here's an example of how to generate a page using the `<°°>` tag:

```html
<body>
    <°PATH/TO/A/HTML_MODULE°>
</body>
```

## Example

[Here's a simple example using Molly-js.](https://github.com/EDBC-REPO-NPM/Molly-js/tree/main/example)

## Contribution

We welcome contributions! If you'd like to help improve Molly-js, please submit a pull request or open an issue on our GitHub repository.

## License

Molly-js is available under the MIT License. See the LICENSE.md file for more information.
