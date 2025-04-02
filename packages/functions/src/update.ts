import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient, KeyType } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const main = Util.handler(async (event) => {

    const data = JSON.parse(event.body || "{}")

    const params = {
        TableName: Resource.Notes.name,
        Key: {
            userId: "123",
            noteId: event?.pathParameters?.id
        },
        UpdateExpression: "SET content = :content, attachment = :attachment",
        ExpressionAttributeValues: {
            ":content": data.content || null,
            ":attachment": data.attachment || null
        }
    }

    await dynamoDb.send(new UpdateCommand(params))

    return JSON.stringify({ status: true })
})