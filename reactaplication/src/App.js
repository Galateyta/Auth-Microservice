import { BrowserRouter, Route } from 'react-router-dom';
import Registry from './components/Registry/Registry';
import Login from './components/Login/Login';
import React from 'react';
import Home from './components/Profile/Home/Home'
import Forgot from './components/Forgot/Forgot';


class App extends React.Component {
  render() {
    return (
      <div>

        <BrowserRouter>
          <div>
            <Route path='/' exact component={Login} />
            <Route path='/reset' exact component={Forgot} />
            <Route path='/registry' exact component={Registry} />
            <Route path='/home' exact component={Home} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;