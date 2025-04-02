import { Context, APIGatewayProxyEvent } from 'aws-lambda'

export namespace Util {
    export function handler(
        lambda: (evt: APIGatewayProxyEvent, context: Context) => Promise<string>
    ) {
        return async function(event: APIGatewayProxyEvent, context: Context) {
            let body: string, statusCode: number;

            try {
                // Running the lambda here...
                body = await lambda(event, context)
                statusCode = 200;
            } catch(err) {
                statusCode = 500
                body = JSON.stringify({
                    error: err instanceof Error ? err.message : String(err)
                })
            }

            // Return http response
            return {
                body, 
                statusCode
            }
        }
    }
}