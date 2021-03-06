var $router = require('express').Router();

$router.get('/', function(req,res){
    res.sendfile("I will be your view, aber zackig!");
});

module.exports = $router;

/*
    / This represents our data to be passed in to the React component for
// rendering - just as you would pass data, or expose variables in
// templates such as Jade or Handlebars.  We just use an array of garbage
// here (with some potentially dangerous values for testing), but you could
// imagine this would be objects typically fetched async from a DB,
// filesystem or API, depending on the logged-in user, etc.
var props = {items: [0, 1, '</script>', '<!--inject!-->']}

// Now that we've got our data, we can perform the server-side rendering by
// passing it in as `props` to our React component - and returning an HTML
// string to be sent to the browser
var myAppHtml = React.renderToString(MyApp(props))

res.setHeader('Content-Type', 'text/html')

// Now send our page content - this could obviously be constructed in
// another template engine, or even as a top-level React component itself -
// but easier here just to construct on the fly
res.end(
    // <html>, <head> and <body> are for wusses

    // Include our static React-rendered HTML in our content div. This is
    // the same div we render the component to on the client side, and by
    // using the same initial data, we can ensure that the contents are the
    // same (React is smart enough to ensure no rendering will actually occur
    // on page load)
    '<div id=content>' + myAppHtml + '</div>' +

        // We'll load React from a CDN - you don't have to do this,
        // you can bundle it up or serve it locally if you like
    '<script src=//fb.me/react-0.12.0.min.js></script>' +

        // Then the browser will fetch the browserified bundle, which we serve
        // from the endpoint further down. This exposes our component so it can be
        // referenced from the next script block
    '<script src=/bundle.js></script>' +

        // This script renders the component in the browser, referencing it
        // from the browserified bundle, using the same props we used to render
        // server-side. We could have used a window-level variable, or even a
        // JSON-typed script tag, but this option is safe from namespacing and
        // injection issues, and doesn't require parsing
    '<script>' +
    'var MyApp = React.createFactory(require("myApp"));' +
    'React.render(MyApp(' + safeStringify(props) + '), document.getElementById("content"))' +
    '</script>'
)
*/