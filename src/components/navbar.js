import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class MainNavigation extends Component {
    constructor(props){
        super(props)
    }

    localeSelectRender(){
        const { langData, locales, currentLocale, selectEvent } = this.props,
            langSelectString = langData['language-select'];

        return (
            <NavDropdown title={`${ langSelectString }: (${ currentLocale })`} onSelect={selectEvent} id={langSelectString}>
                { locales.map(( locale, index ) =>
                    <MenuItem key={`${ locale }-${ index }`} eventKey={ index }>{ locale }</MenuItem>)
                }
            </NavDropdown>
        )
    }

    render(){
        const { langData } = this.props;

        return(
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="https://cosmicjs.com">
                            <img className="pull-left" src="https://cosmicjs.com/images/logo.svg" width="30" height="30" />
                            { langData['app-title'] }
                        </a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav></Nav>
                    <Nav pullRight>
                        { this.localeSelectRender() }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default MainNavigation;