import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./ddbClient.js";

export const handler = async function(event) {
  console.log("request:", JSON.stringify(event, undefined, 2));

  try {
    // iterate sqs records
    for(const record of event.Records) {
        console.log('Record: %j', record);

        // get request body payload of sns
        const snsPublishedMessage = JSON.parse(record.body); 
        console.log('SNS Message: %j', snsPublishedMessage);

        // get request body payload of order data
        const orderRequest = JSON.parse(snsPublishedMessage.Message);
        console.log('Order Request: %j', orderRequest);

        // business logic and prepared inventoryItem
        if (orderRequest == null || orderRequest.type == null || orderRequest.type != 'SHIP_REQUIRED') {
            throw new Error(`order type should exist and should be SHIP_REQUIRED in orderRequest: "${orderRequest}"`);
        }

        // set PK of invetory table
        orderRequest.code = orderRequest.item;        

        // save order item into inventory dynamodb table with using dnamodb sdk package
        const dynamodbParams = {
            TableName: 'inventory',
            Item: marshall(orderRequest || {})
        };
        const createResult = await ddbClient.send(new PutItemCommand(dynamodbParams));
        console.log("Successfully create item into order table.",  createResult); 
    }
    
  } catch (e) {
    console.error(e);
  }
};