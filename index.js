const express = require('express');
const path = require('path')
const {createRestApi} = require('./backend/api');
const {createViewApi} = require('./fronted/api');

const port = 8080;           // port used to run server
const app = express();

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);


app.use(express.static(path.join(__dirname, 'fronted')));

createRestApi(app);
createViewApi(app);

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});