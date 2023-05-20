import CharacterAI from 'node_characterai'
const characterAI = new CharacterAI()
let chat

const init = (async () => {
  await characterAI.authenticateAsGuest()
  const characterId = 'JKj-nupd2zpdyBzfQEx8M_lJ53bIb7QoK19RVS268oI' // Yui
  chat = await characterAI.createOrContinueChat(characterId)
})()

export const createCompletion2 = async (message) => {
  await init
  const response = await chat.sendAndAwaitResponse(message, true)
  return response.text
}
