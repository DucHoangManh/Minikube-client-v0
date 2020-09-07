import React from 'react';
class SelectNamespace extends React.Component{
  state={nsList:[], select: ''};
  onSelectNS=event=>{
    let sel = event.target.value === "Select A NameSpace" ? "default" : event.target.value;
    this.props.onNamespaceSelect(sel);
  }
  componentDidMount(){
    this.fetchNameSpaceList()
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
        this.setState({nsList:(JSON.parse(result).items)});
      })
      .catch(error => console.log('error', error));
      
  }
  render(){
    return (
      <div>
        <h3>Select a Namespace: </h3>
        <select className="ui dropdown" onChange={this.onSelectNS}>
          <option value="">Select A Namespace</option>
          {this.state.nsList.map(item=>{
            return <option value={item.metadata.name} key={item.metadata.name}>{item.metadata.name}</option>
          })}
        </select>
      </div>
    )
  }
}
export default SelectNamespace;