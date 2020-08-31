import React from 'react';
class Pod extends React.Component {
  state = {ns:[],
          selectNS:'',
          name: '',
          image: '',
          port:'',
          log:'',
          list: [],
          select: ''};
  onNameChange =event=>{
    this.setState({ name: event.target.value });
  };
  onImageChange =event=>{
    this.setState({ image: event.target.value });
  };
  onPortChange =event=>{
    this.setState({ port: event.target.value });
  };
  onSelectNS=event=>{
    let sel = event.target.value === "Select A NameSpace" ? "default" : event.target.value;
    this.setState({selectNs:sel});
    this.getPodList(sel);
  }
  onSelect =event=>{
    this.setState({select:event.target.value});
  }
  async componentDidMount(){
    this.fetchNameSpaceList();
  }
  getPodList=(namespace)=>{
    let requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const url = `http://127.0.0.1:8000//api/v1/namespaces/${namespace}/pods`;
    fetch(url, requestOptions)
      .then(response => response.text())
      .then(result => {
        this.setState({log:result});
        this.setState({list:(JSON.parse(result).items)});
      })
      .catch(error => console.log('error', error));
      
  }
  onFormSubmit = event => {
    event.preventDefault();
  };
  fetchNameSpaceList=()=>{
    let requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const url = "http://127.0.0.1:8000//api/v1/namespaces/";
    fetch(url, requestOptions)
      .then(response => response.text())
      .then(result => {
        this.setState({ns:(JSON.parse(result).items)});
      })
      .catch(error => console.log('error', error));
      
  }
  deletePod = ()=>{
    if (this.state.select===''){
      alert('Please choose a pod..');
      return;
    }
    let requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };
    
    fetch(`http://127.0.0.1:8000/api/v1/namespaces/default/pods/${this.state.select}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        this.setState({log:result});
        alert(JSON.parse(result).kind === "Pod" ? "Success" : "Failure");
      })
      .catch(error => this.setState({log:error}));
  }
  createPod =()=>{
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({
      "apiVersion": "v1",
      "kind": "Pod",
      "metadata": {
        "name": this.state.name
      },
      "spec": {
        "containers": [
          {
            "name": this.state.name,
            "image": this.state.image,
            "ports": [
              {
                "containerPort": parseInt(this.state.port)
              }
            ]
          }
        ]
      }
    });

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://127.0.0.1:8000/api/v1/namespaces/default/pods/", requestOptions)
      .then(response => response.text())
      .then(result => {
        alert(JSON.parse(result).kind === "Pod" ? "Success" : "Failure");
        this.setState({log:result})
      })
      .catch(error => this.setState({log:error}));
  }
  
  renderList =()=> {
    if (this.state.list.length===0){
      return <div/>;
    }
    return (   
    <table className="ui celled table">
        <thead>
        <tr> 
          <th>Pod name</th>
          <th>Image</th>
        </tr>
        </thead>
      <tbody>
      {this.state.list.map(item=>{
        //console.log(item)
        return (
          <tr key={item.metadata.name}>
            <td>{item.metadata.name}</td>
            <td>{item.spec.containers[0].image}</td>
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
        <h3>Select a Namespace: </h3>
        <select className="ui dropdown" onChange={this.onSelectNS}>
          <option value="">Select A Namespace</option>
          {this.state.ns.map(item=>{
            return <option value={item.metadata.name} key={item.metadata.name}>{item.metadata.name}</option>
          })}
        </select>
        <br/>
            <div className="fields">
              <div className="field">
                <label>Pod name:</label>
                <input type="text" placeholder="Name of Pod" onChange={this.onNameChange}/>
              </div>
              <div className="field">
                <label>Image:</label>
                <input type="text" placeholder="Image name" onChange={this.onImageChange}/>
              </div>
              <div className="field">
                <label>Port:</label>
                <input type="text" placeholder="Container port:" onChange={this.onPortChange}/>
              </div>
              <div className="field">
              <label>Actions:</label>
                <button className="ui button" onClick={this.createPod}>Create</button>
              </div>
              <div className="field">
                <label>{"_"}</label>
                <button className="ui button" onClick={this.deletePod}>Delete</button>
              </div>
            </div>
        </form>
        <div className="fields">
        <select className="ui dropdown field" onChange={this.onSelect}>
          <option value="">Select A Pod</option>
          {this.state.list.map(item=>{
            return <option value={item.metadata.name} key={item.metadata.name}>{item.metadata.name}</option>
          })}
        </select>
        </div>
        <br/><br/>
        {this.renderList()}
        <h3>Response log:</h3>
        <pre>
          {this.state.log}
        </pre>
      </div>
    );
  }
}

export default Pod;
