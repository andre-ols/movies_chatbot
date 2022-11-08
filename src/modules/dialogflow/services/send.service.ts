import Dialogflow, { SessionsClient } from '@google-cloud/dialogflow';
import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const KEY_FILE = 'keys.json';

export class SendDialogflowService {
  private sessionClient: SessionsClient;
  private sessionPath: string;

  constructor(
    private readonly projectId: string,
    private readonly sessionId: string,
    private readonly languageCode: string,
  ) {
    this.sessionClient = new Dialogflow.SessionsClient({
      keyFilename: resolve(KEY_FILE),
    });
    this.sessionPath = this.sessionClient.projectAgentSessionPath(this.projectId, this.sessionId);
  }

  async detectIntent(query: string): Promise<google.cloud.dialogflow.v2.IDetectIntentResponse> {
    // The text query request.
    const request: google.cloud.dialogflow.v2.IDetectIntentRequest = {
      session: this.sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: this.languageCode,
        },
      },
    };

    const [response] = await this.sessionClient.detectIntent(request);
    return response;
  }

  async detectIntentAudio(
    filename: string,
    encoding: google.cloud.dialogflow.v2.AudioEncoding,
    sampleRateHertz: number,
  ): Promise<google.cloud.dialogflow.v2.IDetectIntentResponse> {
    // The path to
    const filePath = resolve(filename);

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const request: google.cloud.dialogflow.v2.IDetectIntentRequest = {
      session: this.sessionPath,
      queryInput: {
        audioConfig: {
          audioEncoding: encoding,
          sampleRateHertz: sampleRateHertz,
          languageCode: this.languageCode,
        },
      },
      inputAudio: readFileSync(filePath),
    };

    // Detects speech in the audio file
    const [response] = await this.sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = response.queryResult;
    // Print the result if the query was fulfilled.
    if (result.fulfillmentText) {
      console.log(`  Fulfillment Text: ${result.fulfillmentText}`);
    }

    return response;
  }
}
