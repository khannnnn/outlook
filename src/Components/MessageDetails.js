import React from 'react';

class MessageDetails extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        console.log("Props data: ", this.props.data)
    }

    showAlert() {
        alert('Hello World');
    }

    render(){
        return(
            <div>
                <h1>Message components.</h1>
            </div>
        )
    }
}

export default MessageDetails;