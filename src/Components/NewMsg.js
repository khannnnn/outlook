import React from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import {ToastsContainer, ToastsStore} from 'react-toasts';

class NewMsg extends React.Component{
    constructor(){
        super();
        this.state = {
            messageTo:'',
            textMessage:'',
            messageSub:''
        }
    }

    sendMsg(){
        console.log("Send new msg");
        console.log("Form value: ", this.state);
        let self = this;
        axios.post('http://localhost:3000/messageHistory',{
            "msgTo": this.state.messageTo,
            "msgFrom": localStorage.getItem("userMailId"),
            "msgSub": this.state.messageSub,
            "msgTest": this.state.textMessage,
            "msgStatus": 1,
          })
        .then(function (response) {
            console.log(response);
            self.props.parentCallback("");
            ToastsStore.success("Replay successfull!")
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    sendData = () => {
        this.props.parentCallback("New msg cancle");
    }

    render(){
        return(
            <div>
                <ToastsContainer store={ToastsStore}/>
                <Card style={{ width: '100%' }}>
                    <Card.Body>
                        <Card.Title>
                            <Button 
                                variant="success" size="sm" 
                                style={{margin:"5px"}}
                                onClick={()=>this.sendMsg()}
                            >SEND</Button>
                            <Button variant="secondary" 
                                size="sm" style={{margin:"5px"}}
                                onClick={()=>this.sendData()}
                            >CANCLE</Button>
                        </Card.Title><hr />
                        <Card.Subtitle className="mb-2 text-muted">
                            <Form.Group>
                                <Form.Label>To</Form.Label>
                                <Form.Control type="email" 
                                    placeholder="Enter email" 
                                    onChange={(e)=>this.setState({messageTo:e.target.value})}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>To</Form.Label>
                                <Form.Control type="text" 
                                    placeholder="Subjects" 
                                    onChange={(e)=>this.setState({messageSub:e.target.value})}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Message</Form.Label>
                                <Form.Control as="textarea" rows="5" 
                                    onChange={(e)=>this.setState({textMessage:e.target.value})}
                                />
                            </Form.Group>
                        </Card.Subtitle>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default NewMsg;