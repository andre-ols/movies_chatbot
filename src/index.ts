import { intentMap } from './modules/dialogflow/intents';
import { SendDialogflowService } from './modules/dialogflow/services/send.service';

const sendDialogflowService = new SendDialogflowService('movies-qyyv', '123456', 'pt-BR');

const response = await sendDialogflowService.detectIntent('onde assitir?');

const intentName = response.queryResult.intent.displayName;

intentMap.get(intentName)(response);
