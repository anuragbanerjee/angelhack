
import React from 'react';
import Checkbox from 'material-ui/Checkbox';

const styles = {
    container: {
        paddingLeft: 0
    },
    header: {
        borderBottom: '1px solid black',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    item: {
        borderBottom: '1px solid #999',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    itemSpan: {
        flexBasis: '25%',
        flexGrow: 0,
        textAlign: 'center'
    },
    checkbox: {
        width: 'inherit',
        margin: 'auto',
        paddingLeft: '8px'
    },
    checkboxSpan: {
        flexGrow: '1',
        margin: 'auto'
    }
};

const parseOrders = function(orders) {
    var result = [];
    for (var i = 0; i < orders.length; i++) {
        for (var j = 0; j < orders[i].order.length; j++) {
            var order = {
                item: orders[i].order[j].item,
                quantity: orders[i].order[j].quantity,
                showCheck: false
            };
            if (j === 0 ) {
                order.date = orders[i].date;
                order.showCheck = true;
            }
            result.push(order);
        }
    }
    return result;
};

class OrdersList extends React.Component {

    handleCheck(event, isInputChecked) {
        // HANDLE CHECK EVENT HERE
    }

    render() {

        var orders = parseOrders(this.props.orders);

        return (
            <ul style={styles.container}>
                <li style={styles.header}>
                    <span style={styles.itemSpan}>Date/Time</span>
                    <span style={styles.itemSpan}>Order Items</span>
                    <span style={styles.itemSpan}>Order Quantity</span>
                    <span style={styles.itemSpan}>Completed</span>
                </li>
                {orders.map(function(item, i){
                    if (item.showCheck) {
                        return (
                            <li key={i} style={styles.item}>
                                <span style={styles.itemSpan}>{item.date}</span>
                                <span style={styles.itemSpan}>{item.item}</span>
                                <span style={styles.itemSpan}>{item.quantity}</span>
                                <span style={styles.checkboxSpan}>
                                    <Checkbox onCheck={this.handleCheck} style={styles.checkbox} />
                                </span>
                            </li>
                        );
                    } else {
                        return (
                            <li key={i} style={styles.item}>
                                <span style={styles.itemSpan}>{item.date}</span>
                                <span style={styles.itemSpan}>{item.item}</span>
                                <span style={styles.itemSpan}>{item.quantity}</span>
                                <span style={styles.checkboxSpan}></span>
                            </li>
                        );
                    }
                }.bind(this))}
            </ul>
        );
    }
}

export default OrdersList;