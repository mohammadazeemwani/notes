import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
    
    const params = {
        TableName: Resource.Notes.name,

        // 'Key here describes the partition key and the sort key of the item to be retrieved'
        Key: {
            userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
            noteId: event?.pathParameters?.id
        }
    }

    const result = await dynamoDb.send(new GetCommand(params));
    if (!result.Item) {
        throw new Error("Item not found.")
    }

    // return the retrieved item at last
    return JSON.stringify(result.Item)
})


async function getAllItems(tableName: string) {
    const params = {
      TableName: tableName,
    } as any;
  
    try {
      const results = [];
      let lastEvaluatedKey;
  
      do {
        if (lastEvaluatedKey) {
          params.ExclusiveStartKey = lastEvaluatedKey;
        }
  
        const command = new ScanCommand(params);
        const result = await dynamoDb.send(command);
  
        results.push(...result.Items as any);
  
        lastEvaluatedKey = result.LastEvaluatedKey;
      } while (lastEvaluatedKey);
  
      return results;
    } catch (error) {
      console.error("Error scanning table:", error);
      return null;
    }
  }