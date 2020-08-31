import React from 'react';
class PVC extends React.Component {
  state = { name: '',log:'', list: [], select: ''};
  onNameChange =event=>{
    this.setState({ name: event.target.value });
  };
  onSelect =event=>{
    this.setState({select:event.target.value});
  }
  onFormSubmit = event => {
    event.preventDefault();
  };
  createNS=()=>{
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let ns = JSON.stringify({
      "apiVersion": "v1",
      "kind": "Namespace",
      "metadata": {
        "name": this.state.name
      }
    });
    let requestOptions = {
      method: 'POST',
      body: ns,
      redirect: 'follow'
    };
    const url = "http://127.0.0.1:8000//api/v1/namespaces/";
    fetch(url, requestOptions)
      .then(response => response.text())
      .then(result => {
        this.setState({log:result});
        console.log(result);;
      })
      .catch(error => console.log('error', error));
      this.fetchNameSpaceList();
  }

  componentDidMount() {
    this.fetchNameSpaceList(); 
  }
  fetchNameSpaceList=()=>{
    let requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const url = "http://127.0.0.1:8000//api/v1/namespaces/";
    fetch(url, requestOptions)
      .then(response => response.text())
      .then(result => {
        this.setState({log:result});
        this.setState({list:(JSON.parse(result).items)});
      })
      .catch(error => console.log('error', error));
      
  }
  renderList =()=> {
    if (this.state.list.length===0){
      return <div/>;
    }
    return (   
    <table className="ui celled table">
        <thead>
        <tr> 
          <th>NameSpace</th>
          <th>Status</th>
        </tr>
        </thead>
      <tbody>
      {this.state.list.map(item=>{
        //console.log(item)
        return (
          <tr key={item.metadata.name}>
            <td>{item.metadata.name}</td>
            <td>{item.status.phase}</td>
          </tr>
        );
    })}
      </tbody>
    </table>
    )
  }
  render() {
    return (
        <div className="ui segment">
        <form onSubmit={this.onFormSubmit} className="ui form">
          <h3>Create a new NameSpace</h3>
            <div className="fields">
              <div className="field">
                <input type="text" placeholder="Namespace" onChange={this.onNameChange}/>
              </div>
              <div className="field">
                <button className="ui button" onClick={this.createNS}>Create</button>
              </div>
            </div>
          <h3>Delete a NameSpace:</h3>
            <div className="fields">
              <div className="field">
              <select className="ui dropdown" onChange={this.onSelect}>
                <option value="">Select A NameSpace</option>
                  {this.state.list.map(item=>{
                  return <option value={item.metadata.name} key={item.metadata.name}>{item.metadata.name}</option>
                  })}
              </select>
              </div>
              <div className="field">
                <button className="ui button" onClick={this.deleteNS}>Delete</button>
              </div>
            </div>
        </form>
        <h3>NameSpace List:</h3>
        {this.renderList()}
        <h3>Response log:</h3>
        <pre>
          {this.state.log}
        </pre>
      </div>
    );
  }
}

export default PVC;

