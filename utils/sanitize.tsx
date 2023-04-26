const sanitizeResponses = (response: string) => {
  let output = response

  const aiGiveaways = [
    "AI LANGUAGE MODEL",
    "OPENAI",
    "CHATBOT",
    "CHATGPT"
  ]

  for (let key of aiGiveaways) {
    if (response.toUpperCase().includes(key)) {
      output = "I'm sorry my dear, I'm not sure what to tell you... Could you rephrase your question?"
      break;
    }
  }

  return output
}

export default sanitizeResponses
