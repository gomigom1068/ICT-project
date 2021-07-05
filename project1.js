/*
 * Modification: only detectTextIntent() is used 
 *
 * Original Code: https://github.com/googleapis/nodejs-dialogflow/blob/master/samples/detect.js
 * Reference : https://cloud.google.com/dialogflow/es/docs/how/detect-intent-audio?hl=ko
 */

// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

function detectTextIntent(projectId, sessionId, queries, languageCode) {
    // [START dialogflow_detect_intent_text]

    /**
     * TODO(developer): UPDATE these variables before running the sample.
     */
    // projectId: ID of the GCP project where Dialogflow agent is deployed
    // const projectId = 'PROJECT_ID';
    // sessionId: String representing a random number or hashed user identifier
    // const sessionId = '123456';
    // queries: A set of sequential queries to be send to Dialogflow agent for Intent Detection
    // const queries = [
    //   'Reserve a meeting room in Toronto office, there will be 5 of us',
    //   'Next monday at 3pm for 1 hour, please', // Tell the bot when the meeting is taking place
    //   'B'  // Rooms are defined on the Dialogflow agent, default options are A, B, or C
    // ]
    // languageCode: Indicates the language Dialogflow agent should use to detect intents
    // const languageCode = 'en';

    // Imports the Dialogflow library
    const dialogflow = require('@google-cloud/dialogflow');

    // Instantiates a session client
    const sessionClient = new dialogflow.SessionsClient();

    async function detectIntent(
        projectId,
        sessionId,
        query,
        contexts,
        languageCode
    ) {
        // The path to identify the agent that owns the created intent.
        const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

        // The text query request.
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: query,
                    languageCode: languageCode,
                },
            },
        };

        if (contexts && contexts.length > 0) {
            request.queryParams = {
                contexts: contexts,
            };
        }

        const responses = await sessionClient.detectIntent(request);
        return responses[0];
    }

    async function executeQueries(projectId, sessionId, queries, languageCode) {
        // Keeping the context across queries let's us simulate an ongoing conversation with the bot
        let context;
        let intentResponse;
        for (const query of queries) {
            try {
                console.log(`Sending Query: ${query}`);
                intentResponse = await detectIntent(
                    projectId,
                    sessionId,
                    query,
                    context,
                    languageCode
                );
                console.log('Detected intent');
                console.log(
                    `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
                );
                // Use the context from this response for next queries
                context = intentResponse.queryResult.outputContexts;
            } catch (error) {
                console.log(error);
            }
        }
    }
    executeQueries(projectId, sessionId, queries, languageCode);
    // [END dialogflow_detect_intent_text]
}


const uuid = require('uuid');

detectTextIntent(
    'omelette-hrq9',
    uuid.v4(),
    ['안녕'],
    'ko-KR'
)