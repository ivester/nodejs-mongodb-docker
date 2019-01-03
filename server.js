const express = require('express');
const app = express();
const mongodb = require('mongodb');

const config = require('./db');
const PORT = 4000;

var dataFromDB;

setTimeout(function() {
  mongodb.MongoClient.connect(config.DB, function(err, client) {
    if(err) {
        console.log('database is not connected', err)
    }
    else {
        const test = 'test';
        var myObj = {"hello":"World from DB"};
        var col = client.db(test).collection('createIndexExample1');
        col.find({}).toArray(function(err, items) {
          console.log("err", err);
          if (items.length === 0) {
            col.insert([myObj], {w:1}, function(err, result) {
              col.find({}).toArray(function(err, items) {
                console.log("items", items);
                dataFromDB = items[0]
              });
            });
          } else {
            console.log("data was persisted");
            col.updateOne(myObj, { $set: {"hello":"World from DB", "DB": "was persisted with volume"} }, function(err, res) {
              if (err) throw err;
              console.log("document updated");
              col.find({}).toArray(function(err, items) {
                console.log("items", items);
                dataFromDB = items[0]
              });
            });
          }
        });
    }
});
}, 20000); // give mongo db some time to be ready

app.get('/', function(req, res) {
    res.json(dataFromDB || {"hello": "world"});
});

app.listen(PORT, function(){
    console.log('Your node js server is running on PORT:',PORT);
});
