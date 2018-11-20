import ReactDOM from "react-dom";
import Layout from "./components/Layout";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";


import createStore from "./store";

const app = document.getElementById( "app" );
const store = createStore( window.REDUX_DATA );

ReactDOM.hydrate(
  <ReduxProvider store={store}>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </ReduxProvider>

  ,
app );
