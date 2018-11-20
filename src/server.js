import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchPath  } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import express from 'express';
import path from 'path';

import Layout from "./components/Layout";
import createStore, { initializeSession } from "./store";
import routes from './routes'

const app = express();

app.use( express.static( path.resolve(__dirname, "../dist") ) );

app.get( "/*", (req, res) => {
    const context = { };  //for tracking any redirects from 300
    const store = createStore( );

    store.dispatch( initializeSession( ) );

    const dataRequirements =
        routes
            .filter( route => matchPath( req.url, route ) ) // filter matching paths
            .map( route => route.component ) // map to components
            .filter( comp => comp.serverFetch ) // check if components have data requirement
            .map( comp => store.dispatch( comp.serverFetch( ) ) ); // dispatch data requirement

    Promise.all( dataRequirements ).then(() => {
      const layoutComp = (
        <ReduxProvider store={store}>
          <StaticRouter context={ context } location={ req.url }>
              <Layout />
          </StaticRouter>
        </ReduxProvider>
      );

      const reactDom = renderToString( layoutComp );
      const reduxState = store.getState( );

      res.writeHead( 200, { "Content-Type": "text/html" });
      res.end( htmlTemplate( reactDom, reduxState ));
    })

});

app.listen(2048);


const htmlTemplate = (reactDom, reduxState) => {
  return `
    <!DOCTYPE html>
       <html>
       <head>
           <meta charset="utf-8">
           <title>React SSR</title>
       </head>

       <body>
           <div id="app">${ reactDom }</div>
           <script>
              window.REDUX_DATA = ${ JSON.stringify( reduxState ) }
           </script>
           <script src="./app.bundle.js"></script>
       </body>
     </html>
  `
}
