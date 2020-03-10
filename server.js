//main file for BE 
const express = require('express');

//mongoose is a package that connect our BE to mlab and creating SCHEMA. cái string ở trong require chính là tên package
const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));

const app = express();

//set up server
const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
    console.log(`server listening on PORT${PORT}`)
})