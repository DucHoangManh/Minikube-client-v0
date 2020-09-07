import React from 'react';
import Deployment from './Deployment';
import StatefulSet from './StatefulSet';
import DaemonSet from './DaemonSet';
import Pod from './Pod';
import NameSpace from './NameSpace';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends React.Component {
  state = { videos: [], selectedVideo: null };
  render() {
    return (
      <Router>
        <div className="App ui segment">
        <h1 className="App-header">Kubernetes client</h1>
          <header className="ui pointing menu">
              <Link className="ui item primary" to="/ns">NameSpace</Link>
              <Link className="ui item primary" to="/deployment">Deployments</Link>
              <Link className="ui item primary" to="/pod">Pod</Link>
              <Link className="ui item primary" to="/statefulset">StatefulSet</Link>
              <Link className="ui item primary" to="/daemonset">DaemonSet</Link>             
          </header>
          <div>
            <Route exact path="/deployment" component={Deployment} />
            <Route path="/statefulset" component={StatefulSet} />
            <Route path="/daemonset" component={DaemonSet} />
            <Route path="/pod" component={Pod} />
            <Route path="/ns" component={NameSpace} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
