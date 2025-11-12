/**
 * AI Service Integration for Bank Management System
 * Handles OpenAI API communication and banking-specific AI responses
 */

class AIService {
    constructor() {
        this.apiKey = CONFIG.OPENAI.API_KEY;
        this.baseUrl = CONFIG.OPENAI.BASE_URL;
        this.model = CONFIG.OPENAI.MODEL;
        this.conversationHistory = [];
        this.maxHistory = CONFIG.AI_ASSISTANT.MAX_CONVERSATION_HISTORY;
        this.systemPrompt = CONFIG.AI_ASSISTANT.SYSTEM_PROMPT;
    }

    /**
     * Initialize AI service and validate API key
     */
    async initialize() {
        if (!this.apiKey || this.apiKey.trim() === '') {
            console.warn('OpenAI API key not configured. Using fallback responses.');
            return false;
        }
        
        try {
            // Test API key validity
            await this.testConnection();
            console.log('AI Service initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize AI Service:', error);
            return false;
        }
    }

    /**
     * Test OpenAI API connection
     */
    async testConnection() {
        const response = await fetch(`${this.baseUrl}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API test failed: ${response.status}`);
        }

        return true;
    }

    /**
     * Get AI response for user message
     */
    async getResponse(userMessage, context = {}) {
        // If no API key, use fallback
        if (!this.apiKey || this.apiKey.trim() === '') {
            return this.getFallbackResponse(userMessage);
        }

        try {
            // Build conversation context
            const messages = this.buildConversationContext(userMessage, context);
            
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    max_tokens: CONFIG.OPENAI.MAX_TOKENS,
                    temperature: CONFIG.OPENAI.TEMPERATURE,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            // Store conversation history
            this.addToHistory('user', userMessage);
            this.addToHistory('assistant', aiResponse);

            return aiResponse;
        } catch (error) {
            console.error('AI Service error:', error);
            return this.getFallbackResponse(userMessage);
        }
    }

    /**
     * Build conversation context with banking system data
     */
    buildConversationContext(userMessage, context) {
        const messages = [
            {
                role: 'system',
                content: this.systemPrompt
            }
        ];

        // Add banking context if available
        if (context.accountCount) {
            messages.push({
                role: 'system',
                content: `Current bank status: ${context.accountCount} accounts, total balance: ₹${context.totalBalance?.toLocaleString('en-IN')}`
            });
        }

        // Add recent conversation history
        this.conversationHistory.slice(-6).forEach(msg => {
            messages.push(msg);
        });

        // Add current user message
        messages.push({
            role: 'user',
            content: userMessage
        });

        return messages;
    }

    /**
     * Add message to conversation history
     */
    addToHistory(role, content) {
        this.conversationHistory.push({
            role: role,
            content: content
        });

        // Limit history size
        if (this.conversationHistory.length > this.maxHistory) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistory);
        }
    }

    /**
     * Fallback responses when AI is not available
     */
    getFallbackResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('create') && message.includes('account')) {
            return `To create a new bank account, you'll need:
            
📋 **Required Documents:**
• Valid government photo ID (Aadhaar, PAN, Passport)
• Address proof (utility bill, rental agreement)
• PAN card (mandatory)
• Recent passport-size photographs

💰 **Initial Deposit Requirements:**
• Savings Account: ₹${CONFIG.BANKING.MIN_DEPOSIT.toLocaleString('en-IN')} minimum
• Current Account: ₹5,000 minimum

📝 **Process:**
1. Visit the bank branch or apply online
2. Fill the account opening form
3. Submit documents for verification
4. Make initial deposit
5. Receive account number and checkbook

Would you like to know about specific account types?`;
        }
        
        if (message.includes('loan') && message.includes('document')) {
            return `**📋 Loan Application Documents:**

**Basic Requirements:**
• Identity Proof (Aadhaar, PAN, Passport)
• Address Proof (utility bills, rental agreement)
• Income Proof (salary slips, ITR, bank statements)
• Employment Proof (employment letter, business registration)

**💼 Personal Loans:**
• Last 3 months salary slips
• Bank statements (6 months)
• Form 16 or ITR for last 2 years

**🏠 Home Loans (Additional):**
• Property documents & NOC from builder
• Approved building plan
• Property valuation report

**💼 Business Loans (Additional):**
• Business registration certificates
• Financial statements & GST returns
• Current account statements

*Requirements may vary based on loan type and amount.*`;
        }
        
        if (message.includes('interest') && message.includes('rate')) {
            return `**📊 Current Interest Rates:**

**💰 Deposit Rates:**
• Savings Account: 3.5% - 4% per annum
• Fixed Deposit: 6% - 7.5% per annum
• Recurring Deposit: 6% - 7% per annum

**🏠 Loan Rates:**
• Home Loan: 8.5% - 11% per annum
• Personal Loan: 10.5% - 24% per annum
• Car Loan: 8.5% - 15% per annum
• Education Loan: 9% - 15% per annum

**📊 Rates vary based on:**
• Credit score and profile
• Loan amount and tenure
• Existing relationship with bank
• Market conditions

*Rates are subject to change. Contact us for current rates.*`;
        }

        if (message.includes('minimum') && message.includes('balance')) {
            return `**💰 Minimum Balance Requirements:**

**Savings Account:**
• Regular Savings: ₹${CONFIG.BANKING.MIN_DEPOSIT.toLocaleString('en-IN')}
• Premium Savings: ₹25,000
• Senior Citizen: ₹500
• Student Account: ₹250

**Current Account:**
• Regular Current: ₹5,000
• Business Current: ₹10,000

**⚠️ Non-maintenance Penalties:**
• ₹100-500 per month for savings accounts
• ₹500-1000 per month for current accounts

**💡 Balance Management Tips:**
• Set up auto-transfer from other accounts
• Use direct deposit for salary
• Monitor balance via mobile app
• Link accounts for auto-sweep

**📱 Balance Check Options:**
• Mobile banking app
• SMS banking & ATM inquiry
• Internet banking
• Missed call banking`;
        }

        // Default comprehensive response
        return `**🏦 Welcome to SecureBank AI Assistant!**

I'm here to help with all your banking needs:

**🔹 Account Services:**
• New account opening procedures
• Account types and features
• Interest rates and fees
• Minimum balance requirements

**🔹 Loan Services:**
• Personal, home, and business loans
• Documentation requirements
• Eligibility criteria and application process
• EMI calculations and approval guidelines

**🔹 General Banking:**
• Transaction procedures and limits
• Online banking features
• Card services and security
• Investment and savings options

**💡 Quick Tips:**
• Use the quick help buttons below
• Ask specific questions for detailed guidance
• I can help with banking regulations and procedures

*Note: For account-specific information, please contact our customer service or visit a branch.*

How can I assist you with your banking needs today?`;
    }

    /**
     * Get contextual response with banking system data
     */
    async getContextualResponse(userMessage) {
        const context = {
            accountCount: accounts?.length || 0,
            totalBalance: accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0,
            lowBalanceAccounts: accounts?.filter(acc => acc.balance < CONFIG.BANKING.LOW_BALANCE_THRESHOLD).length || 0
        };

        return await this.getResponse(userMessage, context);
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Update API key (for dynamic configuration)
     */
    updateApiKey(newApiKey) {
        this.apiKey = newApiKey;
        CONFIG.OPENAI.API_KEY = newApiKey;
    }

    /**
     * Get conversation history
     */
    getHistory() {
        return this.conversationHistory.slice();
    }
}

// Create global AI service instance
let aiService = null;

// Initialize AI service when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    aiService = new AIService();
    const initialized = await aiService.initialize();
    
    if (!initialized) {
        console.warn('AI Service running in fallback mode');
        // showMessage is defined in script.js; guard in case scripts load in a different order
        if (typeof showMessage === 'function') {
            showMessage('AI Assistant running in offline mode', 'warning');
        } else {
            console.warn('showMessage function not available yet; skipping UI warning');
        }
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIService;
} else {
    window.AIService = AIService;
}