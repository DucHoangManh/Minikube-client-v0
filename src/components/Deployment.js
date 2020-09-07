import React from 'react';
import File from 'react-files';
class Deployment extends React.Component {
  constructor(props){
    super(props);
    this.state = { name: '',
            replicas:0,
            image: '',
            port:'',
            log:'',
            list: [],
            select: '',
            fileContent: ''};
    this.fileReader = new FileReader();
    this.fileReader.onload = event =>{
      this.setState({fileContent:JSON.parse(this.fileReader.result)},()=>{
        //console.log(JSON.stringify(this.state.fileContent));
        this.createDeploymentFromFile();
      });
    }
  }
  componentDidMount(){
    this.getDeploymentList();
  }
  onNameChange =event=>{
    this.setState({ name: event.target.value });
  };
  onRepChange =event=>{
    this.setState({ replicas: event.target.value });
  };
  onImageChange =event=>{
    this.setState({ image: event.target.value });
  };
  onPortChange =event=>{
    this.setState({ port: event.target.value });
  };
  onSelect =event=>{
    this.setState({select:event.target.value});
  }
  getDeploymentList=()=>{
    let requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    const url = "http://127.0.0.1:8000/apis/apps/v1/namespaces/default/deployments/";
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

//Delete choosen deployment  
  deleteDeployment = ()=>{
    if (this.state.select===''){
      alert('Please choose a deployment..');
      return;
    }
    let requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };
    
    fetch(`http://127.0.0.1:8000/apis/apps/v1/namespaces/default/deployments/${this.state.select}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        this.setState({log:result});
        alert("Delete "+JSON.parse(result).status);
      })
      .catch(error => this.setState({log:error}));
  }

//Create a deployment from fields (test purpose)
  createDeployment =()=>{
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({
      "apiVersion": "apps/v1",
      "kind": "Deployment",
      "metadata": {
        "name": this.state.name
      },
      "spec": {
        "replicas": parseInt(this.state.replicas),
        "selector": {
          "matchLabels": {
            "component": this.state.name
          }
        },
        "template": {
          "metadata": {
            "labels": {
              "component": this.state.name
            }
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
        }
      }
    });

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://127.0.0.1:8000/apis/apps/v1/namespaces/default/deployments/", requestOptions)
      .then(response => response.text())
      .then(result => {
        alert(JSON.parse(result).kind === "Deployment" ? "Successfully Created" : "Failure");
        this.setState({log:result})
      })
      .catch(error => this.setState({log:error}));
  }

//Create a deployment from uploaded file
  createDeploymentFromFile =()=>{
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: 'POST',
      body: JSON.stringify(this.state.fileContent),
      redirect: 'follow',
      headers:myHeaders
    };

    fetch("http://127.0.0.1:8000/apis/apps/v1/namespaces/default/deployments/", requestOptions)
      .then(response => response.text())
      .then(result => {
        if (JSON.parse(result).status === "Failure" && JSON.parse(result).reason === "AlreadyExists"){
          this.updateDeploymentFromFile()
        }else alert(JSON.parse(result).kind === "Deployment" ? "Successfully Created" : "Failure");        
        this.setState({log:result})
      })
      .catch(error => this.setState({log:error}));
  }

//update Deployment from uploaded file
  updateDeploymentFromFile =()=>{
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(this.state.fileContent),
      redirect: 'follow'
    };
    fetch(`http://127.0.0.1:8000/apis/apps/v1/namespaces/default/deployments/${this.state.fileContent.metadata.name}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        alert(JSON.parse(result).kind === "Deployment" ? "Successfully Updated" : "Failure");
        this.setState({log:result});
      })
      .catch(error => this.setState({log:error}));
  }

//update a deployment from fields (test purpose)
  updateDeployment =()=>{
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let currentName=this.state.select, currentRepplicas=0, currentImage='', currentPort=0, currentLabels={};
    for (let i=0; i< this.state.list.length;i++){
      if (this.state.select===this.state.list[i].metadata.name){
        currentLabels=this.state.list[i].spec.template.metadata.labels;
        currentRepplicas= this.state.list[i].status.replicas;
        currentImage=this.state.list[i].spec.template.spec.containers[0].image;
        currentPort=this.state.list[i].spec.template.spec.containers[0].ports[0].containerPort;
      }       
    }
    let desName = this.state.name === '' ? currentName : this.state.name;
    let desReplicas = this.state.replicas === 0 ? currentRepplicas : this.state.replicas;
    let desImage = this.state.image === '' ? currentImage : this.state.image;
    let desPort = this.state.port === '' ? currentPort : this.state.port;
    let raw = JSON.stringify({
      "apiVersion": "apps/v1",
      "kind": "Deployment",
      "metadata": {
        "name": desName
      },
      "spec": {
        "replicas": parseInt(desReplicas),
        "selector": {
          "matchLabels": currentLabels
        },
        "template": {
          "metadata": {
            "labels": currentLabels
          },
          "spec": {
            "containers": [
              {
                "name": desName,
                "image": desImage,
                "ports": [
                  {
                    "containerPort": parseInt(desPort)
                  }
                ]
              }
            ]
          }
        }
      }
    });

    let requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch(`http://127.0.0.1:8000/apis/apps/v1/namespaces/default/deployments/${this.state.select}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        alert(JSON.parse(result).kind === "Deployment" ? "Successfully Updated" : "Failure");
        this.setState({log:result});
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
          <th>Deployment name</th>
          <th>Replicas (Available/Total)</th>
          <th>Image</th>
        </tr>
        </thead>
      <tbody>
      {this.state.list.map(item=>{
        return (
          <tr key={item.metadata.name}>
            <td>{item.metadata.name}</td>
            <td>{(item.status.availableReplicas===undefined ? 0 : item.status.availableReplicas) + '/' +item.status.replicas }</td>
            <td>{item.spec.template.spec.containers[0].image}</td>
          </tr>
        );
    })}
      </tbody>
    </table>
    )
  }
  onFileSubmit=(files)=>{
    this.fileReader.readAsText(files);
  }
  onFileError=()=>{
    alert("unsuitable file");
  }
  render() {
    return (
        <div className="ui segment">
        <form onSubmit={this.onFormSubmit} className="ui form">
          <h3>Upload a config file</h3>
          <File className="ui segment"
            clickable
            onChange={files => this.onFileSubmit(files[0])}
            onError={this.onFileError}
            accepts={['.json']}
            multiple
          >Click or drop your config file(json) here</File>
          <br/>
            <div className="fields">
              <div className="field">
                <label>Deployment name:</label>
                <input type="text" placeholder="Name of deployment" onChange={this.onNameChange}/>
              </div>
              <div className="field">
                <label>Replicas:</label>
                <input type="text" placeholder="Number of instances" onChange={this.onRepChange}/>
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
                <button className="ui button" onClick={this.createDeployment}>Create</button>
              </div>
              <div className="field">
                <label>{"_"}</label>
                <button className="ui button" onClick={this.updateDeployment}>Update</button>
              </div>
              <div className="field">
                <label>{"_"}</label>
                <button className="ui button" onClick={this.deleteDeployment}>Delete</button>
              </div>
            </div>
        </form>
        <select className="ui dropdown" onChange={this.onSelect}>
          <option value="">Select A Deployment</option>
          {this.state.list.map(item=>{
            return <option value={item.metadata.name} key={item.metadata.name}>{item.metadata.name}</option>
          })}
        </select>
        <br/><br/>
        <button className="ui button" onClick={this.getDeploymentList}>Reset</button> 
        {this.renderList()}
        <h3>Response log:</h3>
        <pre>
          {this.state.log}
        </pre>
      </div>
    );
  }
}

export default Deployment;
