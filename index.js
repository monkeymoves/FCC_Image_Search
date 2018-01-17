//Get Requirements and init them    

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
// const Bing = require('node-bing-api')({accKey: '9c4466b58c6243f397bfdffe9249b378'});
var Bing = require('node-bing-api')
            ({
              accKey: "9c4466b58c6243f397bfdffe9249b378",
              rootUri: "https://api.cognitive.microsoft.com/bing/v7.0/"
            });

// requires DB model
const searchTerm = require('./models/searchTerms');

//loads env variables
const dotenv = require('dotenv');
dotenv.load();
// reads body object middleware and cross site origin 
app.use(bodyParser.json());
app.use(cors());
// connects to db
const MONGODB_URI = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORTY+'/'+process.env.DB; 
mongoose.connect(MONGODB_URI || 'mongodb://localhost/searchTerms');




app.get('/api/imagesearch/:searchVal*', (req, res, next)=>{
    var { searchVal } = req.params;
    var { offset } = req.query;
    console.log(searchVal);
    
    let data = new searchTerm({
        searchVal,
        searchDate: new Date()
    });
    //save the searchVal
    data.save(err => {
        if (err){
            res.send('error saving to db');
        }
        // res.json(data);
    })
    var searchOffset;
    //does offset exist
    if (offset) {
        if(offset  ===1){
            offset=0;
            searchOffset = 1;
        } else if(offset > 1){
            searchOffset = offset + 1;
        }
    }
    Bing.images(searchVal, {
        top:(10 * searchOffset),
        skip:(10 *offset)
    }, function (error, rez, body){
    // res.json(body);
    let bingData=[];
    
    for(var i=0; i<10 ; i++){
        bingData.push({
            url: body.value[i].webSearchUrl,
            snippet: body.value[i].name,
            thumbnail: body.value[i].thumbnailUrl,
            context: body.value[i].hostPageDisplayUrl
        });
    }

    res.json(bingData);
    });


});

// respond with "hello world" when a GET request is made to the homepage
app.get('/api/recentsearches', (req, res) => {
    searchTerm.find({}, (err, data)=>{
        res.json(data);
    })

});




app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'))