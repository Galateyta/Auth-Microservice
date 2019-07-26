import React, { Component } from 'react';
import { Container, Col, Form, Row, Input, Button, } from 'reactstrap';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { connect } from 'react-redux';
import style from './Change.module.css';
import { delUser } from '../../../actions/userAction'


const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newPassword: '',
            password: '',
            email:''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    logOut = () => {
        this.props.delUser(this.props.user);
        localStorage.setItem('isLogin', false);
        console.log(this.props.user);
        this.props.history.push('/');


    }
    handleChange(e) {
        if (e.target.id === 'newPassword') {
            this.setState({ newPassword: e.target.value });
        } else if (e.target.id === 'password') {
            this.setState({ password: e.target.value });
        }else{
            this.setState({ email: e.target.value });

        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const user  = this.state;
        console.log('local',localStorage.getItem('token'))
        fetch('http://172.20.24.9:8080/change', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token':localStorage.getItem('token')
              },
              body:  JSON.stringify( user)
            })
            .then(res =>{
                console.log(res);
                if(404 === res.status){
                    alert('Email or password not true')

                }else if(!res.sucsses){
                    this.props.history.push('/home')

                }else{
                    alert('User is not validate. Please validate your account')
                }

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
                            <h2>Change password</h2>
                        </Col>
                        <Col >

                            <Input
                                type="text"
                                name="password"
                                id="password"
                                placeholder="Password"
                                onChange={this.handleChange}
                                required
                            />

                        </Col>
                        <Col >

                            <Input
                                type="text"
                                name="email"
                                id="email"
                                placeholder="email"
                                onChange={this.handleChange}
                                required
                            />

                        </Col>
                        <Col md="12">
                            <Input
                                type="password"
                                name="password"
                                id="newPassword"
                                placeholder="newPassord"
                                onChange={this.handleChange}
                                required
                            />
                        </Col>
                    </Row>
                   
                    <Row>
                        <Col  >
                            <Button className={style.signInButton} onSubmit={this.onSubmit}>Change </Button>
                        </Col>
                    </Row>
                </Container>
            </Form>

        </div>

        );
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        delUser: user => dispatch(delUser(user))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);