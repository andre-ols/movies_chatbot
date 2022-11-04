const intentMap = require('../bot/intentMap')
const dialogflow = require('./sendDialogflow')
const dialogflowFunctions = require('./functionsDialogflow')
const { ativeHumanAttendant } = require('../bot/controllers/humanAttendant')

// Função onde a mágica acontece
const handleDialogflow = async (request, event) => {
  const { from: session } = request
  let type = 'text'

  // Verifica se a intenção é normal ou evento
  if (event) type = event

  // Envia pro dialogflow
  const result = await dialogflow(request, type)

  // Se tiver erro no dialogflow
  if (result.error) {
    await ativeHumanAttendant(session)
    return {
      response: 'Tive um problema técnico aqui 😔\n' +
            'Aguarde um instante que irei chamar um *atendente humano* para você!'
    }
  }

  // Lidando com intenções que tem contexto
  if (result.haveContext) return { response: result.fulfillmentText }

  // Recupra os parametros e a session
  const dialogFunctions = { ...dialogflowFunctions(result), session }

  const intentName = result.intent.displayName
  const intentMapped = intentMap.get(intentName)

  const resultFromIntent = await intentMapped(dialogFunctions)
  return resultFromIntent
}

module.exports = handleDialogflow
