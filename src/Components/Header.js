import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl, Button, Row, Col, ListGroup } from 'react-bootstrap';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logInUserDetails: [],
            newMessageCount: 0,
            archiveMessageCount: 0,
            totalMessageCount: 0
        }
    }

    sendData = (value) => {
        this.props.parentCallback(value);
    }

    logout() {
        localStorage.clear();
        this.props.history.push('/');
    }

    componentDidMount() {
        this.userDetails();
    }

    userDetails() {
        let self = this;
        axios.get('http://localhost:3000/profile?id=' + localStorage.getItem("signUserId"))
            .then(function (response) {
                console.log(response);
                self.setState({
                    logInUserDetails: response.data[0]
                })
                self.msgCounts(response.data[0].email);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    msgCounts(email) {
        console.log("My email: ", email)
        var self = this;
        axios.get('http://localhost:3000/messageHistory?msgTo=' + email)
            .then(function (response) {
                console.log(response);
                let newCount = 0;
                let archivCount = 0;
                let totalCount = response.data.length;
                response.data.map((item, index) => {
                    if (item.msgStatus == 1) {
                        newCount = newCount + 1;
                    } else if (item.msgStatus == 2) {
                        archivCount = archivCount + 1;
                    }
                })

                self.setState({
                    newMessageCount: newCount,
                    archiveMessageCount: archivCount,
                    totalMessageCount: totalCount
                })
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    alertFunction() {
        console.log("Hello")
    }

    render() {
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Nav className="mr-auto">
                        <Row>
                            <Col sm={8} className="home-header-div">
                                <Button
                                    variant="outline-secondary"
                                    size="sm" className="button-style"
                                    onClick={() => this.sendData(1)}
                                >NEW </Button>
                                <Button
                                    variant="outline-secondary"
                                    size="sm" className="button-style"
                                    onClick={() => this.sendData(2)}
                                >Archived ({this.state.archiveMessageCount})</Button>
                                <Button
                                    variant="outline-secondary"
                                    size="sm" className="button-style"
                                    onClick={() => this.sendData(3)}
                                >Total ({this.state.totalMessageCount})</Button>
                                <Button
                                    variant="outline-secondary"
                                    size="sm" className="button-style"
                                >{this.state.logInUserDetails.name}</Button>
                                <Button
                                    variant="outline-secondary"
                                    size="sm" className="button-style"
                                    onClick={() => this.logout()}
                                >Exit</Button>
                            </Col>
                            <Col sm={4} className="home-header-div">
                                <FormControl type="text"
                                    placeholder="Search" className="mr-sm-2"
                                    onChange={(e) => this.sendData(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </Nav>
                </Navbar>
            </div>
        )
    }
}

export default withRouter(Header);