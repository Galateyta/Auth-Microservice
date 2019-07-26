import React, {Component} from 'react';
import SideNav, {NavItem, NavText} from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {NavLink, BrowserRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import style from './Home.module.css';
import {delUser} from '../../../actions/userAction';

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
        localStorage.setItem('isLogin', false);
        console.log(this.props.user);
        this.props.history.push('/');
    }

    render() {
        return (
            <BrowserRouter>
                <SideNav className={style.sidenav} >
                    <SideNav.Toggle/>
                    <SideNav.Nav defaultSelected="home" >
                        <NavItem >
                            <div className={style.userStyle}>
                                <img src="https://www.adster.ch/wp-content/uploads/2018/09/user.png"
                                    alt="img" />
                            </div>
                        </NavItem>
                        <NavItem >
                            {this.state.name}                            
                        </NavItem>
                        <NavItem >
                            <p>{this.state.surename}</p>  
                        </NavItem>
                        <NavItem >
                            <NavText><p>{this.state.email}</p>
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="home">
                            <NavText >
                                <NavLink to="/home">Home</NavLink>
                            </NavText>
                        </NavItem>               
                        <button onClick={this.logOut} className={style.logOutButton}>
                            Log Out
                        </button>
                    </SideNav.Nav>
                </SideNav>   
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