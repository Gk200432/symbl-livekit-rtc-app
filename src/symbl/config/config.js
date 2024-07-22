const config = {
    appId: '354a5731745a504b72306a37317353327335793265306d54433043396351594e',
    appSecret: '6865546239725448545a37495a794a4557735f305166654a6a4d3269664152713263394c34785452674a4e58516e4842356b726f4f7358335842454d4f653038',
    generateTokenEndpoint: 'https://api.symbl.ai/oauth2/token:generate',
    wssBasePath: 'wss://api.symbl.ai',
    apiBasePath: 'https://api.symbl.ai',
    bufferSize: 8192,
    retryCount: 3,
    insightTypes: ["action_item", "question", "follow_up"],
    confidenceThreshold: 0.5,
    timezoneOffset: 480,
    languageCode: 'en-US',
    realtimeSentimentAnalysis: true,
    realtimeAnalyticsMetric: true,
    customVocabulary: ["Symbl", "Symbl.ai"],
    trackers: [
        {
            name: "Promotion Mention",
            vocabulary: [
                "We have a special promotion going on if you book this before",
                "I can offer you a discount of 10 20 percent you being a new customer for us",
                "We have our month special",
                "We have a sale right now"
            ]
        },
        {
            name: "Trackers Demo",
            vocabulary: [
                "Trackers is a great feature",
                "Imagine a way to customize what is being tracked for your own business",
                "Trackers allow you to look for a particular mention"
            ]
        },
    ],
}

module.exports = config;
