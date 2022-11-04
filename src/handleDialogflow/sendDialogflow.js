const dialogflow = require("dialogflow");
const projectId = "pitburguerz-xuheet";
const path = require('path');

module.exports = async function DialogFlow(objeto, type) {
  const sessionId = objeto.from;
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: path.resolve('keys.json')
  });
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  let query;

  if (type == "text"){
    query = {
      session: sessionPath,
      queryInput: {
        text: {
          text: objeto.body.replace(/\n/g, ' '),
          languageCode: "pt-br"
        }
      }
    };
}
else{
  query = {
    session: sessionPath,
    queryInput: {
      event: { 
        name: type,
        languageCode: "pt-br"
      }, 
    }
  };
}

  for(let cont = 0; cont < 5; cont ++){
    //Tenta acessar o Dialogflow
    try {
      let agent = await sessionClient.detectIntent(query);
      agent = agent[0].queryResult;
      //Se tem contexto ativo e não for fallback diz que tem contexto
      agent.outputContexts.length > 1 ? agent.haveContext = true : agent.haveContext = false;
      //Se conseguir para o loop
      return agent;
    } 
    catch (e) {
      console.log(e);
      //Se não der certo, no ultimo loop retorne o erro
      if(cont == 4)
      return { error: true }
    }
  }
}
