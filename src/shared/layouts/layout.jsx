import React, { Component, Fragment } from 'react';
import Header from './components/header.jsx';
import Body from './components/body.jsx';
import Footer from './components/footer.jsx';

class Layout extends Component {
    render() {
        const {
            header,
            body,
            footer,
            children
        } = this.props;

        return (
            <Fragment>
                <Header {...header}/>
                <Body {...body}>
                    {children}
                </Body>
                <Footer {...footer}/>
            </Fragment>
        )
    }
}

export default Layout;