
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

const orderers = [];

// Populate mockOrders with real orders
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://q36tn2i2k7.execute-api.us-east-1.amazonaws.com/prod/",
  "method": "POST",
  "headers": {
    "accept": "application/json",
    "authorization": "AWS4-HMAC-SHA256 Credential=AKIAIABTV5I7DNEFBH6Q/20160626/us-east-1/execute-api/aws4_request, SignedHeaders=accept;content-type;host;x-amz-date, Signature=77fc57513716c146f5bf606d5eb3f99828bbb5aedac314eb778c4bd83a95d5e4",
    "content-type": "application/json",
    "host": "wbcghspoej.execute-api.us-east-1.amazonaws.com",
    "x-amz-date": "20160626T132743Z"
  },
  "processData": false,
  "data": "{\n  \"operation\": \"read\",\n  \"tableName\": \"Orders\",\n  \"payload\": { \n    \"TableName\" : \"Orders\",\n    \"Key\" : {\n        \"OrderId\": \"amzn1.ask.account.AFP3ZWPOS2BGJR7OWJZ3DHPKMOMNWY4AY66FUR7ILBWANIHQN73QHP4QSESDAI7CS2YFY4XLHEZO55GJENHXHEXQV6IOPRD6CGXTABP3VJJEG4D27MWN22O4U7TCHRKOIHAURMJU2EDCMN6TZJ3TZYNIOMCTUK5UGT6JAKWXEAOBAZH3D2MJMSRCCOIIZTDHSHGOLBJ2OPHXOLQ\"\n    }\n  }\n}"
}

$.ajax(settings).done(function (response) {
    console.log(response);
  var data = JSON.parse(response["Item"]["Data"]);
  var currentDiner = data["currentDiner"];
  if (orderers.indexOf(currentDiner) < 0 && data["placed"][currentDiner] === "Yes") {
      orderers.push(data[currentDiner]);
      var row = {date:moment(Date.now()).format("MM/DD/YYYY hh:mma"), order:[],
          isCompleted:false};
      for(var k in data["orders"][currentDiner]) {
          row["order"].push({item:k, quantity:data["orders"][currentDiner][k]});
      }
      mockOrders.push(row);
  }
});

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
