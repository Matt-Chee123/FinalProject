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

let tableName = "projDbNew";
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

//endpoint gets all data from a uoa
app.get(path, async function(req, res) {
// retrieve uofaName from the URL query string or default to 'Computer Science and Informatics'
  const selectedUofA = req.query.uofaName || "Computer Science and Informatics";

  var params = {
    TableName: tableName,
    Select: 'ALL_ATTRIBUTES',
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

app.get("/items/allIncomes", async function(req, res) {
// retrieve uoa from the URL query string or default to 'Computer Science and Informatics'
  const selectedUofA = req.query.uofaName || "Computer Science and Informatics";

  var params = {
      TableName: tableName,
      IndexName: 'UnitOfAssessmentName-UniversityName-index',
      KeyConditionExpression: 'UnitOfAssessmentName = :uofaName',
      ExpressionAttributeValues: {
          ":uofaName": selectedUofA
      },
      //filters for income sources
      FilterExpression: 'attribute_exists(IncomeSource)'
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    res.json(data.Items);
  } catch (error) {
    console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
    res.status(500).send(error);
  }
});


app.get("/items/all", async function(req, res) {
    // retrieve the selected UnitOfAssessmentName from query parameters
    const selectedUofA = req.query.uofaName || "Computer Science and Informatics";

    var params = {
        TableName: tableName,
        IndexName: 'UnitOfAssessmentName-UniversityName-index',
        KeyConditionExpression: 'UnitOfAssessmentName = :uofaName',
        ExpressionAttributeValues: {
            ":uofaName": selectedUofA
        },
        FilterExpression: 'attribute_exists(ProfileType)' // filter to include only items with ProfileType
    };

    try {

        const data = await ddbDocClient.send(new QueryCommand(params));
        let items = data.Items;

        res.json(items);
    } catch (err) {
        // Error handling
        res.status(500).json({error: 'Could not load items: ' + err.message});
    }
});

//all data of a uoa endpoint
app.get("/items/UoA", async function(req, res) {
    // retrieve the selected UnitOfAssessmentName from query parameters
    const selectedUofA = req.query.uofaName || "Computer Science and Informatics";

    var params = {
        TableName: tableName,
        IndexName: 'UnitOfAssessmentName-UniversityName-index',
        KeyConditionExpression: 'UnitOfAssessmentName = :uofaName',
        ExpressionAttributeValues: {
            ":uofaName": selectedUofA
        },
    };

    try {
        const data = await ddbDocClient.send(new QueryCommand(params));
        let items = data.Items;

        res.json(items);
    } catch (err) {
        res.status(500).json({error: 'Could not load items: ' + err.message});
    }
});
//Top 3 items endpoint
app.get("/items/top3", async function(req, res) {
    // retrieve the selected UnitOfAssessmentName from query parameters
    const selectedUofA = req.query.uofaName || "Computer Science and Informatics";

    var params = {
        TableName: tableName,
        IndexName: 'UnitOfAssessmentName-UniversityName-index',
        KeyConditionExpression: 'UnitOfAssessmentName = :uofaName',
        FilterExpression: 'ProfileType = :profileTypeValue', // filter for ProfileType "Overall"
        ExpressionAttributeValues: {
            ":uofaName": selectedUofA,
            ":profileTypeValue": "Overall" // value for ProfileType filter
        }
    };

    try {
        const data = await ddbDocClient.send(new QueryCommand(params));
        let items = data.Items;

        // sort the items by AverageScore in descending order
        const sortedItems = items.sort((a, b) => b.AverageScore - a.AverageScore);

        // get top 3 items
        const top3Items = sortedItems.slice(0, 3);

        res.json(top3Items);
    } catch (err) {
        // Error handling
        res.status(500).json({error: 'Could not load items: ' + err.message});
    }
});



//Bottom 3 items endpoint
app.get("/items/bottom3", async function(req, res) {
    const selectedUofA = req.query.uofaName || "Computer Science and Informatics";

    var params = {
        TableName: tableName,
        IndexName: 'UnitOfAssessmentName-UniversityName-index',
        KeyConditionExpression: 'UnitOfAssessmentName = :uofaName',
        FilterExpression: 'ProfileType = :profileTypeValue', // filter for ProfileType "Overall"
        ExpressionAttributeValues: {
            ":uofaName": selectedUofA,
            ":profileTypeValue": "Overall" // value for ProfileType filter
        }
    };

    try {
        const data = await ddbDocClient.send(new QueryCommand(params));
        let items = data.Items;

        // sort the items by AverageScore in ascending order
        const sortedItems = items.sort((a, b) => b.AverageScore - a.AverageScore);

        // get bottom 3 items
        const bottom3Items = sortedItems.slice(-3);

        res.json(bottom3Items);
    } catch (err) {
        res.status(500).json({error: 'Could not load items: ' + err.message});
    }
});

//Outputs endpoint
app.get("/items/outputs", async function(req, res) {
    const selectedUofA = req.query.uofaName || "Computer Science and Informatics";

    var params = {
        TableName: tableName,
        IndexName: 'ProfileType-index',
        KeyConditionExpression: 'ProfileType = :profileTypeValue',
        FilterExpression: 'UnitOfAssessmentName = :uofaName', // filter for uoa
        ExpressionAttributeValues: {
            ":uofaName": selectedUofA,
            ":profileTypeValue": "Outputs" // value for ProfileType filter
        }
    };

    try {

        const data = await ddbDocClient.send(new QueryCommand(params));
        let items = data.Items;

        res.json(items);
    } catch (err) {
        res.status(500).json({error: 'Could not load items: ' + err.message});
    }
});


//overall endpoint
app.get("/items/overall", async function(req, res) {
    const unitOfAssessmentName = req.query.uOfA || "Computer Science and Informatics";

    var params = {
        TableName: tableName,
        IndexName: "ProfileType-index",
        KeyConditionExpression: "ProfileType = :profileTypeValue",
        FilterExpression: 'UnitOfAssessmentName = :uofaName', // filter for ProfileType "Outputs"
        ExpressionAttributeValues: {
            ":profileTypeValue": "Overall",
            ":uofaName": unitOfAssessmentName
        }
    };

    try {
        const data = await ddbDocClient.send(new QueryCommand(params));
        let items = data.Items;

        res.json(items);
    } catch (err) {
        res.status(500).json({error: 'Could not load items: ' + err.message});
    }
});

//Environment endpoint
app.get("/items/environment", async function(req, res) {
    // Extract UnitOfAssessmentName from query parameters
    const unitOfAssessmentName = req.query.uofaName || "Computer Science and Informatics";

    var params = {
        TableName: tableName,
        IndexName: "ProfileType-index",
        KeyConditionExpression: "ProfileType = :profileTypeValue",
        FilterExpression: "UnitOfAssessmentName = :uoaName",
        ExpressionAttributeValues: {
            ":profileTypeValue": "Environment",
            ":uoaName": unitOfAssessmentName // Use the provided UnitOfAssessmentName for filtering
        }
    };

    try {
        const data = await ddbDocClient.send(new QueryCommand(params));
        let items = data.Items;

        res.json(items);
    } catch (err) {
        res.status(500).json({error: 'Could not load items: ' + err.message});
    }
});


//total income endpoint
app.get("/items/total-income", async function(req, res) {
    const unitOfAssessmentName = req.query.unitOfAssessment || "Computer Science and Informatics";

    var params = {
        TableName: tableName,
        IndexName: "IncomeSource-index",
        KeyConditionExpression: "IncomeSource = :incomeSource", // filter for IncomeSource
        FilterExpression: 'UnitOfAssessmentName = :uofaName', // filter for UnitOfAssessmentName
        ExpressionAttributeValues: {
            ":incomeSource": "Total income",
            ":uofaName": unitOfAssessmentName
        }
    };

    let items = [];
    try {
        let data;
        do {
            data = await ddbDocClient.send(new QueryCommand(params));
            items = items.concat(data.Items);
            params.ExclusiveStartKey = data.LastEvaluatedKey;
        } while (data.LastEvaluatedKey);

        // filter by uoa after retrieving income items
        const filteredItems = items.filter(item => item.UnitOfAssessmentName === unitOfAssessmentName);

        res.json(filteredItems);
    } catch (err) {
        res.status(500).json({error: 'Could not load items: ' + err.message});
    }
});


//income endpoint
app.get("/items/income", async function(req, res) {
    const selectedUofA = req.query.uofaName || "Computer Science and Informatics"; // Default value
    var params = {
        TableName: tableName,
        IndexName: 'UnitOfAssessmentName-UniversityName-index',
        KeyConditionExpression: 'UnitOfAssessmentName = :uofaName',
        FilterExpression: 'attribute_not_exists(ProfileType)', // filter for items without ProfileType
        ExpressionAttributeValues: {
            ":uofaName": selectedUofA
        }
    };
    try {
        // Specify the list of profile types to exclude

        const data = await ddbDocClient.send(new QueryCommand(params));
        let items = data.Items;


        res.json(items);
    } catch (err) {
        // Error handling
        res.status(500).json({ error: 'Could not load items: ' + err.message });
    }
});

//Random3 endpoint
app.get("/items/random3", async function(req, res) {
    const selectedUofA = req.query.uofaName || "Computer Science and Informatics"; // default value if not provided

    var params = {
        TableName: tableName,
        IndexName: 'UnitOfAssessmentName-UniversityName-index',
        KeyConditionExpression: 'UnitOfAssessmentName = :uofaName',
        FilterExpression: "ProfileType = :profileTypeValue",
        ExpressionAttributeValues: {
            ":uofaName": selectedUofA,
            ":profileTypeValue": "Overall"
        }
    };

    try {
        const data = await ddbDocClient.send(new QueryCommand(params));
        let items = data.Items;

        const shuffled = items.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, 3);

        res.json(selected);
    } catch (err) {
        res.status(500).json({error: 'Could not load items: ' + err.message});
    }
});

//autocomplete endpoint
app.get("/items/uniNames", async function(req, res) {

    var params = {
        TableName: tableName,
        IndexName: 'ProfileType-index',
        KeyConditionExpression: "ProfileType = :profileTypeVal",
        ExpressionAttributeValues: {
            ":profileTypeVal": "Overall",
        },
        ProjectionExpression: "UniversityName"
    };

    try {
        const data = await ddbDocClient.send(new QueryCommand(params));

        // extract just the university names and ensure they are unique
        const uniqueNames = [...new Set(data.Items.map(item => item.UniversityName))];

        res.json(uniqueNames);
    } catch (err) {
        res.status(500).json({error: 'Could not fetch university names: ' + err.message});
    }
});

app.get("/items/uoaUniNames", async function(req, res) {
    const selectedUofA = req.query.uofaName || "Computer Science and Informatics"; // Default value if not provided

    var params = {
        TableName: tableName,
        IndexName: 'ProfileType-index',
        KeyConditionExpression: "ProfileType = :profileTypeVal",
        ExpressionAttributeValues: {
            ":profileTypeVal": "Overall",
            ":uofaName": selectedUofA,

        },
        FilterExpression: 'UnitOfAssessmentName = :uofaName',
    };

    try {
        const data = await ddbDocClient.send(new QueryCommand(params));

        // extract uni names and ensure they are unique
        const uniqueNames = [...new Set(data.Items.map(item => item.UniversityName))];

        res.json(uniqueNames);
    } catch (err) {
        res.status(500).json({error: 'Could not fetch university names: ' + err.message});
    }
});
//Uni data
app.get("/items/university", async function(req, res) {
    const universityName = req.query.UniversityName;

    var params = {
        TableName: tableName,
        IndexName: 'ProfileType-index',
        KeyConditionExpression: "ProfileType = :profileTypeVal",
        ExpressionAttributeValues: {
            ":profileTypeVal": "Overall",
        }
    };

    // Add a filter expression if name not nation
    if (universityName !== "Nation") {
        params.FilterExpression = "UniversityName = :universityName";
        params.ExpressionAttributeValues[":universityName"] = universityName;
    }

    try {
        const data = await ddbDocClient.send(new QueryCommand(params));

        // extracting unique names
        const uniqueUnitOfAssessmentNames = [...new Set(data.Items.map(item => item.UnitOfAssessmentName))].sort();

        res.json(uniqueUnitOfAssessmentNames);
    } catch (err) {
        res.status(500).json({error: 'Could not fetch unit of assessment names: ' + err.message});
    }
});





//SearchInst endpoint
app.get("/items/search", async function(req, res) {
    const searchTerm = req.query.query;
    const unitOfAssessment = req.query.unitOfAssessment || "Computer Science and Informatics";

    var params = {
        TableName: tableName,
        IndexName: 'UnitOfAssessmentName-UniversityName-index',
        KeyConditionExpression: 'UniversityName = :searchTerm AND UnitOfAssessmentName = :unitOfAssessment',
        ExpressionAttributeValues: {
            ":searchTerm": searchTerm,
            ":unitOfAssessment": unitOfAssessment
        }
    };

    try {
        const data = await ddbDocClient.send(new QueryCommand(params));
        res.json(data.Items);
    } catch (err) {
        res.status(500).json({error: 'Could not search items: ' + err.message});
    }
});


//UofA endpoint
app.get("/items/unitofassessment", async function(req, res) {
    // get the selected UnitOfAssessmentName from query parameters
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
        //  fetch items from DynamoDB using the GSI
        const data = await ddbDocClient.send(new QueryCommand(params));
        res.json(data.Items);
    } catch (err) {
        // Error handling
        res.status(500).json({error: 'Could not query items: ' + err.message});
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
