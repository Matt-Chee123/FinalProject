/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')

const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

let tableName = "dbProj";
//if (process.env.ENV && process.env.ENV !== "NONE") {
//  tableName = tableName + '-' + process.env.ENV;
//}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "InstitutionID";
const partitionKeyType = "S";
const sortKeyName = "UniversityName";
const sortKeyType = "S";
const hasSortKey = sortKeyName !== "";
const path = "/items";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/************************************
* HTTP Get method to list objects *
************************************/

app.get(path, async function(req, res) {
  // Retrieve the selected UnitOfAssessmentName from query parameters
  // Use "Computer Science and Informatics" as the default value if uofaName is not provided
  const selectedUofA = req.query.uofaName || "Computer Science and Informatics";

  var params = {
    TableName: tableName,
    Select: 'ALL_ATTRIBUTES',
    // Add a filter expression for UnitOfAssessmentName using the selected or default UofA
    FilterExpression: 'UnitOfAssessmentName = :uofaName',
    ExpressionAttributeValues: {
      ':uofaName': selectedUofA,
    }
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    res.json(data.Items);
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});


//Top 3 items endpoint
app.get("/items/top3", async function(req, res) {
    // Retrieve the selected UnitOfAssessmentName from query parameters
    const selectedUofA = req.query.uofaName || "Computer Science and Informatics"; // Default value if not provided

    var params = {
        TableName: tableName,
        IndexName: 'UnitOfAssessmentName-UniversityName-index', // Use your index if applicable
        KeyConditionExpression: 'UnitOfAssessmentName = :uofaName',
        FilterExpression: 'ProfileType = :profileTypeValue', // Filter for ProfileType "Overall"
        ExpressionAttributeValues: {
            ":uofaName": selectedUofA,
            ":profileTypeValue": "Overall" // Define the value for ProfileType filter
        }
    };

    try {
        // Fetching items from DynamoDB using the GSI
        const data = await ddbDocClient.send(new QueryCommand(params));
        let items = data.Items;

        // If your sorting attribute is within the items, sort them by that attribute
        const sortedItems = items.sort((a, b) => b.AverageScore - a.AverageScore);

        // Getting the top 3 items
        const top3Items = sortedItems.slice(0, 3);

        // Sending the top 3 items as the response
        res.json(top3Items);
    } catch (err) {
        // Error handling
        res.status(500).json({error: 'Could not load items: ' + err.message});
    }
});



//Bottom 3 items endpoint
app.get("/items/bottom3", async function(req, res) {
    // Retrieve the selected UnitOfAssessmentName from query parameters
    const selectedUofA = req.query.uofaName || "Computer Science and Informatics"; // Default value if not provided

    var params = {
        TableName: tableName,
        IndexName: 'UnitOfAssessmentName-UniversityName-index', // Use your index if applicable
        KeyConditionExpression: 'UnitOfAssessmentName = :uofaName',
        FilterExpression: 'ProfileType = :profileTypeValue', // Filter for ProfileType "Overall"
        ExpressionAttributeValues: {
            ":uofaName": selectedUofA,
            ":profileTypeValue": "Overall" // Define the value for ProfileType filter
        }
    };

    try {
        // Fetching items from DynamoDB using the GSI
        const data = await ddbDocClient.send(new QueryCommand(params));
        let items = data.Items;

        // If your sorting attribute is within the items, sort them by that attribute
        const sortedItems = items.sort((a, b) => b.AverageScore - a.AverageScore);

        const bottom3Items = sortedItems.slice(-3);

        res.json(bottom3Items);
    } catch (err) {
        // Error handling
        res.status(500).json({error: 'Could not load items: ' + err.message});
    }
});

//Outputs endpoint
app.get("/items/outputs", async function(req, res) {
    const selectedUofA = req.query.uofaName || "Computer Science and Informatics"; // Default value if not provided

    var params = {
        TableName: tableName,
        // If you're using an index to filter by UnitOfAssessmentName, ensure it's correctly named and includes ProfileType as an attribute
        IndexName: 'UnitOfAssessmentName-UniversityName-index',
        KeyConditionExpression: 'UnitOfAssessmentName = :uofaName',
        FilterExpression: 'ProfileType = :profileTypeValue', // Correct filter for ProfileType "Outputs"
        ExpressionAttributeValues: {
            ":uofaName": selectedUofA,
            ":profileTypeValue": "Outputs"
        }
    };

    try {
        // Depending on your DynamoDB setup, you might need to use a QueryCommand instead of ScanCommand
        // QueryCommand is more efficient when using an index to filter results
        const data = await ddbDocClient.send(new QueryCommand(params)); // Changed to QueryCommand
        let items = data.Items;

        // Since you're already filtering by ProfileType in the query, additional client-side filtering is not necessary
        // Just return the filtered items directly
        res.json(items);
    } catch (err) {
        // Error handling
        res.status(500).json({error: 'Could not load items: ' + err.message});
    }
});


//overall endpoint
app.get("/items/overall", async function(req, res) {
    var params = {
        TableName: tableName,
        FilterExpression: "ProfileType = :profileTypeValue",
        ExpressionAttributeValues: {
            ":profileTypeValue": "Overall"
        }
    };

    try {
        // Fetching items from DynamoDB
        const data = await ddbDocClient.send(new ScanCommand(params));
        let items = data.Items;

        // Filter items by 'ProfileType' and then sort by 'AverageScore' in descending order
        const filteredItems = items.filter(item => item.ProfileType === "Overall");
        // Sending the top 3 items as the response
        res.json(filteredItems);
    } catch (err) {
        // Error handling
        res.status(500).json({error: 'Could not load items: ' + err.message});
    }
});
//Environment endpoint
app.get("/items/environment", async function(req, res) {
    var params = {
        TableName: tableName,
        FilterExpression: "ProfileType = :profileTypeValue",
        ExpressionAttributeValues: {
            ":profileTypeValue": "Environment"
        }
    };

    try {
        // Fetching items from DynamoDB
        const data = await ddbDocClient.send(new ScanCommand(params));
        let items = data.Items;

        // Filter items by 'ProfileType' and then sort by 'AverageScore' in descending order
        const filteredItems = items.filter(item => item.ProfileType === "Environment");
        // Sending the top 3 items as the response
        res.json(filteredItems);
    } catch (err) {
        // Error handling
        res.status(500).json({error: 'Could not load items: ' + err.message});
    }
});


//income endpoint
app.get("/items/income", async function(req, res) {
    const selectedUofA = req.query.uofaName || "Computer Science and Informatics"; // Default value if not provided
    var params = {
        TableName: tableName,
        IndexName: 'UnitOfAssessmentName-UniversityName-index', // Use your index if applicable
        KeyConditionExpression: 'UnitOfAssessmentName = :uofaName',
        FilterExpression: 'UnitOfAssessmentName = :uofaName AND attribute_not_exists(ProfileType)', // Filter for ProfileType "Overall"
        ExpressionAttributeValues: {
            ":uofaName": selectedUofA
        }
    };
    try {
        // Specify the list of profile types to exclude

        // Depending on your data structure, you may need to use a QueryCommand if you have an appropriate GSI
        const data = await ddbDocClient.send(new ScanCommand(params));
        let items = data.Items;

        // Filter out items where the ProfileType is in the excluded list

        // Sending the filtered items as the response
        res.json(items);
    } catch (err) {
        // Error handling
        res.status(500).json({ error: 'Could not load items: ' + err.message });
    }
});

//Random3 endpoint
app.get("/items/random3", async function(req, res) {
    const selectedUofA = req.query.uofaName || "Computer Science and Informatics"; // Default value if not provided

    var params = {
        TableName: tableName,
        IndexName: 'UnitOfAssessmentName-UniversityName-index',
        KeyConditionExpression: 'UnitOfAssessmentName = :uofaName',
        FilterExpression: "ProfileType = :profileTypeValue",
        ExpressionAttributeValues: {
            ":uofaName": selectedUofA,
            ":profileTypeValue": "Overall" // Assuming 'Overall' is correct
        }
    };

    try {
        const data = await ddbDocClient.send(new QueryCommand(params)); // Assuming QueryCommand is intended
        let items = data.Items;

        // Shuffle and select top 3 items
        const shuffled = items.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, 3);

        res.json(selected);
    } catch (err) {
        res.status(500).json({error: 'Could not load items: ' + err.message});
    }
});

//autocomplete endpoint
app.get("/items/autocomplete", async function(req, res) {
    const searchTerm = req.query.query.toLowerCase(); // Convert search term to lower case

    var params = {
        TableName: tableName,
        ProjectionExpression: "UniversityName" // Only get the UniversityName attribute to minimize data transfer
    };

    try {
        const data = await ddbDocClient.send(new ScanCommand(params));

        // Use a Set to store unique university names
        const uniqueNames = new Set();
        const uniqueItems = data.Items.filter(item => {
            const nameLower = item.UniversityName.toLowerCase();
            const isDuplicate = uniqueNames.has(nameLower);
            const isMatch = nameLower.includes(searchTerm);
            if (isMatch && !isDuplicate) {
                uniqueNames.add(nameLower);
                return true;
            }
            return false;
        });

        // Convert back to original case for display
        const results = uniqueItems.map(item => item.UniversityName);

        res.json(results);
    } catch (err) {
        res.status(500).json({error: 'Could not search items: ' + err.message});
    }
});


//SearchInst endpoint
app.get("/items/search", async function(req, res) {
    const searchTerm = req.query.query;
    const unitOfAssessment = req.query.unitOfAssessment || "Computer Science and Informatics"; // Default to Computer Science and Informatics

    var params = {
        TableName: tableName,
        FilterExpression: "contains(UniversityName, :searchTerm) AND UnitOfAssessmentName = :unitOfAssessment",
        ExpressionAttributeValues: {
            ":searchTerm": searchTerm,
            ":unitOfAssessment": unitOfAssessment
        }
    };

    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        res.json(data.Items);
    } catch (err) {
        res.status(500).json({error: 'Could not search items: ' + err.message});
    }
});

//UofA endpoint
app.get("/items/unitofassessment", async function(req, res) {
    // Retrieve the selected UnitOfAssessmentName from query parameters
    const selectedUofA = req.query.uofaName;

    var params = {
        TableName: tableName,
        IndexName: 'UnitOfAssessmentName-UniversityName-index',
        KeyConditionExpression: 'UnitOfAssessmentName = :uofaName',
        ExpressionAttributeValues: {
            ':uofaName': selectedUofA
        }
    };

    try {
        // Fetching items from DynamoDB using the GSI
        const data = await ddbDocClient.send(new QueryCommand(params));
        res.json(data.Items);
    } catch (err) {
        // Error handling
        res.status(500).json({error: 'Could not query items: ' + err.message});
    }
});


//Overall and total income endpoint
app.get("/items/overall-and-income", async function(req, res) {
  var params = {
    TableName: tableName,
    FilterExpression: "#profileType = :profileTypeValue OR #incomeSource = :incomeSourceValue",
    ExpressionAttributeNames: {
      "#profileType": "ProfileType",
      "#incomeSource": "IncomeSource"
    },
    ExpressionAttributeValues: {
      ":profileTypeValue": "Overall",
      ":incomeSourceValue": "Total income"
    }
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({error: 'Could not load items: ' + err.message});
  }
});

//Outputs and income endpoint
app.get("/items/outputs-and-income", async function(req, res) {
  var params = {
    TableName: tableName,
    FilterExpression: "#profileType = :profileTypeValue OR #incomeSource = :incomeSourceValue",
    ExpressionAttributeNames: {
      "#profileType": "ProfileType",
      "#incomeSource": "IncomeSource"
    },
    ExpressionAttributeValues: {
      ":profileTypeValue": "Outputs",
      ":incomeSourceValue": "Total income"
    }
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({error: 'Could not load items: ' + err.message});
  }
});


/************************************
 * HTTP Get method to query objects *
 ************************************/

app.get(path + hashKeyPath, async function(req, res) {
  const condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [ convertUrlType(req.params[partitionKeyName], partitionKeyType) ];
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let queryParams = {
    TableName: tableName,
    KeyConditions: condition
  }

  try {
    const data = await ddbDocClient.send(new QueryCommand(queryParams));
    res.json(data.Items);
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, async function(req, res) {
  const params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  try {
    const data = await ddbDocClient.send(new GetCommand(getItemParams));
    if (data.Item) {
      res.json(data.Item);
    } else {
      res.json(data) ;
    }
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, async function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  try {
    let data = await ddbDocClient.send(new PutCommand(putItemParams));
    res.json({ success: 'put call succeed!', url: req.url, data: data })
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err, url: req.url, body: req.body });
  }
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, async function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  try {
    let data = await ddbDocClient.send(new PutCommand(putItemParams));
    res.json({ success: 'post call succeed!', url: req.url, data: data })
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err, url: req.url, body: req.body });
  }
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, async function(req, res) {
  const params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
     try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params
  }

  try {
    let data = await ddbDocClient.send(new DeleteCommand(removeItemParams));
    res.json({url: req.url, data: data});
  } catch (err) {
    res.statusCode = 500;
    res.json({error: err, url: req.url});
  }
});

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
