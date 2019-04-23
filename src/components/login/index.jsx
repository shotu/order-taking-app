import React,{Component} from 'react';

class LoginPage extends Component{
  constructor(props){
    super(props)
    this.state={
      email:"",
      pass:""
    }
  }

  setValue=(evt)=>{
    this.setState({ [evt.target.name]: evt.target.value });
  }

  submitForm=()=>{
    console.log("state",this.state);
  }

  render(){
    return(
      <div>
            Enter Email:<input type="text" placeholder="email" 
            onChange={this.setValue} name="email"/><br/>
            Enter password:<input type="password" placeholder="password" name="pass"
            onChange={this.setValue}/><br/>
            <button onClick={this.submitForm}>Submit</button>
      </div>
    )
  }
}
export default LoginPage