const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const app = express();

AWS.config.update({
  region: 'eu-north-1', // Replace with your region
  accessKeyId: process.env.access,
  secretAccessKey: process.env.secret
});

const dynamodb = new AWS.DynamoDB();
dynamodb.listTables().promise()
  .then(data => {
    console.log('connected to db')
    console.log('Tables:', data.TableNames);
  })
  .catch(err => {
    console.log('Error:', err);
  });


app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', (req, res) => {

    // Validate input
    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(400).send('Missing required fields');
        return;
    }
    // Build params object
    const params = {
        TableName: 'users',
        Item: {
            'username': { S: req.body.username },
            'email': { S: req.body.email },
            'password': { S: req.body.password }
        }
    };

  dynamodb.putItem(params, (err, data) => {
    if (err) {
      console.log('Error adding user', err);
      res.status(500).send('Error adding user');
    } else {
      console.log('User added successfully', data);
      res.status(200).send('User added successfully');
    }
  });

});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
