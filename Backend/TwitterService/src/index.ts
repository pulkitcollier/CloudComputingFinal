import * as AWS from "aws-sdk";
import * as Lambda from "aws-lambda";
import * as Request from 'request-promise';

export async function handler(event: any, context: Lambda.Context, callback: Lambda.Callback): Promise<void> {
    callback(null, event);
}
