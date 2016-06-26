
/* main runner for the React build process */

// global dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin(); /* remove this after React 1.0 comes out */

// local dependencies
import Navbar from './Components/Navbar';
import OrdersList from './Components/OrdersList';

// muitheme
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {deepOrange500} from 'material-ui/styles/colors';
const muiTheme = getMuiTheme({
    palette: {accent1Color: deepOrange500}
});

const styles = {
    mainCol: {
        maxWidth: '960px',
        margin: '0 auto',
        fontFamily: "'Hind Siliguri', sans-serif"
    }
};

// TEMP - mock data
const mockOrders = [
    {date: '06/26/2016 1:20AM', order: [{item: 'pepperoni pizza', quantity: 1}, {item: 'breadsticks', quantity: 1}, {item: 'Cheese pizza', quantity: 4}], isCompleted: false},
    {date: '06/26/2016 1:22AM', order: [{item: 'breadsticks', quantity: 3}, {item: 'Cheese pizza', quantity: 1}], isCompleted: false},
    {date: '06/26/2016 1:23AM', order: [{item: 'pepperoni pizza', quantity: 1}, {item: '1 Liter of Sprite', quantity: false}], isCompleted: false},
    {date: '06/26/2016 1:26AM', order: [{item: 'mushroom pizza', quantity: 2}, {item: 'breadsticks', quantity: 1}, {item: 'Cheese pizza', quantity: 2}, {item: '1 Liter of Sprite', quantity: false}], isCompleted: false},
];

function FullPage({orders}) {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <div style={styles.mainCol}>
                <Navbar />
                <OrdersList orders={orders} />
            </div>
        </MuiThemeProvider>
    );
};

ReactDOM.render(
    <FullPage orders={mockOrders} />,
    document.getElementById('app')
);
