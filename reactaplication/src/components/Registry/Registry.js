import React, { Component } from 'react';
import {Container, Col, Form, Row, Input, Button} from 'reactstrap';
import style from './Registry.module.css';

class Registry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            surname: '',
            gender: '',
            password: '',
            email: '',
            age:''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const elementId = e.target.id;
        switch (elementId) {
            case 'name': 
                this.setState({name: e.target.value});
                break;
            case 'surname':
                this.setState({surname: e.target.value});
                break;
            case 'email':
                this.setState({email: e.target.value});
                break;
            case 'genger':
                this.setState({gender: e.target.value});
                break;
            case 'password':
                this.setState({password: e.target.value});
                break;
            case 'age':
                this.setState({age: e.target.value});
                break;
            default: break;
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const curentUser = {
            "name": this.state.name,
            "surname": this.state.surname,
            "password": this.state.password,
            "email": this.state.email,
            "age": this.state.age,
            "gender": this.state.gender
        }

    fetch('http://172.20.24.9:8080/signup', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(curentUser)})
        .then((res) =>  {
            this.props.history.push('/')
        })
    }

    render() {
        return (
            <div className={style.App}>
                <Form className={style.form} onSubmit={this.handleSubmit}>
                    <Container>
                        <Row>
                            <Col><h2>Sing up</h2></Col>
                            <Col md="12">
                                <Input type="text" name="name" id="name" 
                                    placeholder="Name"
                                    onChange={this.handleChange} required/>
                            </Col>
                            <Col md="12">
                                <Input type="text" name="surname" id="surname"
                                    placeholder="Surname"
                                    onChange={this.handleChange} required/>
                            </Col>
                             <Col md="12">
                                <Input type="number" name="age" id="age" placeholder="Age"
                                    onChange={this.handleChange} required />
                            </Col>
                            <Col md="12">
                                <Input type="email" name="email" id="email"
                                    placeholder="Email" onChange={this.handleChange}
                                    required/>
                            </Col>
                            <Col md="12" name="gender" id="gender" 
                                onChange={this.handleChange} required>
                                <Col md="12">
                                    <Input type="radio" name="gender" id="gender"
                                        onChange={this.handleChange} required/>
                                        male
                                </Col>
                                <Col md="12">
                                    <Input type="radio" name="gender" id="gender"
                                        onChange={this.handleChange} required/>
                                    female
                                </Col>
                            </Col>

                            <Col md="12">
                                <Input type="password" name="password" id="password"
                                    placeholder="Passord" onChange={this.handleChange} 
                                    required/>
                            </Col>                           
                            <Col >
                                <Button className={style.signUpButton} 
                                onSubmit={this.handleSubmit}>Sign up</Button>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </div>
        );
    }
}

export default Registry;