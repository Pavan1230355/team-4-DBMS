# 🏦 Bank Management System

A comprehensive web-based Bank Management System built with HTML, CSS, and JavaScript. This system provides a complete solution for managing bank accounts, transactions, customer data, and includes an AI assistant for customer support.

## ✨ Features

### 🔐 Authentication & Security
- Secure admin login system
- Password protection for sensitive operations
- Session management

### 👥 Account Management
- **Create Account**: Add new customer accounts with complete details
  - Customer name, age, gender
  - Account type (Savings/Current)
  - Initial deposit with validation
  - Auto-generated account numbers
  - Phone number storage

- **View Account**: Display comprehensive account information
  - Personal details and account information
  - Current balance highlighting
  - Account creation date

- **Update Account**: Modify customer information
  - Update personal details
  - Cannot modify account type or balance through this feature

- **Delete Account**: Secure account closure
  - Warning systems for accounts with balance
  - Complete data removal including transaction history

### 💰 Transaction Management
- **Deposit Money**: Add funds to accounts
  - Amount validation
  - Transaction descriptions
  - Real-time balance updates

- **Withdraw Money**: Secure withdrawal system
  - Insufficient balance checks
  - Amount validation
  - Transaction logging

- **Check Balance**: Quick balance inquiries
  - Beautiful balance display cards
  - Account holder information

- **Transaction History**: Comprehensive transaction logs
  - Chronological transaction display
  - Deposit/withdrawal categorization
  - Balance after each transaction
  - Transaction descriptions and timestamps

### 🔍 Search Functionality
- **Search by Account Number**: Direct account lookup
- **Search by Customer Name**: Partial name matching
- **Beautiful result displays** with complete account information

### 📊 Reports & Analytics
- **All Accounts Report**: Complete account listing with low-balance highlighting
- **Bank Summary**: Comprehensive statistics including:
  - Total accounts and balances
  - Account type distribution
  - Average balance calculations
  - Daily transaction counts

- **Low Balance Accounts**: Risk management reporting
  - Accounts below ₹1000 threshold
  - Action recommendations
  - Critical balance warnings

### 🤖 AI Assistant
- **Interactive customer support** with pre-programmed responses
- **Quick help topics** for common banking questions
- **Comprehensive guidance** for:
  - Account creation procedures
  - Loan application requirements
  - Interest rates and fees
  - Banking best practices
  - Document requirements
  - Minimum balance guidance

### 📱 User Interface
- **Modern, responsive design** that works on all devices
- **Intuitive navigation** with clear visual hierarchy
- **Real-time dashboard** with key statistics
- **Professional styling** with gradient backgrounds
- **Interactive elements** with smooth animations
- **Success/error messaging** system
- **Tabbed interfaces** for organized functionality

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server installation required - runs entirely in the browser

### Installation
1. Download all files to a folder on your computer
2. Open `index.html` in your web browser
3. You're ready to start using the system!

# 🏦 Bank Management System

A comprehensive web-based Bank Management System built with HTML, CSS, and JavaScript. This system provides a complete solution for managing bank accounts, transactions, customer data, and includes an AI assistant for customer support with full user registration and authentication.

## ✨ Features

### 🔐 User Authentication & Security
- **User Registration**: Complete signup process with validation
- **Secure Login System**: Email-based authentication
- **Password Security**: Strong password requirements and validation
- **Session Management**: Remember me functionality and auto-login
- **Password Reset**: Forgot password functionality (UI ready)
- **User Profiles**: Role-based access control
- **Secure Storage**: Client-side encryption for demo purposes

### 👥 Account Management
- **Create Account**: Add new customer accounts with complete details
  - Customer name, age, gender
  - Account type (Savings/Current)
  - Initial deposit with validation
  - Auto-generated account numbers
  - Phone number storage

- **View Account**: Display comprehensive account information
  - Personal details and account information
  - Current balance highlighting
  - Account creation date

- **Update Account**: Modify customer information
  - Update personal details
  - Cannot modify account type or balance through this feature

- **Delete Account**: Secure account closure
  - Warning systems for accounts with balance
  - Complete data removal including transaction history

### 💰 Transaction Management
- **Deposit Money**: Add funds to accounts
  - Amount validation
  - Transaction descriptions
  - Real-time balance updates

- **Withdraw Money**: Secure withdrawal system
  - Insufficient balance checks
  - Amount validation
  - Transaction logging

- **Check Balance**: Quick balance inquiries
  - Beautiful balance display cards
  - Account holder information

- **Transaction History**: Comprehensive transaction logs
  - Chronological transaction display
  - Deposit/withdrawal categorization
  - Balance after each transaction
  - Transaction descriptions and timestamps

### 🔍 Search Functionality
- **Search by Account Number**: Direct account lookup
- **Search by Customer Name**: Partial name matching
- **Beautiful result displays** with complete account information

### 📊 Reports & Analytics
- **All Accounts Report**: Complete account listing with low-balance highlighting
- **Bank Summary**: Comprehensive statistics including:
  - Total accounts and balances
  - Account type distribution
  - Average balance calculations
  - Daily transaction counts

- **Low Balance Accounts**: Risk management reporting
  - Accounts below ₹1000 threshold
  - Action recommendations
  - Critical balance warnings

### 🤖 AI Assistant
- **Interactive customer support** with OpenAI integration
- **Enhanced AI Mode**: Real-time intelligent responses with API key
- **Fallback Mode**: Pre-programmed comprehensive responses
- **Quick help topics** for common banking questions
- **Comprehensive guidance** for:
  - Account creation procedures
  - Loan application requirements
  - Interest rates and fees
  - Banking best practices
  - Document requirements
  - Minimum balance guidance
- **Context-aware responses**: AI knows your bank's data
- **Conversation memory**: Maintains chat history

### 📱 User Interface
- **Modern, responsive design** that works on all devices
- **Intuitive navigation** with user profile dropdown
- **Real-time dashboard** with key statistics
- **Professional styling** with gradient backgrounds
- **Interactive elements** with smooth animations
- **Success/error messaging** system
- **Tabbed interfaces** for organized functionality
- **Mobile-optimized** authentication pages

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server installation required - runs entirely in the browser
- Optional: OpenAI API key for enhanced AI responses

### Installation
1. Download all files to a folder on your computer
2. Open `index.html` in your web browser
3. You're ready to start using the system!

### First Time Setup
1. **Create Your Account**:
   - Click "Create Account" on the login page
   - Fill in all required information
   - Use a strong password (8+ characters, mixed case, numbers, special characters)
   - Accept terms and conditions
   - Click "Create Account"

2. **Sign In**:
   - Use your email and password
   - Check "Remember me" for convenience
   - Access the full banking system

3. **Default Admin Account** (for first-time users):
   - Email: `admin@securebank.com`
   - Password: `SecureBank@2024`
   - This account is created automatically for system administration

## 📁 File Structure
```
Bank Management System/
├── index.html          # Main application file with all pages
├── styles.css          # Complete styling and responsive design
├── script.js           # All functionality and business logic
├── config.js           # Configuration settings
├── ai-service.js       # AI integration service
├── .env               # Environment variables template
├── .gitignore         # Security file exclusions
├── README.md          # This documentation file
└── SETUP.md           # Quick setup guide
```

## 💻 Usage Guide

### User Registration
1. Open `index.html` in your browser
2. Click "Create Account" on the login page
3. Fill in all required fields:
   - First and Last Name
   - Email address (will be your username)
   - Phone number
   - Strong password (8+ characters, mixed case, numbers, special chars)
   - Confirm password
4. Accept terms and conditions
5. Click "Create Account"
6. Sign in with your new credentials

### Signing In
1. Enter your email address
2. Enter your password
3. Optionally check "Remember me" for auto-login
4. Click "Sign In"

### Creating Your First Account
1. Navigate to **Accounts** → **Create Account**
2. Fill in all required fields:
   - Name (required)
   - Age (minimum 18 years)
   - Gender selection
   - Account type (Savings/Current)
   - Initial deposit (minimum ₹1000)
   - Phone number (optional)
3. Click "Create Account"
4. Note the auto-generated account number

### Making Transactions
1. Go to **Transactions**
2. Choose your transaction type:
   - **Deposit**: Add money to an account
   - **Withdraw**: Remove money (with balance validation)
   - **Check Balance**: View current balance
   - **Transaction History**: See all account transactions

### Using the Enhanced AI Assistant
1. Navigate to **AI Assistant**
2. **For Basic Mode**: Just start asking questions
3. **For Enhanced Mode**:
   - Click "Configure AI"
   - Enter your OpenAI API key
   - Click "Save"
   - Enjoy intelligent, context-aware responses
4. Use quick help topics or type custom questions

### Generating Reports
1. Visit the **Reports** section
2. Choose from:
   - **All Accounts**: Complete account listing
   - **Bank Summary**: Statistical overview
   - **Low Balance Accounts**: Risk management report

## 🎨 Features Highlight

### 🔐 Advanced Authentication
- **Secure Registration**: Email validation, strong passwords
- **Session Management**: Remember me, auto-login, secure logout
- **User Profiles**: Name display, role-based access
- **Password Security**: Hashed storage, strength validation

### 🏠 Home Dashboard
- Quick access to all major features
- Real-time statistics display
- Beautiful feature cards with icons
- Responsive grid layout
- Personalized user greeting

### 📊 Professional Reporting
- Comprehensive data analysis
- Visual balance indicators
- Low balance warnings
- Statistical summaries

### 🛡️ Security Features
- Secure user registration and login
- Password hashing and validation
- Session management
- Data validation
- Confirmation dialogs for critical operations

### 📱 Mobile-First Design
- Fully responsive layout
- Touch-friendly interfaces
- Optimized for all screen sizes
- Professional mobile experience
- Mobile-optimized authentication

## 🎯 Business Rules

### User Registration
- Email must be unique and valid
- Password must meet security requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- Terms of service acceptance required

### Account Creation
- Minimum age: 18 years
- Minimum initial deposit: ₹1000
- Account numbers auto-generated starting from 10001
- All personal information required except phone number

### Transactions
- Deposit: Minimum ₹1, no maximum limit
- Withdrawal: Cannot exceed current balance
- All transactions logged with timestamps
- Balance updated in real-time

### Reports
- Low balance threshold: ₹1000
- Transaction history sorted by date (newest first)
- All monetary values displayed in Indian Rupee format

## 🔧 Customization

### Adding New Features
The modular design makes it easy to add new features:
- Add new page sections in `index.html`
- Create corresponding CSS styles in `styles.css`
- Implement functionality in `script.js`

### Styling Modifications
- Colors and themes can be customized in `styles.css`
- The design uses CSS Grid and Flexbox for easy layout modifications
- All components are designed with CSS custom properties for easy theming

### Business Logic Changes
- Account validation rules in `script.js`
- Transaction limits and rules can be modified
- AI responses can be enhanced or customized
- User authentication rules can be adjusted

## 📈 Sample Data

The system includes sample accounts for demonstration:
- **Account 10001**: John Doe (₹25,000 balance)
- **Account 10002**: Jane Smith (₹45,000 balance)  
- **Account 10003**: Robert Johnson (₹800 balance - low balance example)

**Default Admin User**:
- **Email**: admin@securebank.com
- **Password**: SecureBank@2024

## 🌟 Advanced Features

### User Management
- Dynamic user registration and authentication
- Session persistence and management
- Role-based access control ready
- Password strength validation
- Secure password storage (hashed)

### Enhanced AI Integration
- **OpenAI API Integration**: Real GPT-powered responses
- **Context Awareness**: AI knows your banking data
- **Conversation Memory**: Maintains chat history
- **Fallback System**: Works without API key
- **Configuration Panel**: Easy API key setup

### Security Features
- Password hashing for secure storage
- Session token management
- Auto-logout for security
- Email validation
- Input sanitization and validation

### Professional UI/UX
- Beautiful authentication pages
- User profile dropdown
- Responsive design for all devices
- Loading indicators and animations
- Professional banking interface
- Error handling and user feedback

## 🎓 For New Users

### Getting Started Tips
1. **Register Your Account**: Start by creating a personal account
2. **Explore the Dashboard**: Understand available features after login
3. **Create Test Accounts**: Practice with the account creation process
4. **Try Transactions**: Test deposits and withdrawals with sample accounts
5. **Configure AI**: Add your OpenAI API key for enhanced responses
6. **Generate Reports**: See how data analysis works

### Banking Best Practices (via AI Assistant)
- Maintain minimum balance requirements
- Keep account information updated
- Monitor transaction history regularly
- Use secure login credentials
- Understand interest rates and fees

## 🔮 Future Enhancement Ideas

- **Email Integration**: Real password reset emails
- **Database Integration**: Connect to a real database for data persistence
- **Print Functionality**: Generate printable reports and statements
- **Advanced Security**: Two-factor authentication, password policies
- **Multi-language Support**: Localization for different regions
- **Advanced Analytics**: Charts and graphs for data visualization
- **Backup/Restore**: Data export and import functionality
- **Admin Panel**: User management interface
- **Audit Logs**: Track all user actions
- **Mobile App**: Native mobile application

## 📞 Support

For questions about using this Bank Management System:
1. Use the built-in AI Assistant for banking-related queries
2. Check this README for technical information
3. Review the code comments for implementation details
4. Check the SETUP.md for quick setup instructions

## 🔒 Security Notice

This system is designed for educational and demonstration purposes. For production use:
- Implement server-side authentication
- Use proper database encryption
- Add HTTPS/SSL certificates
- Implement proper session management
- Add rate limiting and monitoring
- Use environment variables for sensitive data

## 📝 License

This project is provided as-is for educational and demonstration purposes. Feel free to modify and enhance according to your needs.

---

**Built with ❤️ for modern, secure banking management**

*Now featuring complete user authentication, AI-enhanced assistance, and professional-grade security!*

## 📁 File Structure
```
Bank Management System/
├── index.html          # Main application file with all pages
├── styles.css          # Complete styling and responsive design
├── script.js           # All functionality and business logic
└── README.md           # This documentation file
```

## 💻 Usage Guide

### First Login
1. Open `index.html` in your browser
2. Use the default credentials: admin/admin123
3. You'll be directed to the home page with dashboard statistics

### Creating Your First Account
1. Navigate to **Accounts** → **Create Account**
2. Fill in all required fields:
   - Name (required)
   - Age (minimum 18 years)
   - Gender selection
   - Account type (Savings/Current)
   - Initial deposit (minimum ₹1000)
   - Phone number (optional)
3. Click "Create Account"
4. Note the auto-generated account number

### Making Transactions
1. Go to **Transactions**
2. Choose your transaction type:
   - **Deposit**: Add money to an account
   - **Withdraw**: Remove money (with balance validation)
   - **Check Balance**: View current balance
   - **Transaction History**: See all account transactions

### Using the AI Assistant
1. Navigate to **AI Assistant**
2. Type your banking question or click quick help topics
3. Get instant, helpful responses about:
   - Account creation
   - Loan applications
   - Interest rates
   - Banking procedures

### Generating Reports
1. Visit the **Reports** section
2. Choose from:
   - **All Accounts**: Complete account listing
   - **Bank Summary**: Statistical overview
   - **Low Balance Accounts**: Risk management report

## 🎨 Features Highlight

### 🏠 Home Dashboard
- Quick access to all major features
- Real-time statistics display
- Beautiful feature cards with icons
- Responsive grid layout

### 📊 Professional Reporting
- Comprehensive data analysis
- Visual balance indicators
- Low balance warnings
- Statistical summaries

### 🛡️ Security Features
- Secure login system
- Session management
- Data validation
- Confirmation dialogs for critical operations

### 📱 Mobile-First Design
- Fully responsive layout
- Touch-friendly interfaces
- Optimized for all screen sizes
- Professional mobile experience

## 🎯 Business Rules

### Account Creation
- Minimum age: 18 years
- Minimum initial deposit: ₹1000
- Account numbers auto-generated starting from 10001
- All personal information required except phone number

### Transactions
- Deposit: Minimum ₹1, no maximum limit
- Withdrawal: Cannot exceed current balance
- All transactions logged with timestamps
- Balance updated in real-time

### Reports
- Low balance threshold: ₹1000
- Transaction history sorted by date (newest first)
- All monetary values displayed in Indian Rupee format

## 🔧 Customization

### Adding New Features
The modular design makes it easy to add new features:
- Add new page sections in `index.html`
- Create corresponding CSS styles in `styles.css`
- Implement functionality in `script.js`

### Styling Modifications
- Colors and themes can be customized in `styles.css`
- The design uses CSS Grid and Flexbox for easy layout modifications
- All components are designed with CSS custom properties for easy theming

### Business Logic Changes
- Account validation rules in `script.js`
- Transaction limits and rules can be modified
- AI responses can be enhanced or customized

## 📈 Sample Data

The system includes sample accounts for demonstration:
- **Account 10001**: John Doe (₹25,000 balance)
- **Account 10002**: Jane Smith (₹45,000 balance)  
- **Account 10003**: Robert Johnson (₹800 balance - low balance example)

## 🌟 Advanced Features

### Transaction Management
- Automatic balance calculation
- Transaction categorization
- Historical transaction search
- Balance-after-transaction tracking

### Data Persistence
- Client-side data storage during session
- Data maintained across page navigation
- Automatic statistics updates

### User Experience
- Smooth animations and transitions
- Loading states for better feedback
- Comprehensive error handling
- Success confirmation messages

## 🎓 For New Users

### Getting Started Tips
1. **Explore the Dashboard**: Start with the home page to understand available features
2. **Create Test Accounts**: Practice with the account creation process
3. **Try Transactions**: Test deposits and withdrawals with sample accounts
4. **Use the AI Assistant**: Get help understanding banking procedures
5. **Generate Reports**: See how data analysis works

### Banking Best Practices (via AI Assistant)
- Maintain minimum balance requirements
- Keep account information updated
- Monitor transaction history regularly
- Use secure login credentials
- Understand interest rates and fees

## 🔮 Future Enhancement Ideas

- **Database Integration**: Connect to a real database for data persistence
- **Print Functionality**: Generate printable reports and statements
- **Email Notifications**: Send transaction confirmations
- **Advanced Security**: Two-factor authentication, password policies
- **Multi-language Support**: Localization for different regions
- **Advanced Analytics**: Charts and graphs for data visualization
- **Backup/Restore**: Data export and import functionality

## 📞 Support

For questions about using this Bank Management System:
1. Use the built-in AI Assistant for banking-related queries
2. Check this README for technical information
3. Review the code comments for implementation details

## 📝 License

This project is provided as-is for educational and demonstration purposes. Feel free to modify and enhance according to your needs.

---

**Built with ❤️ for efficient banking management**