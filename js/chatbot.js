// Get the chat form and message list
const chatForm = document.getElementById('chatForm');
const messageList = document.getElementById('messageList');

const dataset = [
    {
        "Question": "What are the benefits of solar energy?",
        "Answer": "Solar energy has numerous benefits, including being renewable, environmentally friendly, cost-saving, promoting energy independence, creating jobs, requiring low maintenance, and offering incentives and tax credits."
    },
    {
        "Question": "How does solar energy work?",
        "Answer": "Solar energy works by converting sunlight into electricity through photovoltaic cells. These cells capture sunlight and generate an electric current, which is then converted from DC to AC using an inverter for practical use."
    },
    {
        "Question": "What is the cost of installing solar panels?",
        "Answer": "The cost of installing solar panels varies based on factors such as system size, location, equipment quality, and installation complexity. It's recommended to obtain quotes from multiple installers for accurate cost estimation."
    },
    {
        "Question": "How can solar energy help reduce my electricity bills?",
        "Answer": "Solar energy can reduce electricity bills by generating free electricity. Excess energy can be fed back into the grid, earning credits or compensation through net metering, thus offsetting grid consumption."
    },
    {
        "Question": "Are there any government incentives or tax credits available for solar installations?",
        "Answer": "Yes, government incentives and tax credits are often available to encourage solar adoption. Examples include investment tax credits (ITC), rebates, grants, and solar renewable energy certificates (SRECs)."
    },
    {
        "Question": "What is the lifespan of solar panels?",
        "Answer": "Solar panels typically have a lifespan of 25 to 30 years or more, depending on quality, manufacturing, and maintenance. Choosing reputable manufacturers and installers is important for long-term performance."
    },
    {
        "Question": "Can solar panels be installed on any type of roof?",
        "Answer": "Solar panels can be installed on various roof types, including asphalt shingle, metal, tile, and flat roofs. The installation approach may vary based on the roof's material and structure."
    },
    {
        "Question": "How much energy can solar panels generate?",
        "Answer": "The energy generation of solar panels depends on factors such as panel wattage, size, efficiency, geographic location, orientation, and shading. On average, a well-designed system can generate 250 to 400 kWh per year per installed kW."
    },
    {
        "Question": "How can I determine if my home is suitable for solar panels?",
        "Answer": "To determine suitability, consider factors like roof orientation, condition, available space, geographic location, and local regulations. Consult with a solar installer or conduct a site assessment for a more accurate evaluation."
    },
    {
        "Question": "What maintenance is required for solar panels?",
        "Answer": "Solar panels require minimal maintenance. Periodic cleaning, inspections for damage or shading issues, and ensuring proper connections are important. Manufacturer's guidelines and professional advice should be followed."
    },
    {
        "Question": "Can solar panels work during cloudy or rainy days?",
        "Answer": "Solar panels can still generate electricity during cloudy or rainy days, although their output will be reduced compared to sunny conditions. They can still capture diffuse sunlight, but prolonged cloud cover may decrease production."
    },
    {
        "Question": "How long does it take to recover the cost of installing solar panels?",
        "Answer": "The time to recover the cost of solar panels (payback period) varies based on factors like installation cost, electricity savings, incentives, and local rates. On average, payback periods range from 5 to 15 years."
    },
    {
        "Question": "What financing options are available for solar installations?",
        "Answer": "Financing options include cash purchase, solar loans, solar leases, power purchase agreements (PPAs), and property assessed clean energy (PACE) financing."
    },
    {
        "Question": "Are there any environmental benefits of using solar energy?",
        "Answer": "Yes, solar energy offers environmental benefits by reducing greenhouse gas emissions, decreasing reliance on fossil fuels, and promoting clean and sustainable energy production."
    },
    {
        "Question": "Can solar panels be used for heating water?",
        "Answer": "Yes, solar panels can be used for heating water through solar water heating systems, which capture the sun's heat to warm water for domestic or commercial use."
    },
    {
        "Question": "Can solar panels be integrated with battery storage systems?",
        "Answer": "Yes"
    }
]

const questions = dataset.map(e => e.Question);



function calculateSimilarity(str1, str2) {

    //
    // Preprocess strings and combine words to a unique collection
    //

    const str1Words = str1.trim().split(' ').map(omitPunctuations).map(toLowercase);
    const str2Words = str2.trim().split(' ').map(omitPunctuations).map(toLowercase);
    const allWordsUnique = Array.from(new Set(str1Words.concat(str2Words)));



    //
    // Calculate IF-IDF algorithm vectors
    //

    const str1Vector = calcTfIdfVectorForDoc(str1Words, [str2Words], allWordsUnique);
    const str2Vector = calcTfIdfVectorForDoc(str2Words, [str1Words], allWordsUnique);


    //
    // Main
    //
    let result = cosineSimilarity(str1Vector, str2Vector);

    console.log('Cosine similarity', result);

    return result;
}


//
// Main function
//

function cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.map((val, i) => val * vec2[i]).reduce((accum, curr) => accum + curr, 0);
    const vec1Size = calcVectorSize(vec1);
    const vec2Size = calcVectorSize(vec2);

    return dotProduct / (vec1Size * vec2Size);
};

//
// tf-idf algorithm implementation (https://en.wikipedia.org/wiki/Tf%E2%80%93idf)
//

function calcTfIdfVectorForDoc(doc, otherDocs, allWordsSet) {
    return Array.from(allWordsSet).map(word => {
        return tf(word, doc) * idf(word, doc, otherDocs);
    });
};

function tf(word, doc) {
    const wordOccurences = doc.filter(w => w === word).length;
    return wordOccurences / doc.length;
};

function idf(word, doc, otherDocs) {
    const docsContainingWord = [doc].concat(otherDocs).filter(doc => {
        return !!doc.find(w => w === word);
    });

    return (1 + otherDocs.length) / docsContainingWord.length;
};



//
// Helper functions
//

function omitPunctuations(word) {
    return word.replace(/[\!\.\,\?\-\?]/gi, '');
};

function toLowercase(word) {
    return word.toLowerCase();
};

function calcVectorSize(vec) {
    return Math.sqrt(vec.reduce((accum, curr) => accum + Math.pow(curr, 2), 0));
};
// Handle form submission
chatForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get the user's input message
    const userInput = document.getElementById('messageInput').value;

    // Create a new list item for the user's message
    const userMessageItem = document.createElement('li');
    userMessageItem.className = 'list-group-item';
    userMessageItem.textContent = userInput;

    // Append the user's message to the message list
    messageList.appendChild(userMessageItem);

    const smilarities = questions.map(e => calculateSimilarity(userInput, e));
    console.log(smilarities);
    console.log(Math.max(...smilarities))
    const highestIndex = smilarities.indexOf(Math.max(...smilarities));
    console.log(highestIndex)
    const chatbotResponse = dataset[highestIndex].Answer;


    const chatbotReplyItem = document.createElement('li');
    chatbotReplyItem.className = 'list-group-item';
    chatbotReplyItem.textContent = chatbotResponse;

    // Append the chatbot's reply to the message list
    messageList.appendChild(chatbotReplyItem);

    // Clear the input field
    document.getElementById('messageInput').value = '';

});
