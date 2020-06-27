import React from 'react';
import { Card, Row, Col, ListGroup, Button, Form } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import NewMsg from './NewMsg';
import Header from './Header';
import axios from 'axios';
import { ToastsContainer, ToastsStore } from 'react-toasts';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newMessage: false,
            preMessageDetails: '',
            replayMsg: false,
            replayMesFormData: { textMessage: '', messageTo: '', messageSub: '' },
            mesDetailsArray: [],
            showingMesDetails: []
        }
        if (!localStorage.getItem("signUserId")) {
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        console.log("componentDidMount");
        this.allMessageDetails()

    }

    callbackFunction = (childData) => {
        console.log("Child data: ", childData);
        if (childData == 1) {
            this.setState({
                newMessage: true
            })
        } else if (childData == 2) {
            this.setState({
                newMessage: false,
                replayMsg: false
            });
            this.allArchiveMessageDetails();
        } else if (childData == 3) {
            this.allMessageDetails();
        } else {
            this.messageListWithSearch(childData)
        }
    }

    messageListWithSearch(value) {
        if (value == '') {
            this.allMessageDetails();
            return;
        }

        let self = this;
        axios.get('http://localhost:3000/messageHistory?msgSub=' + value + '&msgTo=' + localStorage.getItem("userMailId"))
            .then(function (response) {
                console.log(response);
                if (response.data.length > 0) {
                    self.setState({
                        mesDetailsArray: response.data,
                        showingMesDetails: [response.data[0]]
                    })
                } else {
                    self.setState({
                        mesDetailsArray: [],
                        showingMesDetails: []
                    })
                    ToastsStore.success("Records not found!")
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    allArchiveMessageDetails() {
        console.log("All message details")
        let self = this;
        axios.get('http://localhost:3000/messageHistory?msgStatus=2&msgTo=' + localStorage.getItem("userMailId"))
            .then(function (response) {
                console.log(response);
                if (response.data.length > 0) {
                    self.setState({
                        mesDetailsArray: response.data.reverse(),
                        showingMesDetails: [response.data[0]].reverse()
                    })
                } else {
                    self.setState({
                        mesDetailsArray: [],
                        showingMesDetails: []
                    });
                    ToastsStore.success("Records not found!")
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    allMessageDetails() {
        console.log("All message details")
        let self = this;
        let url = 'http://localhost:3000/messageHistory?msgTo=' + localStorage.getItem("userMailId")
        axios.get(url)
            .then(function (response) {
                console.log(response);
                if (response.data.length > 0) {
                    self.setState({
                        mesDetailsArray: response.data.reverse(),
                        showingMesDetails: [response.data[0]].reverse()
                    })
                } else {
                    self.setState({
                        mesDetailsArray: [],
                        showingMesDetails: []
                    });
                    ToastsStore.success("Records not found!")
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    newMessage() {
        console.log("New MSG")
    }

    msgDetails(data) {
        console.log("Message details", data)
        this.setState({
            showingMesDetails: [data],
            newMessage: false
        });
    }

    newMsgCallbackFunction = (childData) => {
        console.log("Child data: ", childData);
        this.setState({
            newMessage: false
        })
    }

    replayMessage() {
        this.setState({
            replayMsg: true
        })
    }

    cancleMsg() {
        this.setState({
            replayMsg: false
        })
    }

    sendReplayMsg() {
        console.log("Replay mag here")
        console.log(this.state.replayMesFormData)
        let self = this;
        axios.post('http://localhost:3000/messageHistory', {
            "msgTo": this.state.replayMesFormData.messageTo,
            "msgFrom": localStorage.getItem("userMailId"),
            "msgSub": this.state.replayMesFormData.messageSub,
            "msgTest": this.state.replayMesFormData.textMessage,
            "msgStatus": 1,
        })
            .then(function (response) {
                console.log(response);
                self.cancleMsg();
                ToastsStore.success("Replay successfull!")
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    deleteMessage(id) {
        console.log("Delete mag here")
        let self = this;
        axios.delete('http://localhost:3000/messageHistory/' + id)
            .then(function (response) {
                console.log(response);
                self.allMessageDetails();
                ToastsStore.success("Record deleted!")
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    archiveMessage(data, status) {
        console.log("Archive msg: ", data);
        let self = this;
        axios.put('http://localhost:3000/messageHistory/' + data.id, {
            "msgTo": data.msgTo,
            "msgFrom": data.msgFrom,
            "msgSub": data.msgSub,
            "msgTest": data.msgTest,
            "msgStatus": status,
        })
            .then(function (response) {
                console.log(response);
                ToastsStore.success("Message added in archive folder!")
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <ToastsContainer store={ToastsStore} />
                <Header parentCallback={this.callbackFunction} />
                <div style={{ width: "98%" }}>
                    <Row>
                        <Col sm={3}>
                            {
                                this.state.mesDetailsArray.length > 0 ?
                                    this.state.mesDetailsArray.map((item, index) =>
                                        <ListGroup defaultActiveKey="#link1" key={index}>
                                            <ListGroup.Item action onClick={() => this.msgDetails(item)}>
                                                {
                                                    item.msgStatus == 1 ?
                                                        <b>{item.msgSub}</b>
                                                        :
                                                        <span>{item.msgSub}</span>
                                                }
                                                <p>{item.msgTest}</p>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    )

                                    : <h3>Records not found..</h3>
                            }

                        </Col>
                        <Col sm={9}>
                            {
                                this.state.newMessage ?
                                    <NewMsg parentCallback={this.newMsgCallbackFunction} />
                                    :
                                    <div>
                                        <Card style={{ width: '100%' }}>
                                            {
                                                this.state.replayMsg ?
                                                    <Card.Body>
                                                        {
                                                            this.state.showingMesDetails.length > 0 ?
                                                                <div>
                                                                    {
                                                                        this.state.showingMesDetails.map((item, index) =>
                                                                            <div key={index}>
                                                                                <Card.Title>
                                                                                    <Button
                                                                                        variant="success" size="sm"
                                                                                        style={{ margin: "5px" }}
                                                                                        onClick={() => this.sendReplayMsg()}
                                                                                    >SEND</Button>
                                                                                    <Button variant="secondary"
                                                                                        size="sm" style={{ margin: "5px" }}
                                                                                        onClick={() => this.cancleMsg()}
                                                                                    >CANCLE</Button>
                                                                                </Card.Title><hr />
                                                                                <Card.Subtitle className="mb-2 text-muted">
                                                                                    <Form.Group>
                                                                                        <Form.Label>To</Form.Label>
                                                                                        <Form.Control type="email"
                                                                                            placeholder="Enter email" readOnly
                                                                                            value={item.msgFrom}
                                                                                        />
                                                                                    </Form.Group>
                                                                                    <Form.Group>
                                                                                        <Form.Label>Subject</Form.Label>
                                                                                        <Form.Control type="text"
                                                                                            placeholder="Subject" readOnly
                                                                                            value={item.msgSub}
                                                                                        />
                                                                                    </Form.Group>
                                                                                    <Form.Group>
                                                                                        <Form.Label>Message</Form.Label>
                                                                                        <Form.Control as="textarea" rows="5"
                                                                                            onChange={(e) => this.setState({ replayMesFormData: { textMessage: e.target.value, messageTo: item.msgFrom, messageSub: item.msgSub } })}
                                                                                            value={this.state.replayMesFormData.textMessage}
                                                                                        />
                                                                                    </Form.Group>
                                                                                </Card.Subtitle>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                                : null
                                                        }
                                                    </Card.Body>
                                                    :
                                                    <Card.Body>
                                                        {
                                                            this.state.showingMesDetails.length > 0 ?
                                                                <div>
                                                                    {
                                                                        this.state.showingMesDetails.map((item, index) =>
                                                                            <div key={index}>
                                                                                <Card.Title>
                                                                                    <Button variant="success"
                                                                                        size="sm" style={{ margin: "5px" }}
                                                                                        onClick={() => this.replayMessage()}
                                                                                    >REPLAY</Button>
                                                                                    <Button variant="danger"
                                                                                        size="sm" style={{ margin: "5px" }}
                                                                                        onClick={() => this.deleteMessage(item.id)}
                                                                                    >DELETE</Button>
                                                                                    <Button variant="info" size="sm"
                                                                                        style={{ margin: "5px" }}
                                                                                        onClick={() => this.archiveMessage(item, 2)}
                                                                                    >ARCHIVE</Button>
                                                                                </Card.Title><hr />
                                                                                <Card.Subtitle className="mb-2 text-muted">
                                                                                    <Form.Group>
                                                                                        <Form.Label>From</Form.Label>
                                                                                        <Form.Control type="email"
                                                                                            placeholder="Enter email" readOnly
                                                                                            value={item.msgFrom}
                                                                                        />
                                                                                    </Form.Group>
                                                                                    <Form.Group>
                                                                                        <Form.Label>Subject</Form.Label>
                                                                                        <Form.Control type="text"
                                                                                            placeholder="Subject" readOnly
                                                                                            value={item.msgSub}
                                                                                        />
                                                                                    </Form.Group>
                                                                                    <Form.Group>
                                                                                        <Form.Label>Message</Form.Label>
                                                                                        <Form.Control
                                                                                            as="textarea" rows="5"
                                                                                            value={item.msgTest} readOnly
                                                                                        />
                                                                                    </Form.Group>
                                                                                </Card.Subtitle>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                                : null
                                                        }

                                                    </Card.Body>
                                            }
                                        </Card>
                                    </div>
                            }

                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default withRouter(Home);