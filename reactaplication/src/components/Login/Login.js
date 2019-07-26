import { Container, Col, Form,FormGroup,Label, Row, Input, Button, } from 'reactstrap';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './Login.module.css';
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

    handleSubmit = async (e) => {
        e.preventDefault();
        const user  = this.state;
        try {
            const result = await fetch('http://172.20.24.9:8080/signin', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify( user)
            });
            const content = await result.json();
                 if(content.isVerified){
                    localStorage.token = content.token;
                    this.props.history.push('/home');
                }else if (!content.isVerified){
                    alert('User is not validate. Please validate your account');
                }else{
                    alert('Email or password is not correct');

                }
        } catch (error) {
            console.log(error);
            alert(`Password or Username is false`);
        }
        
    }

    render() {
        return (
            <div className={style.App} >

                <Form className={style.form} onSubmit={this.handleSubmit}>
                    <Container>
                        <Row>
                            <Col >
                                <h2>Sign In</h2>
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
                            <Col md="12">
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Passord"
                                    onChange={this.handleChange}
                                    required
                                />
                            </Col>
                        </Row>
                        <FormGroup >
                          <Label >Remember me</Label>
                          <Input type = 'checkbox' className = 'login-comp-class'/>
                      </FormGroup>
                        <Row>
                            <Col  >
                                <Button className={style.signInButton} onSubmit={this.onSubmit}>Sign in </Button>
                                <Link to="/registry" className="comp-class"><Button className={style.signUpButton}>Sign up</Button></Link>
                                
                            </Col>
                            <Col>
                                <Link to="/reset" className="comp-class"><Button >Forgot password</Button></Link>
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




