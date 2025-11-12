// Configuration file for Bank Management System
// IMPORTANT: Never commit this file with real API keys to version control

const CONFIG = {
    // OpenAI API Configuration
    OPENAI: {
        API_KEY: '', // Add your OpenAI API key here
        BASE_URL: 'https://api.openai.com/v1',
        MODEL: 'gpt-3.5-turbo',
        MAX_TOKENS: 500,
        TEMPERATURE: 0.7
    },
    
    // Banking System Configuration
    BANKING: {
        MIN_DEPOSIT: 1000,
        MIN_AGE: 18,
        LOW_BALANCE_THRESHOLD: 1000,
        ACCOUNT_NUMBER_START: 10001,
        MAX_DAILY_TRANSACTIONS: 10,
        MAX_TRANSACTION_AMOUNT: 100000
    },
    
    // AI Assistant Configuration
    AI_ASSISTANT: {
        SYSTEM_PROMPT: `You are a professional banking assistant for SecureBank. You help customers with:
        - Account opening procedures and requirements
        - Loan applications and documentation
        - Banking services and interest rates
        - General banking guidance and best practices
        
        Always be helpful, professional, and accurate. Provide specific information about Indian banking regulations when relevant.
        Keep responses concise but comprehensive. Use proper formatting with bullet points and sections when helpful.`,
        
        CONTEXT_AWARENESS: true,
        MAX_CONVERSATION_HISTORY: 10
    },
    
    // Security Settings
    SECURITY: {
        SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
        MAX_LOGIN_ATTEMPTS: 3,
        LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}