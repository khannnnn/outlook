import React from 'react';
import { Button, Jumbotron, Form, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Login extends React.Component{
    constructor(){
        super();
        this.state = {
            email:'',
            password:'',
            emailError:'',
            passwordError:'',
            alertError:false
        }
    }

    login(){
        this.clearError();
        if(this.validation()){
            console.log("Login Data: ", this.state);
            var self = this;
            axios.get('http://localhost:3000/profile?email='+this.state.email+'&password='+this.state.password)
            .then(function (response) {
                console.log(response);
                if(response.data.length > 0){
                    console.log(response.data);
                    localStorage.setItem("signUserId", response.data[0].id);
                    localStorage.setItem("userMailId", response.data[0].email)
                    self.props.history.push('/home');
                } else {
                    self.setState({
                        alertError: true
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }

    enterPressed(event) {
        var code = event.keyCode || event.which;
        if(code === 13) {
            this.login();
        } 
    }

    clearError(){
        this.setState({
            emailError: "",
            passwordError: ""
        })
    }

    validation(){
        if(this.state.email == '' && this.state.password == ''){
            this.setState({
                emailError: "Field is required",
                passwordError: "Field is required"
            });
            return false;
        } else if(this.state.email == ''){
            this.setState({
                emailError: "Field is required",
            });
            return false;
        } else if(this.state.password == ''){
            this.setState({
                passwordError: "Field is required",
            });
            return false;
        } else{
            return true;
        }
    }

    render(){
        return(
            <div>
                <Jumbotron>
                <Row>
                    <Col></Col>
                    <Col sm={4}>
                    <h4 className="text-center">Login</h4>
                        {/* <Form> */}
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control 
                                    type="email" placeholder="Enter email" 
                                    onChange={(e)=>this.setState({email: e.target.value})}
                                    onKeyPress={this.enterPressed.bind(this)}
                                />
                                <Form.Text className="text-error">
                                    {this.state.emailError}
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" placeholder="Password"
                                    onChange={(e)=>this.setState({password: e.target.value})}
                                    onKeyPress={this.enterPressed.bind(this)}
                                />
                                <Form.Text className="text-error">
                                    {this.state.passwordError}
                                </Form.Text>
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary" onClick={()=>this.login()} block>
                                    Login
                                </Button>
                            </Form.Group>
                            {
                                this.state.alertError ? 
                                    <Alert variant="danger">
                                        E-mail or password is in-correct.
                                    </Alert>
                                : null
                            }

                        {/* </Form> */}
                    </Col>
                    <Col></Col>
                </Row>
                </Jumbotron>
            </div>
        )
    }
}

export default withRouter(Login);