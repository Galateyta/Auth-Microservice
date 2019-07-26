import React, { Component } from 'react';
import SideNav, { NavItem, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { NavLink, BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux';
import style from './Home.module.css';
import Change from '../ChangePassword/ChangePassword';
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
            name: this.props.user.name,
            surename: this.props.user.surename,
            email: this.props.user.email,
            password: this.props.user.name
        };

    }

logOut = () => {
    this.props.delUser(this.props.user);
    localStorage.setItem('token', '');
    console.log(this.props.user);
    this.props.history.push('/');


    }

    render() {

        return (
            <BrowserRouter>
                <SideNav className={style.sidenav} >
                    <SideNav.Toggle />
                    <SideNav.Nav defaultSelected="home" >
                        <NavItem eventKey="home">
                            <NavText >
                                <NavLink to='/home'>Home</NavLink>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="about">
                            <NavText>
                                <NavLink to='/home/changepass'>Change password</NavLink>
                            </NavText>
                        </NavItem>
                       
                        <button onClick={this.logOut} className={style.logOutButton}>Log Out</button>
                    </SideNav.Nav>
                </SideNav>
                <div className={style.container}>
                    <div className={style.rightConteiner}>
                        <Route path='/home/changepass' exact component={Change} />
                       
                    </div>
                </div>
            </BrowserRouter>
        );
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        delUser: user => dispatch(delUser(user))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);