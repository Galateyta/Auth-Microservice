import { Container, Col, Form, Row, Input, Button, } from 'reactstrap';
import React, { Component } from 'react';
import style from './Forgot.module.css';
import { connect } from 'react-redux';
import {addUser} from '../../actions/userAction';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleChange(e) {
        if (e.target.id === 'email') {
            this.setState({ email: e.target.value });
        } else if (e.target.id === 'password') {
            this.setState({ password: e.target.value });
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const user  = this.state;

        fetch('http://172.20.24.9:8080/resetpass', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body:  JSON.stringify( user)
            })
            .then(res =>{
               // TO DO redirect to login

            })
            .catch(error=>{
                
                alert(`Password or Username is false`);
                
            })




    }



    render() {
        return (
            <div className={style.App} >

                <Form className={style.form} onSubmit={this.handleSubmit}>
                    <Container>
                        <Row>
                            <Col >
                                <h2>Forgot password</h2>
                            </Col>
                            <Col >

                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    onChange={this.handleChange}
                                    required
                                />

                            </Col>
                                                
                            <Col  >
                                <Button className={style.reset} onSubmit={this.onSubmit}>Reset</Button>                                
                            </Col>
                           
                        </Row>
                    </Container>
                </Form>

            </div>

        );
    }    
}
const mapStateToProps = (state) => {
    return {
      users: state.user
    }
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
      addUser: user => dispatch(addUser(user))
    }
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Login);




