// const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";

// // const openRouterApiKey= process.env.OPENROUTER_API_KEY;

// const model = "deepseek/deepseek-chat";

// export const generateResponse = async (prompt) => {
//   const res = await fetch(openRouterUrl, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//     //   "HTTP-Referer": "", // Optional. Site URL for rankings on openrouter.ai.
//     //   "X-OpenRouter-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: model,
//       messages: [
//         {role: "system", content: "You must return valid raw JSON"},
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       temperature: 0.2
//     }),
//   });
  
//   if(!res.ok){
//     const err = await res.text();
//     console.log("openrouter error:", err);
//     throw new Error(`openRouter Error:, ${err}`)
//   }

//   const data = await res.json(); 
//   return data.choices[0].message.content;

// };
// console.log(response.choices[0].message.content);

//  ////////////////////////////////
// Gemini code
// const geminiApiKey = process.env.GEMINI_API_KEY;

// // const model = "gemini-3-flash-preview";
// const model = "gemini-2.5-flash";

// const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

// export const generateResponse = async (prompt) => {
//   console.log(process.env.GEMINI_API_KEY);
//   const res = await fetch(geminiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [
//             {
//               text: `You must return valid raw JSON.\n\n${prompt}`,
//             },
//           ],
//         },
//       ],
//       generationConfig: {
//         temperature: 0.2,
//       },
//     }),
//   });

//   if (!res.ok) {
//     const err = await res.text();
//     console.log("Gemini Error:", err);
//     throw new Error(`Gemini Error: ${err}`);
//   }

//   const data = await res.json();

//   return data.candidates[0].content.parts[0].text;
// };


// ///////////////////////////////////////
const Gemini_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent"

export const generateResponse = async (prompt) => {
    try {
        const response = await fetch(`${Gemini_URL}?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ],
            generationConfig: {
              temperature: 0.2,
               responseMimeType: "application/json"
            }
        })
    })
    if(!response){
        const arr= await response.text();
        throw new Error(err);
    }

    const data = await response.json()
    // return data.candidates?.[0]?.content?.parts?.[0]?.text;
    const text= data.candidates?.[0]?.content?.parts?.[0]?.text;
    if(!text){
        throw new Error("No Text returned from Gemini")
    }

    const cleanText = text
         .replace(/```json/g,"")
         .replace(/```/g,"")
         .trim();

    return JSON.parse(cleanText);     
}       
     catch (error) {
        console.log("Gemini Fetch Error:" , error.message);
        throw new Error("GEMINI API FETCH FAILED");
    }
}   