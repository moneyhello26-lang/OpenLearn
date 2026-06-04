import { generateAIResponse, generateChatResponse, findUniversities, generateDescription, answerQuestion } from "@/lib/ai";

async function example1_simplePrompt() {
  const response = await generateAIResponse(
    "Расскажи о истории образования в Казахстане в 3 предложениях"
  );
  console.log(response);
}

async function example2_withTemperature() {
  const response = await generateAIResponse(
    "Придумай креативное название для онлайн платформы обучения",
    "gemini-1.5-flash",
    { temperature: 0.9 } 
  );
  console.log(response);
}

async function example3_universityRecommendations() {
  const recommendations = await findUniversities({
    gpa: 3.8,
    sat: 1480,
    ielts: 7.5,
    specialization: "Computer Science",
    countryPreference: "Canada"
  });
  console.log(recommendations);
}

async function example5_answerQuestion() {
  const answer = await answerQuestion(
    "Какие предметы нужны для изучения компьютерных наук?"
  );
  console.log(answer);
}

async function example6_chatWithHistory() {
  const messages = [
    {
      role: "user" as const,
      content: "Что такое машинное обучение?"
    },
    {
      role: "assistant" as const,
      content: "Машинное обучение — это раздел искусственного интеллекта, который позволяет компьютерам учиться на данных без явного программирования."
    },
    {
      role: "user" as const,
      content: "Приведи примеры его применения"
    }
  ];
  
  const response = await generateChatResponse(messages);
  console.log(response);
}

async function example9_withContext() {
  const bookContent = `
    "Война и мир" - роман Льва Толстого о войне 1812 года
    и влиянии исторических событий на жизнь людей.
    Главные персонажи: Пьер Безухов, Наташа Ростова, Андрей Болконский.
  `;
  
  const answer = await answerQuestion(
    "Кто такой Пьер Безухов?",
    bookContent
  );
  console.log(answer);
}

export {
  example1_simplePrompt,
  example2_withTemperature,
  example3_universityRecommendations,
  example5_answerQuestion,
  example6_chatWithHistory,
  example9_withContext,
};
