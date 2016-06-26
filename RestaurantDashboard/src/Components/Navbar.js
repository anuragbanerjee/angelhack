
import React from 'react';
import AppBar from 'material-ui/AppBar';

class Navbar extends React.Component {
    render() {
        return (
            <AppBar
                title="Orders Received"
                iconClassNameRight="muidocs-icon-navigation-expand-more"
            />
        );
    }
}

export default Navbar;