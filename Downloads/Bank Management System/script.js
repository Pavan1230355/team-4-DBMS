// Global variables
let accounts = [];
let transactions = [];
let isLoggedIn = true; // Always logged in now
let currentUser = { firstName: 'Admin', lastName: 'User', email: 'admin@securebank.com' }; // Default user
let users = [];
let accountCounter = 10001;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize data first
    loadSampleData();
    loadUsers();
    
    // Show home page directly
    showPage('home');
});

// User Management Functions
function loadUsers() {
    const savedUsers = localStorage.getItem('bankingApp_users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // Create a default admin user for first time setup
        users = [{
            id: 1,
            firstName: 'System',
            lastName: 'Administrator',
            email: 'admin@securebank.com',
            phone: '+91-9999999999',
            password: hashPassword('SecureBank@2024'),
            role: 'admin',
            createdDate: new Date(),
            isActive: true,
            lastLogin: null
        }];
        saveUsers();
    }
}

function saveUsers() {
    localStorage.setItem('bankingApp_users', JSON.stringify(users));
}

function hashPassword(password) {
    // Simple hash function for demo (use bcrypt in production)
    let hash = 0;
    if (password.length === 0) return hash.toString();
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString();
}

function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?\":{}|<>]/.test(password);
    
    if (password.length < minLength) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    
    if (!hasUpperCase || !hasLowerCase) {
        return { valid: false, message: 'Password must contain both uppercase and lowercase letters' };
    }
    
    if (!hasNumbers) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    
    if (!hasSpecialChar) {
        return { valid: false, message: 'Password must contain at least one special character' };
    }
    
    return { valid: true, message: 'Password is strong' };
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Authentication Functions
function register(event) {
    event.preventDefault();
    console.log('Register function called');
    
    const firstName = document.getElementById('register-firstname')?.value.trim();
    const lastName = document.getElementById('register-lastname')?.value.trim();
    const email = document.getElementById('register-email')?.value.trim().toLowerCase();
    const phone = document.getElementById('register-phone')?.value.trim();
    const password = document.getElementById('register-password')?.value;
    const confirmPassword = document.getElementById('register-confirm-password')?.value;
    const termsAccepted = document.getElementById('terms-agreement')?.checked;
    
    console.log('Form data:', { firstName, lastName, email, phone, password: password ? '***' : '', confirmPassword: confirmPassword ? '***' : '', termsAccepted });
    
    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    if (users.find(user => user.email === email)) {
        showMessage('An account with this email already exists', 'error');
        return;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        showMessage(passwordValidation.message, 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (!termsAccepted) {
        showMessage('Please accept the Terms of Service and Privacy Policy', 'error');
        return;
    }
    
    console.log('All validations passed, creating user...');
    
    // Create new user
    const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        phone,
        password: hashPassword(password),
        role: 'user',
        createdDate: new Date(),
        isActive: true,
        lastLogin: null
    };
    
    users.push(newUser);
    saveUsers();
    
    console.log('User created successfully:', { email, firstName, lastName });
    showMessage('Account created successfully! Please sign in with your credentials.', 'success');
    
    // Clear form and redirect to login
    document.getElementById('register-firstname').value = '';
    document.getElementById('register-lastname').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-phone').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-confirm-password').value = '';
    document.getElementById('terms-agreement').checked = false;
    const marketingConsent = document.getElementById('marketing-consent');
    if (marketingConsent) {
        marketingConsent.checked = false;
    }
    
    setTimeout(() => {
        console.log('Redirecting to login page...');
        showPage('login');
    }, 2000);
}

function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    if (!email || !password) {
        showMessage('Please enter both email and password', 'error');
        return;
    }
    
    // Find user
    const user = users.find(u => u.email === email && u.isActive);
    
    if (!user) {
        showMessage('Invalid email or password', 'error');
        return;
    }
    
    // Verify password
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
        showMessage('Invalid email or password', 'error');
        return;
    }
    
    // Update last login
    user.lastLogin = new Date();
    saveUsers();
    
    // Set current user
    currentUser = user;
    isLoggedIn = true;
    
    // Save login session
    const sessionData = {
        userId: user.id,
        loginTime: new Date(),
        rememberMe: rememberMe
    };
    
    if (rememberMe) {
        localStorage.setItem('bankingApp_session', JSON.stringify(sessionData));
    } else {
        sessionStorage.setItem('bankingApp_session', JSON.stringify(sessionData));
    }
    
    // Update UI
    const currentUserElement = document.getElementById('current-user-name');
    if (currentUserElement) {
        currentUserElement.textContent = `${user.firstName} ${user.lastName}`;
    }
    
    showMessage(`Welcome back, ${user.firstName}!`, 'success');
    showPage('home');
    updateDashboardStats();
    
    // Clear form
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('remember-me').checked = false;
}

function checkAutoLogin() {
    const sessionData = JSON.parse(localStorage.getItem('bankingApp_session') || sessionStorage.getItem('bankingApp_session'));
    
    if (sessionData) {
        const user = users.find(u => u.id === sessionData.userId);
        if (user && user.isActive) {
            // Check if session is still valid (24 hours)
            const loginTime = new Date(sessionData.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            
            if (hoursDiff < 24) {
                currentUser = user;
                isLoggedIn = true;
                const currentUserElement = document.getElementById('current-user-name');
                if (currentUserElement) {
                    currentUserElement.textContent = `${user.firstName} ${user.lastName}`;
                }
                showPage('home');
                updateDashboardStats();
                return;
            }
        }
    }
    
    // Clear invalid sessions
    localStorage.removeItem('bankingApp_session');
    sessionStorage.removeItem('bankingApp_session');
}

function logout() {
    // Clear session data
    localStorage.removeItem('bankingApp_session');
    sessionStorage.removeItem('bankingApp_session');
    
    // Reset state
    isLoggedIn = false;
    currentUser = null;
    
    showMessage('Logged out successfully', 'success');
    
    // Clear user name display
    const currentUserElement = document.getElementById('current-user-name');
    if (currentUserElement) {
        currentUserElement.textContent = 'User';
    }
    
    showPage('login');
    
    // Clear all form inputs
    document.querySelectorAll('input').forEach(input => {
        if (input.type !== 'button' && input.type !== 'submit') {
            input.value = '';
        }
    });
    
    // Clear all result divs
    document.querySelectorAll('.search-results, .report-content, .account-details, .balance-result, .transaction-history').forEach(div => {
        div.innerHTML = '';
    });
    
    // Reset user dropdown
    const userDropdown = document.getElementById('user-dropdown');
    if (userDropdown) {
        userDropdown.classList.remove('show');
    }
}

// UI Helper Functions
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId + '-toggle-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function toggleUserMenu() {
    const userInfo = document.querySelector('.user-info');
    const userDropdown = document.getElementById('user-dropdown');
    
    userInfo.classList.toggle('active');
    userDropdown.classList.toggle('show');
}

function showForgotPassword() {
    document.getElementById('forgot-password-modal').style.display = 'block';
}

function closeForgotPassword() {
    document.getElementById('forgot-password-modal').style.display = 'none';
    document.getElementById('forgot-email').value = '';
}

function sendPasswordReset(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgot-email').value.trim().toLowerCase();
    
    if (!email) {
        showMessage('Please enter your email address', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    const user = users.find(u => u.email === email && u.isActive);
    
    if (user) {
        // In a real application, you would send an email here
        showMessage('Password reset link sent to your email address', 'success');
    } else {
        // Don't reveal whether the email exists for security
        showMessage('If an account exists with this email, you will receive a password reset link', 'success');
    }
    
    closeForgotPassword();
}

function showTerms() {
    showMessage('Terms of Service would open in a new window in a real application', 'info');
}

function showPrivacy() {
    showMessage('Privacy Policy would open in a new window in a real application', 'info');
}

function showProfile() {
    toggleUserMenu();
    showMessage('Profile management feature coming soon', 'info');
}

function showSettings() {
    toggleUserMenu();
    showMessage('Settings panel coming soon', 'info');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = document.getElementById('user-dropdown');
    const userInfo = document.querySelector('.user-info');
    
    if (userMenu && !userMenu.contains(event.target)) {
        userDropdown?.classList.remove('show');
        userInfo?.classList.remove('active');
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('forgot-password-modal');
    if (event.target === modal) {
        closeForgotPassword();
    }
});

// Page navigation
function showPage(pageId) {
    console.log('showPage called with:', pageId);
    
    // Always show navigation bar now
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.display = 'block';
    }

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('Successfully showed page:', pageId);
    } else {
        console.error('Page not found:', pageId + '-page');
        return;
    }
    
    if (pageId === 'home') {
        updateDashboardStats();
    }
}

// Tab management
function showAccountTab(tabId) {
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById(tabId + '-account-tab').classList.add('active');
}

function showTransactionTab(tabId) {
    document.querySelectorAll('.tab-button').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById(tabId + '-tab').classList.add('active');
}

// Account Management Functions
function createAccount(event) {
    event.preventDefault();
    
    const name = document.getElementById('create-name').value.trim();
    const age = parseInt(document.getElementById('create-age').value);
    const gender = document.getElementById('create-gender').value;
    const accountType = document.getElementById('create-type').value;
    const initialDeposit = parseFloat(document.getElementById('create-deposit').value);
    const phone = document.getElementById('create-phone').value.trim();

    // Validation
    if (!name || !age || !gender || !accountType || !initialDeposit) {
        showMessage('Please fill all required fields', 'error');
        return;
    }

    if (age < 18) {
        showMessage('Customer must be at least 18 years old', 'error');
        return;
    }

    if (initialDeposit < 1000) {
        showMessage('Minimum initial deposit is ₹1000', 'error');
        return;
    }

    // Create account
    const accountNumber = accountCounter.toString();
    const newAccount = {
        accountNumber,
        name,
        age,
        gender,
        accountType,
        balance: initialDeposit,
        phone: phone || 'Not provided',
        createdDate: new Date()
    };

    accounts.push(newAccount);
    
    // Add initial deposit transaction
    transactions.push({
        accountNumber,
        type: 'deposit',
        amount: initialDeposit,
        description: 'Initial deposit - Account opening',
        date: new Date(),
        balanceAfter: initialDeposit
    });

    accountCounter++;
    
    // Enhanced success message with account details
    const successMessage = `
        ✅ Account Created Successfully!
        
        Account Number: ${accountNumber}
        Customer Name: ${name}
        Account Type: ${accountType}
        Initial Deposit: ₹${initialDeposit.toLocaleString('en-IN')}
        
        Please note down the account number for future reference.
    `;
    
    alert(successMessage); // Use alert for better visibility
    showMessage(`New account ${accountNumber} created for ${name}`, 'success');
    
    // Reset form
    document.getElementById('create-name').value = '';
    document.getElementById('create-age').value = '';
    document.getElementById('create-gender').value = '';
    document.getElementById('create-type').value = '';
    document.getElementById('create-deposit').value = '';
    document.getElementById('create-phone').value = '';
    
    updateDashboardStats();
}

function viewAccount() {
    const accountNumber = document.getElementById('view-account-number').value.trim();
    
    if (!accountNumber) {
        showMessage('Please enter account number', 'error');
        return;
    }

    const account = accounts.find(acc => acc.accountNumber === accountNumber);
    
    if (!account) {
        showMessage('Account not found', 'error');
        document.getElementById('account-details').innerHTML = '';
        return;
    }

    const accountDetailsHTML = `
        <div class="account-card">
            <div class="account-header">
                <h3><i class="fas fa-user-circle"></i> Account Details</h3>
                <span class="account-status ${account.balance >= 1000 ? 'active' : 'low-balance'}">
                    ${account.balance >= 1000 ? 'Active' : 'Low Balance'}
                </span>
            </div>
            <div class="account-info">
                <div class="info-row">
                    <div class="info-item">
                        <h4><i class="fas fa-id-card"></i> Account Number</h4>
                        <p class="highlight">${account.accountNumber}</p>
                    </div>
                    <div class="info-item">
                        <h4><i class="fas fa-user"></i> Customer Name</h4>
                        <p>${account.name}</p>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-item">
                        <h4><i class="fas fa-birthday-cake"></i> Age</h4>
                        <p>${account.age} years</p>
                    </div>
                    <div class="info-item">
                        <h4><i class="fas fa-venus-mars"></i> Gender</h4>
                        <p>${account.gender}</p>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-item">
                        <h4><i class="fas fa-university"></i> Account Type</h4>
                        <p class="account-type">${account.accountType}</p>
                    </div>
                    <div class="info-item">
                        <h4><i class="fas fa-phone"></i> Phone Number</h4>
                        <p>${account.phone}</p>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-item">
                        <h4><i class="fas fa-calendar-alt"></i> Account Created</h4>
                        <p>${account.createdDate.toLocaleDateString('en-IN')}</p>
                    </div>
                    <div class="info-item">
                        <h4><i class="fas fa-clock"></i> Account Age</h4>
                        <p>${Math.floor((new Date() - account.createdDate) / (1000 * 60 * 60 * 24))} days</p>
                    </div>
                </div>
            </div>
            <div class="balance-section">
                <div class="balance-highlight ${account.balance >= 10000 ? 'high-balance' : account.balance >= 1000 ? 'normal-balance' : 'low-balance'}">
                    <h3><i class="fas fa-wallet"></i> Current Balance</h3>
                    <h2>₹${account.balance.toLocaleString('en-IN')}</h2>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('account-details').innerHTML = accountDetailsHTML;
    
    // Show quick actions
    const actionsElement = document.getElementById('account-actions');
    if (actionsElement) {
        actionsElement.style.display = 'block';
    }
}

function loadAccountForUpdate() {
    const accountNumber = document.getElementById('update-search-number').value.trim();
    
    if (!accountNumber) {
        showMessage('Please enter account number', 'error');
        return;
    }

    const account = accounts.find(acc => acc.accountNumber === accountNumber);
    
    if (!account) {
        showMessage('Account not found', 'error');
        document.getElementById('update-form').style.display = 'none';
        return;
    }

    // Populate form
    document.getElementById('update-account-number').value = account.accountNumber;
    document.getElementById('update-name').value = account.name;
    document.getElementById('update-age').value = account.age;
    document.getElementById('update-gender').value = account.gender;
    document.getElementById('update-phone').value = account.phone !== 'Not provided' ? account.phone : '';
    
    document.getElementById('update-form').style.display = 'block';
    showMessage('Account loaded successfully', 'success');
}

function updateAccount(event) {
    event.preventDefault();
    
    const accountNumber = document.getElementById('update-account-number').value;
    const name = document.getElementById('update-name').value.trim();
    const age = parseInt(document.getElementById('update-age').value);
    const gender = document.getElementById('update-gender').value;
    const phone = document.getElementById('update-phone').value.trim();

    if (!name || !age || !gender) {
        showMessage('Please fill all required fields', 'error');
        return;
    }

    if (age < 18) {
        showMessage('Customer must be at least 18 years old', 'error');
        return;
    }

    const accountIndex = accounts.findIndex(acc => acc.accountNumber === accountNumber);
    
    if (accountIndex === -1) {
        showMessage('Account not found', 'error');
        return;
    }

    // Update account
    accounts[accountIndex].name = name;
    accounts[accountIndex].age = age;
    accounts[accountIndex].gender = gender;
    accounts[accountIndex].phone = phone || 'Not provided';

    showMessage('Account updated successfully', 'success');
    document.getElementById('update-form').style.display = 'none';
    document.getElementById('update-search-number').value = '';
}

// Enhanced Account Management Helper Functions
function updateAccountNumberPreview() {
    const previewElement = document.getElementById('next-account-number');
    if (previewElement) {
        previewElement.textContent = accountCounter;
    }
}

function editCurrentAccount() {
    const accountNumber = document.getElementById('view-account-number').value.trim();
    if (accountNumber) {
        showAccountTab('update');
        document.getElementById('update-search-number').value = accountNumber;
        loadAccountForUpdate();
    }
}

function viewTransactionHistory() {
    const accountNumber = document.getElementById('view-account-number').value.trim();
    if (accountNumber) {
        showPage('transactions');
        showTransactionTab('history');
        document.getElementById('history-account').value = accountNumber;
        showTransactionHistory();
    }
}

function printAccountDetails() {
    const accountDetails = document.getElementById('account-details');
    if (accountDetails && accountDetails.innerHTML) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Account Details</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .account-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
                        .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
                        .balance-highlight { background: #f0f0f0; padding: 15px; text-align: center; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <h1>SecureBank - Account Details</h1>
                    ${accountDetails.innerHTML}
                    <p><small>Printed on: ${new Date().toLocaleString()}</small></p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

function cancelUpdate() {
    document.getElementById('update-form').style.display = 'none';
    document.getElementById('update-search-number').value = '';
    showMessage('Update cancelled', 'info');
}

function previewAccountForDelete() {
    const accountNumber = document.getElementById('delete-account-number').value.trim();
    
    if (!accountNumber) {
        showMessage('Please enter account number', 'error');
        return;
    }

    const account = accounts.find(acc => acc.accountNumber === accountNumber);
    
    if (!account) {
        showMessage('Account not found', 'error');
        document.getElementById('delete-preview').style.display = 'none';
        return;
    }

    const previewHTML = `
        <div class="account-preview">
            <h4>Account to be Deleted:</h4>
            <div class="preview-details">
                <p><strong>Account Number:</strong> ${account.accountNumber}</p>
                <p><strong>Customer Name:</strong> ${account.name}</p>
                <p><strong>Account Type:</strong> ${account.accountType}</p>
                <p><strong>Current Balance:</strong> ₹${account.balance.toLocaleString('en-IN')}</p>
                <p><strong>Phone:</strong> ${account.phone}</p>
            </div>
            ${account.balance > 0 ? `
                <div class="balance-warning">
                    <i class="fas fa-exclamation-circle"></i>
                    <strong>Warning:</strong> This account has a balance of ₹${account.balance.toLocaleString('en-IN')}.
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('delete-account-info').innerHTML = previewHTML;
    document.getElementById('delete-preview').style.display = 'block';
}

function confirmDeleteAccount() {
    const accountNumber = document.getElementById('delete-account-number').value.trim();
    const account = accounts.find(acc => acc.accountNumber === accountNumber);
    
    if (!account) {
        showMessage('Account not found', 'error');
        return;
    }
    
    let confirmMessage = `Are you sure you want to delete account ${accountNumber} for ${account.name}?\n\nThis will:`;
    confirmMessage += `\n• Permanently delete the account`;
    confirmMessage += `\n• Remove all transaction history`;
    if (account.balance > 0) {
        confirmMessage += `\n• Close account with balance: ₹${account.balance.toLocaleString('en-IN')}`;
    }
    confirmMessage += `\n\nThis action cannot be undone!`;
    
    if (window.confirm(confirmMessage)) {
        // Remove account and related transactions
        const accountIndex = accounts.findIndex(acc => acc.accountNumber === accountNumber);
        accounts.splice(accountIndex, 1);
        transactions = transactions.filter(t => t.accountNumber !== accountNumber);
        
        showMessage(`Account ${accountNumber} has been permanently deleted`, 'success');
        
        // Reset form
        document.getElementById('delete-account-number').value = '';
        document.getElementById('delete-preview').style.display = 'none';
        
        updateDashboardStats();
    }
}

function cancelDelete() {
    document.getElementById('delete-account-number').value = '';
    document.getElementById('delete-preview').style.display = 'none';
    showMessage('Delete operation cancelled', 'info');
}

// Initialize account number preview on page load
document.addEventListener('DOMContentLoaded', function() {
    updateAccountNumberPreview();
});

// Transaction Functions
function depositMoney(event) {
    event.preventDefault();
    
    const accountNumber = document.getElementById('deposit-account').value.trim();
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    const description = document.getElementById('deposit-description').value.trim() || 'Cash deposit';

    if (!accountNumber || !amount) {
        showMessage('Please enter account number and amount', 'error');
        return;
    }

    if (amount <= 0) {
        showMessage('Amount must be greater than zero', 'error');
        return;
    }

    const accountIndex = accounts.findIndex(acc => acc.accountNumber === accountNumber);
    
    if (accountIndex === -1) {
        showMessage('Account not found', 'error');
        return;
    }

    // Update balance
    accounts[accountIndex].balance += amount;
    
    // Add transaction record
    transactions.push({
        accountNumber,
        type: 'deposit',
        amount,
        description,
        date: new Date(),
        balanceAfter: accounts[accountIndex].balance
    });

    showMessage(`₹${amount.toLocaleString('en-IN')} deposited successfully. New balance: ₹${accounts[accountIndex].balance.toLocaleString('en-IN')}`, 'success');
    
    // Reset form
    document.getElementById('deposit-account').value = '';
    document.getElementById('deposit-amount').value = '';
    document.getElementById('deposit-description').value = '';
    
    updateDashboardStats();
}

function withdrawMoney(event) {
    event.preventDefault();
    
    const accountNumber = document.getElementById('withdraw-account').value.trim();
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    const description = document.getElementById('withdraw-description').value.trim() || 'Cash withdrawal';

    if (!accountNumber || !amount) {
        showMessage('Please enter account number and amount', 'error');
        return;
    }

    if (amount <= 0) {
        showMessage('Amount must be greater than zero', 'error');
        return;
    }

    const accountIndex = accounts.findIndex(acc => acc.accountNumber === accountNumber);
    
    if (accountIndex === -1) {
        showMessage('Account not found', 'error');
        return;
    }

    if (accounts[accountIndex].balance < amount) {
        showMessage('Insufficient balance. Current balance: ₹' + accounts[accountIndex].balance.toLocaleString('en-IN'), 'error');
        return;
    }

    // Update balance
    accounts[accountIndex].balance -= amount;
    
    // Add transaction record
    transactions.push({
        accountNumber,
        type: 'withdraw',
        amount,
        description,
        date: new Date(),
        balanceAfter: accounts[accountIndex].balance
    });

    showMessage(`₹${amount.toLocaleString('en-IN')} withdrawn successfully. New balance: ₹${accounts[accountIndex].balance.toLocaleString('en-IN')}`, 'success');
    
    // Reset form
    document.getElementById('withdraw-account').value = '';
    document.getElementById('withdraw-amount').value = '';
    document.getElementById('withdraw-description').value = '';
    
    updateDashboardStats();
}

function checkBalance() {
    const accountNumber = document.getElementById('balance-account').value.trim();
    
    if (!accountNumber) {
        showMessage('Please enter account number', 'error');
        return;
    }

    const account = accounts.find(acc => acc.accountNumber === accountNumber);
    
    if (!account) {
        showMessage('Account not found', 'error');
        document.getElementById('balance-result').innerHTML = '';
        return;
    }

    const balanceHTML = `
        <div class="balance-card">
            <h3>₹${account.balance.toLocaleString('en-IN')}</h3>
            <p>Account: ${account.accountNumber}</p>
            <p>Customer: ${account.name}</p>
            <p>Account Type: ${account.accountType}</p>
        </div>
    `;
    
    document.getElementById('balance-result').innerHTML = balanceHTML;
}

function showTransactionHistory() {
    const accountNumber = document.getElementById('history-account').value.trim();
    
    if (!accountNumber) {
        showMessage('Please enter account number', 'error');
        return;
    }

    const account = accounts.find(acc => acc.accountNumber === accountNumber);
    
    if (!account) {
        showMessage('Account not found', 'error');
        document.getElementById('transaction-history').innerHTML = '';
        return;
    }

    const accountTransactions = transactions
        .filter(t => t.accountNumber === accountNumber)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (accountTransactions.length === 0) {
        document.getElementById('transaction-history').innerHTML = '<p>No transactions found for this account.</p>';
        return;
    }

    let historyHTML = `
        <h4>Transaction History for ${account.name} (Account: ${accountNumber})</h4>
        <div class="transaction-list">
    `;

    accountTransactions.forEach(transaction => {
        const sign = transaction.type === 'deposit' ? '+' : '-';
        const className = transaction.type === 'deposit' ? 'deposit' : 'withdraw';
        
        historyHTML += `
            <div class="transaction-item">
                <div class="transaction-info">
                    <h4>${transaction.type.toUpperCase()}</h4>
                    <p>${transaction.description}</p>
                    <p><small>${transaction.date.toLocaleString()}</small></p>
                </div>
                <div class="transaction-amount ${className}">
                    ${sign}₹${transaction.amount.toLocaleString('en-IN')}
                    <br><small>Balance: ₹${transaction.balanceAfter.toLocaleString('en-IN')}</small>
                </div>
            </div>
        `;
    });

    historyHTML += '</div>';
    document.getElementById('transaction-history').innerHTML = historyHTML;
}

// Search Functions
function searchByNumber() {
    const accountNumber = document.getElementById('search-by-number').value.trim();
    
    if (!accountNumber) {
        showMessage('Please enter account number', 'error');
        return;
    }

    const account = accounts.find(acc => acc.accountNumber === accountNumber);
    
    if (!account) {
        showMessage('Account not found', 'error');
        document.getElementById('search-results').innerHTML = '';
        return;
    }

    displaySearchResults([account]);
}

function searchByName() {
    const searchName = document.getElementById('search-by-name').value.trim().toLowerCase();
    
    if (!searchName) {
        showMessage('Please enter customer name', 'error');
        return;
    }

    const matchingAccounts = accounts.filter(acc => 
        acc.name.toLowerCase().includes(searchName)
    );
    
    if (matchingAccounts.length === 0) {
        showMessage('No accounts found with that name', 'error');
        document.getElementById('search-results').innerHTML = '';
        return;
    }

    displaySearchResults(matchingAccounts);
}

function displaySearchResults(searchResults) {
    let resultsHTML = `<h3>Search Results (${searchResults.length} found)</h3>`;
    
    searchResults.forEach(account => {
        resultsHTML += `
            <div class="account-card">
                <div class="account-header">
                    <h4>${account.name}</h4>
                    <span class="account-number">${account.accountNumber}</span>
                </div>
                <div class="account-details-grid">
                    <div class="detail-item">
                        <span>Age</span>
                        <strong>${account.age}</strong>
                    </div>
                    <div class="detail-item">
                        <span>Gender</span>
                        <strong>${account.gender}</strong>
                    </div>
                    <div class="detail-item">
                        <span>Account Type</span>
                        <strong>${account.accountType}</strong>
                    </div>
                    <div class="detail-item">
                        <span>Balance</span>
                        <strong>₹${account.balance.toLocaleString('en-IN')}</strong>
                    </div>
                    <div class="detail-item">
                        <span>Phone</span>
                        <strong>${account.phone}</strong>
                    </div>
                    <div class="detail-item">
                        <span>Created</span>
                        <strong>${account.createdDate.toLocaleDateString()}</strong>
                    </div>
                </div>
            </div>
        `;
    });
    
    document.getElementById('search-results').innerHTML = resultsHTML;
}

// Reports Functions
function showAllAccounts() {
    if (accounts.length === 0) {
        document.getElementById('report-content').innerHTML = '<p>No accounts found.</p>';
        return;
    }

    let reportHTML = `
        <h3>All Accounts Report</h3>
        <table class="accounts-table">
            <thead>
                <tr>
                    <th>Account Number</th>
                    <th>Customer Name</th>
                    <th>Type</th>
                    <th>Balance</th>
                    <th>Phone</th>
                    <th>Created Date</th>
                </tr>
            </thead>
            <tbody>
    `;

    accounts.forEach(account => {
        const rowClass = account.balance < 1000 ? 'low-balance' : '';
        reportHTML += `
            <tr class="${rowClass}">
                <td>${account.accountNumber}</td>
                <td>${account.name}</td>
                <td>${account.accountType}</td>
                <td>₹${account.balance.toLocaleString('en-IN')}</td>
                <td>${account.phone}</td>
                <td>${account.createdDate.toLocaleDateString()}</td>
            </tr>
        `;
    });

    reportHTML += '</tbody></table>';
    document.getElementById('report-content').innerHTML = reportHTML;
}

function showBankSummary() {
    const totalAccounts = accounts.length;
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const savingsAccounts = accounts.filter(acc => acc.accountType === 'Savings').length;
    const currentAccounts = accounts.filter(acc => acc.accountType === 'Current').length;
    const avgBalance = totalAccounts > 0 ? totalBalance / totalAccounts : 0;
    const todayTransactions = transactions.filter(t => {
        const today = new Date();
        const transDate = new Date(t.date);
        return transDate.toDateString() === today.toDateString();
    }).length;

    const summaryHTML = `
        <h3>Bank Summary Report</h3>
        <div class="summary-grid">
            <div class="summary-card">
                <h3>${totalAccounts}</h3>
                <p>Total Accounts</p>
            </div>
            <div class="summary-card">
                <h3>₹${totalBalance.toLocaleString('en-IN')}</h3>
                <p>Total Bank Balance</p>
            </div>
            <div class="summary-card">
                <h3>₹${avgBalance.toLocaleString('en-IN')}</h3>
                <p>Average Balance</p>
            </div>
            <div class="summary-card">
                <h3>${todayTransactions}</h3>
                <p>Today's Transactions</p>
            </div>
            <div class="summary-card">
                <h3>${savingsAccounts}</h3>
                <p>Savings Accounts</p>
            </div>
            <div class="summary-card">
                <h3>${currentAccounts}</h3>
                <p>Current Accounts</p>
            </div>
        </div>
    `;

    document.getElementById('report-content').innerHTML = summaryHTML;
}

function showLowBalanceAccounts() {
    const lowBalanceAccounts = accounts.filter(acc => acc.balance < 1000);

    if (lowBalanceAccounts.length === 0) {
        document.getElementById('report-content').innerHTML = '<p>No accounts with low balance found.</p>';
        return;
    }

    let reportHTML = `
        <h3>Low Balance Accounts Report (Balance < ₹1000)</h3>
        <p class="text-warning">⚠️ ${lowBalanceAccounts.length} accounts found with low balance</p>
        <table class="accounts-table">
            <thead>
                <tr>
                    <th>Account Number</th>
                    <th>Customer Name</th>
                    <th>Type</th>
                    <th>Balance</th>
                    <th>Phone</th>
                    <th>Action Needed</th>
                </tr>
            </thead>
            <tbody>
    `;

    lowBalanceAccounts.forEach(account => {
        let actionNeeded = 'Immediate deposit required';
        if (account.balance < 500) {
            actionNeeded = 'Critical - Account may be closed';
        }

        reportHTML += `
            <tr class="low-balance">
                <td>${account.accountNumber}</td>
                <td>${account.name}</td>
                <td>${account.accountType}</td>
                <td>₹${account.balance.toLocaleString('en-IN')}</td>
                <td>${account.phone}</td>
                <td>${actionNeeded}</td>
            </tr>
        `;
    });

    reportHTML += '</tbody></table>';
    document.getElementById('report-content').innerHTML = reportHTML;
}

// AI Assistant Functions
async function sendMessage() {
    const messageInput = document.getElementById('user-message');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    addMessageToChat(message, 'user');
    messageInput.value = '';
    
    // Show typing indicator
    addTypingIndicator();
    
    try {
        // Use AI service if available, otherwise fallback
        let response;
        if (aiService) {
            response = await aiService.getContextualResponse(message);
        } else {
            response = getStaticResponse(message);
        }
        
        removeTypingIndicator();
        addMessageToChat(response, 'bot');
    } catch (error) {
        console.error('Error getting AI response:', error);
        removeTypingIndicator();
        addMessageToChat('I apologize, but I\'m having trouble processing your request right now. Please try again or use the quick help topics below.', 'bot');
    }
}

function askAI(question) {
    document.getElementById('user-message').value = question;
    sendMessage();
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const icon = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
    
    // Convert markdown-style formatting to HTML
    const formattedMessage = formatMessage(message);
    
    messageDiv.innerHTML = `
        <i class="${icon}"></i>
        <div class="message-content">
            ${formattedMessage}
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatMessage(message) {
    // Convert markdown-style formatting to HTML
    let formatted = message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italic*
        .replace(/^• (.+)$/gm, '<li>$1</li>') // • bullet points
        .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>') // numbered lists
        .replace(/\n\n/g, '</p><p>'); // paragraphs
    
    // Wrap in paragraph tags if not already formatted
    if (!formatted.includes('<p>') && !formatted.includes('<li>')) {
        formatted = `<p>${formatted}</p>`;
    }
    
    // Handle lists
    formatted = formatted.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    return formatted;
}

function addTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <i class="fas fa-robot"></i>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function clearChat() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = `
        <div class="message bot-message">
            <i class="fas fa-robot"></i>
            <div class="message-content">
                <p>Hello! I'm your AI Banking Assistant. I can help you with:</p>
                <ul>
                    <li>Creating bank accounts</li>
                    <li>Understanding banking services</li>
                    <li>Loan application guidance</li>
                    <li>General banking questions</li>
                </ul>
                <p>How can I assist you today?</p>
            </div>
        </div>
    `;
    
    // Clear AI service history if available
    if (aiService) {
        aiService.clearHistory();
    }
}

// API Key Management Functions
function toggleConfigPanel() {
    const panel = document.getElementById('config-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    updateAIStatus();
}

function saveApiKey() {
    const apiKeyInput = document.getElementById('api-key-input');
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
        showMessage('Please enter a valid API key', 'error');
        return;
    }
    
    if (!apiKey.startsWith('sk-')) {
        showMessage('Invalid API key format. OpenAI API keys start with "sk-"', 'error');
        return;
    }
    
    // Save to configuration
    CONFIG.OPENAI.API_KEY = apiKey;
    
    // Update AI service
    if (aiService) {
        aiService.updateApiKey(apiKey);
    }
    
    // Store in localStorage (note: not secure for production)
    localStorage.setItem('bankingApp_apiKey', btoa(apiKey));
    
    showMessage('API key saved successfully! AI responses will now be enhanced.', 'success');
    updateAIStatus();
    
    // Test the connection
    setTimeout(async () => {
        if (aiService) {
            try {
                await aiService.testConnection();
                showMessage('AI connection verified successfully!', 'success');
                updateAIStatus();
            } catch (error) {
                showMessage('API key validation failed. Please check your key.', 'error');
                updateAIStatus();
            }
        }
    }, 1000);
}

function toggleApiKeyVisibility() {
    const apiKeyInput = document.getElementById('api-key-input');
    const toggleIcon = document.getElementById('api-key-toggle-icon');
    
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        apiKeyInput.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

function updateAIStatus() {
    const statusElement = document.getElementById('ai-status');
    if (!statusElement) return;
    
    const hasApiKey = CONFIG.OPENAI.API_KEY && CONFIG.OPENAI.API_KEY.trim() !== '';
    
    if (hasApiKey) {
        statusElement.innerHTML = '<i class="fas fa-circle text-success"></i> <span>AI Status: Enhanced Mode Active</span>';
        statusElement.className = 'status-indicator status-active';
    } else {
        statusElement.innerHTML = '<i class="fas fa-circle text-warning"></i> <span>AI Status: Fallback Mode (Limited Responses)</span>';
        statusElement.className = 'status-indicator status-fallback';
    }
}

// Load saved API key on page load
function loadSavedApiKey() {
    try {
        const savedKey = localStorage.getItem('bankingApp_apiKey');
        if (savedKey) {
            const decodedKey = atob(savedKey);
            CONFIG.OPENAI.API_KEY = decodedKey;
            document.getElementById('api-key-input').value = decodedKey;
            
            if (aiService) {
                aiService.updateApiKey(decodedKey);
            }
        }
    } catch (error) {
        console.error('Error loading saved API key:', error);
    }
    updateAIStatus();
}

function getAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('create') && message.includes('account')) {
        return `To create a new bank account, you'll need:
        
        📋 Required Documents:
        • Valid government photo ID (Aadhaar, PAN, Passport)
        • Address proof (utility bill, rental agreement)
        • PAN card (mandatory)
        • Recent passport-size photographs
        
        💰 Initial Deposit Requirements:
        • Savings Account: ₹1,000 minimum
        • Current Account: ₹5,000 minimum
        
        📝 Process:
        1. Visit the bank branch or apply online
        2. Fill the account opening form
        3. Submit documents for verification
        4. Make initial deposit
        5. Receive account number and checkbook
        
        Would you like to know about specific account types?`;
    }
    
    if (message.includes('loan') && message.includes('document')) {
        return `For loan applications, you typically need:
        
        📋 Basic Documents:
        • Identity Proof (Aadhaar, PAN, Passport)
        • Address Proof (utility bills, rental agreement)
        • Income Proof (salary slips, ITR, bank statements)
        • Employment Proof (employment letter, business registration)
        
        💼 For Personal Loans:
        • Last 3 months salary slips
        • Bank statements (6 months)
        • Form 16 or ITR for last 2 years
        
        🏠 For Home Loans (Additional):
        • Property documents
        • NOC from builder/seller
        • Approved building plan
        • Property valuation report
        
        💰 For Business Loans (Additional):
        • Business registration certificates
        • Financial statements
        • GST returns
        • Current account statements
        
        The specific requirements may vary based on loan type and amount.`;
    }
    
    if (message.includes('account') && message.includes('type')) {
        return `We offer different types of accounts:
        
        💰 Savings Account:
        • For regular savings and transactions
        • Interest rate: 3.5% - 4% per annum
        • Minimum balance: ₹1,000
        • Free debit card and checkbook
        • Online banking and mobile app access
        
        🏢 Current Account:
        • For business transactions
        • No interest on balance
        • Minimum balance: ₹5,000
        • Higher transaction limits
        • Overdraft facility available
        
        ⭐ Premium Savings:
        • Higher interest rates for large balances
        • Premium services and dedicated relationship manager
        • Minimum balance: ₹25,000
        
        Which account type suits your needs best?`;
    }
    
    if (message.includes('personal') && message.includes('loan')) {
        return `Personal Loan Application Process:
        
        ✅ Eligibility Criteria:
        • Age: 21-60 years
        • Monthly Income: ₹25,000+ for salaried
        • Employment: Minimum 2 years experience
        • Credit Score: 650+ preferred
        
        💰 Loan Features:
        • Amount: ₹50,000 to ₹40 lakhs
        • Interest Rate: 10.5% - 24% per annum
        • Tenure: 12 months to 5 years
        • Processing fee: 1-3% of loan amount
        
        📋 Application Steps:
        1. Check eligibility online
        2. Submit application with documents
        3. Credit verification and employment check
        4. Loan approval and sanction letter
        5. Loan disbursement to your account
        
        💡 Tips for Approval:
        • Maintain good credit score
        • Show stable income source
        • Keep debt-to-income ratio low
        • Avoid multiple loan applications
        
        Would you like to know about interest rates or EMI calculation?`;
    }
    
    if (message.includes('interest') && message.includes('rate')) {
        return `Current Interest Rates:
        
        💰 Deposit Rates:
        • Savings Account: 3.5% - 4% per annum
        • Fixed Deposit: 6% - 7.5% per annum
        • Recurring Deposit: 6% - 7% per annum
        
        🏠 Loan Rates:
        • Home Loan: 8.5% - 11% per annum
        • Personal Loan: 10.5% - 24% per annum
        • Car Loan: 8.5% - 15% per annum
        • Education Loan: 9% - 15% per annum
        
        💳 Credit Card:
        • Annual Fee: ₹500 - ₹5,000
        • Interest on outstanding: 36% - 45% per annum
        • Cash advance fee: 2.5% - 3.5%
        
        📊 Note: Rates may vary based on:
        • Credit score and profile
        • Loan amount and tenure
        • Existing relationship with bank
        • Market conditions
        
        *Rates are subject to change. Contact us for current rates.`;
    }
    
    if (message.includes('minimum') && message.includes('balance')) {
        return `Minimum Balance Requirements:
        
        💰 Savings Account:
        • Regular Savings: ₹1,000
        • Premium Savings: ₹25,000
        • Senior Citizen: ₹500
        • Student Account: ₹250
        
        🏢 Current Account:
        • Regular Current: ₹5,000
        • Business Current: ₹10,000
        • Corporate Current: ₹25,000
        
        ⚠️ Non-maintenance Penalties:
        • ₹100-500 per month for savings accounts
        • ₹500-1000 per month for current accounts
        
        💡 Tips to Maintain Balance:
        • Set up auto-transfer from other accounts
        • Use direct deposit for salary
        • Monitor balance regularly via mobile app
        • Link multiple accounts for auto-sweep
        
        📱 Balance Check Options:
        • Mobile banking app
        • SMS banking
        • ATM balance inquiry
        • Internet banking
        • Missed call banking
        
        Would you like help with setting up balance alerts?`;
    }
}

function getStaticResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('create') && message.includes('account')) {
        return `**🏦 Account Creation Guide**

**📋 Required Documents:**
• Valid government photo ID (Aadhaar, PAN, Passport)
• Address proof (utility bill, rental agreement)
• PAN card (mandatory)
• Recent passport-size photographs

**💰 Initial Deposit Requirements:**
• Savings Account: ₹${CONFIG.BANKING.MIN_DEPOSIT.toLocaleString('en-IN')} minimum
• Current Account: ₹5,000 minimum

**📝 Process:**
1. Visit the bank branch or apply online
2. Fill the account opening form
3. Submit documents for verification
4. Make initial deposit
5. Receive account number and checkbook

Would you like to know about specific account types?`;
    }
    
    // ... rest of the static responses remain the same
    if (message.includes('loan') && message.includes('document')) {
        return `**📋 Loan Application Documents**

**Basic Requirements:**
• Identity Proof (Aadhaar, PAN, Passport)
• Address Proof (utility bills, rental agreement)
• Income Proof (salary slips, ITR, bank statements)
• Employment Proof (employment letter, business registration)

**💼 For Personal Loans:**
• Last 3 months salary slips
• Bank statements (6 months)
• Form 16 or ITR for last 2 years

**🏠 For Home Loans (Additional):**
• Property documents
• NOC from builder/seller
• Approved building plan
• Property valuation report

**💰 For Business Loans (Additional):**
• Business registration certificates
• Financial statements
• GST returns
• Current account statements

The specific requirements may vary based on loan type and amount.`;
    }
    
    if (message.includes('account') && message.includes('type')) {
        return `**💰 Account Types Available**

**Savings Account:**
• For regular savings and transactions
• Interest rate: 3.5% - 4% per annum
• Minimum balance: ₹${CONFIG.BANKING.MIN_DEPOSIT.toLocaleString('en-IN')}
• Free debit card and checkbook
• Online banking and mobile app access

**🏢 Current Account:**
• For business transactions
• No interest on balance
• Minimum balance: ₹5,000
• Higher transaction limits
• Overdraft facility available

**⭐ Premium Savings:**
• Higher interest rates for large balances
• Premium services and dedicated relationship manager
• Minimum balance: ₹25,000

Which account type suits your needs best?`;
    }
    
    if (message.includes('personal') && message.includes('loan')) {
        return `**💸 Personal Loan Application Process**

**✅ Eligibility Criteria:**
• Age: 21-60 years
• Monthly Income: ₹25,000+ for salaried
• Employment: Minimum 2 years experience
• Credit Score: 650+ preferred

**💰 Loan Features:**
• Amount: ₹50,000 to ₹40 lakhs
• Interest Rate: 10.5% - 24% per annum
• Tenure: 12 months to 5 years
• Processing fee: 1-3% of loan amount

**📋 Application Steps:**
1. Check eligibility online
2. Submit application with documents
3. Credit verification and employment check
4. Loan approval and sanction letter
5. Loan disbursement to your account

**💡 Tips for Approval:**
• Maintain good credit score
• Show stable income source
• Keep debt-to-income ratio low
• Avoid multiple loan applications

Would you like to know about interest rates or EMI calculation?`;
    }
    
    if (message.includes('interest') && message.includes('rate')) {
        return `**📊 Current Interest Rates**

**💰 Deposit Rates:**
• Savings Account: 3.5% - 4% per annum
• Fixed Deposit: 6% - 7.5% per annum
• Recurring Deposit: 6% - 7% per annum

**🏠 Loan Rates:**
• Home Loan: 8.5% - 11% per annum
• Personal Loan: 10.5% - 24% per annum
• Car Loan: 8.5% - 15% per annum
• Education Loan: 9% - 15% per annum

**💳 Credit Card:**
• Annual Fee: ₹500 - ₹5,000
• Interest on outstanding: 36% - 45% per annum
• Cash advance fee: 2.5% - 3.5%

**📊 Note:** Rates may vary based on:
• Credit score and profile
• Loan amount and tenure
• Existing relationship with bank
• Market conditions

*Rates are subject to change. Contact us for current rates.*`;
    }
    
    if (message.includes('minimum') && message.includes('balance')) {
        return `**💰 Minimum Balance Requirements**

**Savings Account:**
• Regular Savings: ₹${CONFIG.BANKING.MIN_DEPOSIT.toLocaleString('en-IN')}
• Premium Savings: ₹25,000
• Senior Citizen: ₹500
• Student Account: ₹250

**🏢 Current Account:**
• Regular Current: ₹5,000
• Business Current: ₹10,000
• Corporate Current: ₹25,000

**⚠️ Non-maintenance Penalties:**
• ₹100-500 per month for savings accounts
• ₹500-1000 per month for current accounts

**💡 Tips to Maintain Balance:**
• Set up auto-transfer from other accounts
• Use direct deposit for salary
• Monitor balance regularly via mobile app
• Link multiple accounts for auto-sweep

**📱 Balance Check Options:**
• Mobile banking app
• SMS banking
• ATM balance inquiry
• Internet banking
• Missed call banking

Would you like help with setting up balance alerts?`;
    }
    
    // Default response for unmatched queries
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

**� General Banking:**
• Transaction procedures and limits
• Online banking features
• Card services and security
• Investment and savings options

**💡 For Enhanced AI Responses:**
Configure your OpenAI API key using the "Configure AI" button above to get more personalized and detailed responses!

Please feel free to ask more specific questions, or click on the quick help topics for instant answers!`;
}

// Utility Functions
function showMessage(message, type) {
    const messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        console.error('Message container not found, showing in console:', message);
        return;
    }
    
    const messageDiv = document.createElement('div');
    
    messageDiv.className = `alert alert-${type === 'error' ? 'danger' : type}`;
    messageDiv.textContent = message;
    
    messageContainer.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function updateDashboardStats() {
    if (!isLoggedIn) return;
    
    const totalAccounts = accounts.length;
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const todayTransactions = transactions.filter(t => {
        const today = new Date();
        const transDate = new Date(t.date);
        return transDate.toDateString() === today.toDateString();
    }).length;

    // Update dashboard stats
    const totalAccountsElement = document.getElementById('total-accounts');
    const totalBalanceElement = document.getElementById('total-balance');
    const totalTransactionsElement = document.getElementById('total-transactions');

    if (totalAccountsElement) totalAccountsElement.textContent = totalAccounts;
    if (totalBalanceElement) totalBalanceElement.textContent = `₹${totalBalance.toLocaleString('en-IN')}`;
    if (totalTransactionsElement) totalTransactionsElement.textContent = todayTransactions;
}

// Keyboard event listeners
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.id === 'user-message') {
        sendMessage();
    }
});

// Initialize tooltips and other interactive elements
document.addEventListener('DOMContentLoaded', function() {
    loadSavedApiKey(); // Load saved API key
    updateAIStatus(); // Update AI status display
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Load sample data for demonstration
function loadSampleData() {
    accounts = [
        {
            accountNumber: "10001",
            name: "John Doe",
            age: 30,
            gender: "Male",
            accountType: "Savings",
            balance: 25000,
            phone: "+91-9876543210",
            createdDate: new Date('2024-01-15')
        },
        {
            accountNumber: "10002",
            name: "Jane Smith",
            age: 28,
            gender: "Female",
            accountType: "Current",
            balance: 45000,
            phone: "+91-9876543211",
            createdDate: new Date('2024-02-20')
        },
        {
            accountNumber: "10003",
            name: "Robert Johnson",
            age: 35,
            gender: "Male",
            accountType: "Savings",
            balance: 800,
            phone: "+91-9876543212",
            createdDate: new Date('2024-03-10')
        }
    ];

    transactions = [
        {
            accountNumber: "10001",
            type: "deposit",
            amount: 5000,
            description: "Salary deposit",
            date: new Date('2024-09-20'),
            balanceAfter: 25000
        },
        {
            accountNumber: "10002",
            type: "withdraw",
            amount: 2000,
            description: "ATM withdrawal",
            date: new Date('2024-09-22'),
            balanceAfter: 45000
        },
        {
            accountNumber: "10001",
            type: "withdraw",
            amount: 1000,
            description: "Online shopping",
            date: new Date('2024-09-23'),
            balanceAfter: 24000
        }
    ];

    accountCounter = 10004;
}

// ========================
// COMPREHENSIVE TRANSACTION MANAGEMENT FUNCTIONS
// ========================

// Verify account for deposit
function verifyAccountForDeposit() {
    const accountNumber = document.getElementById('deposit-account').value.trim();
    
    if (!accountNumber) {
        showMessage('Please enter account number', 'error');
        return;
    }

    const account = accounts.find(acc => acc.accountNumber === accountNumber);
    
    if (!account) {
        showMessage('Account not found', 'error');
        document.getElementById('deposit-account-info').style.display = 'none';
        return;
    }

    const verificationHTML = `
        <div class="verification-card success">
            <div class="verification-header">
                <i class="fas fa-check-circle"></i>
                <span>Account Verified</span>
            </div>
            <div class="verification-details">
                <div class="detail-row">
                    <span>Account Holder:</span>
                    <strong>${account.name}</strong>
                </div>
                <div class="detail-row">
                    <span>Account Type:</span>
                    <strong>${account.accountType}</strong>
                </div>
                <div class="detail-row">
                    <span>Current Balance:</span>
                    <strong>₹${account.balance.toLocaleString('en-IN')}</strong>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('deposit-account-info').innerHTML = verificationHTML;
    document.getElementById('deposit-account-info').style.display = 'block';
    verifiedAccounts.deposit = account;
    showMessage('Account verified successfully', 'success');
}

// Verify account for withdrawal
function verifyAccountForWithdraw() {
    const accountNumber = document.getElementById('withdraw-account').value.trim();
    
    if (!accountNumber) {
        showMessage('Please enter account number', 'error');
        return;
    }

    const account = accounts.find(acc => acc.accountNumber === accountNumber);
    
    if (!account) {
        showMessage('Account not found', 'error');
        document.getElementById('withdraw-account-info').style.display = 'none';
        return;
    }

    const verificationHTML = `
        <div class="verification-card ${account.balance < 1000 ? 'warning' : 'success'}">
            <div class="verification-header">
                <i class="fas fa-check-circle"></i>
                <span>Account Verified</span>
            </div>
            <div class="verification-details">
                <div class="detail-row">
                    <span>Account Holder:</span>
                    <strong>${account.name}</strong>
                </div>
                <div class="detail-row">
                    <span>Account Type:</span>
                    <strong>${account.accountType}</strong>
                </div>
                <div class="detail-row">
                    <span>Available Balance:</span>
                    <strong class="${account.balance < 1000 ? 'text-danger' : 'text-success'}">₹${account.balance.toLocaleString('en-IN')}</strong>
                </div>
                ${account.balance < 1000 ? `
                    <div class="detail-row">
                        <span class="text-warning">⚠️ Low Balance Warning</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.getElementById('withdraw-account-info').innerHTML = verificationHTML;
    document.getElementById('withdraw-account-info').style.display = 'block';
    verifiedAccounts.withdraw = account;
    checkWithdrawBalance();
    showMessage('Account verified successfully', 'success');
}

// Check withdrawal balance in real-time
function checkWithdrawBalance() {
    const account = verifiedAccounts.withdraw;
    const amountInput = document.getElementById('withdraw-amount');
    const balanceCheck = document.getElementById('withdraw-balance-check');
    const submitBtn = document.getElementById('withdraw-submit-btn');
    
    if (!account || !amountInput.value) {
        balanceCheck.style.display = 'none';
        submitBtn.disabled = true;
        return;
    }
    
    const requestedAmount = parseFloat(amountInput.value);
    const availableBalance = account.balance;
    const remainingBalance = availableBalance - requestedAmount;
    
    if (requestedAmount > availableBalance) {
        balanceCheck.innerHTML = `
            <div class="balance-error">
                <i class="fas fa-times-circle"></i>
                Insufficient balance! Short by ₹${(requestedAmount - availableBalance).toLocaleString('en-IN')}
            </div>
        `;
        balanceCheck.className = 'balance-indicator error';
        submitBtn.disabled = true;
    } else if (remainingBalance < 1000) {
        balanceCheck.innerHTML = `
            <div class="balance-warning">
                <i class="fas fa-exclamation-triangle"></i>
                Warning: Balance after withdrawal will be ₹${remainingBalance.toLocaleString('en-IN')} (Below minimum)
            </div>
        `;
        balanceCheck.className = 'balance-indicator warning';
        submitBtn.disabled = false;
    } else {
        balanceCheck.innerHTML = `
            <div class="balance-success">
                <i class="fas fa-check-circle"></i>
                Balance after withdrawal: ₹${remainingBalance.toLocaleString('en-IN')}
            </div>
        `;
        balanceCheck.className = 'balance-indicator success';
        submitBtn.disabled = false;
    }
    
    balanceCheck.style.display = 'block';
}

// Enhanced deposit money function
function depositMoney(event) {
    event.preventDefault();
    
    const accountNumber = document.getElementById('deposit-account').value.trim();
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    const transactionType = document.getElementById('deposit-type').value;
    const note = document.getElementById('deposit-note').value.trim();

    // Validation
    if (!accountNumber || !amount || !transactionType) {
        showMessage('Please fill all required fields', 'error');
        return;
    }

    if (amount <= 0) {
        showMessage('Amount must be greater than zero', 'error');
        return;
    }

    if (amount > 100000 && transactionType === 'Cash') {
        showMessage('Cash deposits over ₹1,00,000 require additional documentation', 'error');
        return;
    }

    const accountIndex = accounts.findIndex(acc => acc.accountNumber === accountNumber);
    
    if (accountIndex === -1) {
        showMessage('Account not found', 'error');
        return;
    }

    // Prepare transaction data
    const oldBalance = accounts[accountIndex].balance;
    const newBalance = oldBalance + amount;
    
    const transactionData = {
        accountNumber,
        type: 'Deposit',
        amount,
        transactionType,
        description: note || `${transactionType} deposit`,
        date: new Date(),
        balanceAfter: newBalance,
        transactionId: 'TXN' + Date.now()
    };

    // Show confirmation modal
    showTransactionModal('deposit', transactionData, accounts[accountIndex]);
}

// Enhanced withdraw money function
function withdrawMoney(event) {
    event.preventDefault();
    
    const accountNumber = document.getElementById('withdraw-account').value.trim();
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    const transactionType = document.getElementById('withdraw-type').value;
    const note = document.getElementById('withdraw-note').value.trim();

    // Validation
    if (!accountNumber || !amount || !transactionType) {
        showMessage('Please fill all required fields', 'error');
        return;
    }

    if (amount <= 0) {
        showMessage('Amount must be greater than zero', 'error');
        return;
    }

    const accountIndex = accounts.findIndex(acc => acc.accountNumber === accountNumber);
    
    if (accountIndex === -1) {
        showMessage('Account not found', 'error');
        return;
    }

    if (accounts[accountIndex].balance < amount) {
        showMessage(`Insufficient balance. Available: ₹${accounts[accountIndex].balance.toLocaleString('en-IN')}`, 'error');
        return;
    }

    // Check daily withdrawal limit
    const today = new Date().toDateString();
    const todayWithdrawals = transactions
        .filter(t => t.accountNumber === accountNumber && 
                     t.type === 'Withdrawal' && 
                     new Date(t.date).toDateString() === today)
        .reduce((sum, t) => sum + t.amount, 0);

    if (todayWithdrawals + amount > 25000) {
        showMessage('Daily withdrawal limit of ₹25,000 exceeded', 'error');
        return;
    }

    // Prepare transaction data
    const oldBalance = accounts[accountIndex].balance;
    const newBalance = oldBalance - amount;
    
    const transactionData = {
        accountNumber,
        type: 'Withdrawal',
        amount,
        transactionType,
        description: note || `${transactionType} withdrawal`,
        date: new Date(),
        balanceAfter: newBalance,
        transactionId: 'TXN' + Date.now()
    };

    // Show confirmation modal
    showTransactionModal('withdraw', transactionData, accounts[accountIndex]);
}

// Show transaction confirmation modal
function showTransactionModal(type, transactionData, account) {
    const modal = document.getElementById('confirmation-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const confirmBtn = document.getElementById('confirm-btn');

    title.textContent = `Confirm ${type === 'deposit' ? 'Deposit' : 'Withdrawal'}`;
    confirmBtn.className = `btn btn-${type === 'deposit' ? 'success' : 'danger'}`;
    confirmBtn.innerHTML = `<i class="fas fa-check"></i> Confirm ${type === 'deposit' ? 'Deposit' : 'Withdrawal'}`;

    const modalHTML = `
        <div class="transaction-confirmation">
            <div class="confirmation-header">
                <i class="fas fa-${type === 'deposit' ? 'plus-circle' : 'minus-circle'} ${type === 'deposit' ? 'text-success' : 'text-danger'}"></i>
                <h4>${type === 'deposit' ? 'Deposit' : 'Withdrawal'} Confirmation</h4>
            </div>
            
            <div class="confirmation-details">
                <div class="detail-section">
                    <h5>Account Information</h5>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span>Account Number:</span>
                            <strong>${account.accountNumber}</strong>
                        </div>
                        <div class="detail-item">
                            <span>Account Holder:</span>
                            <strong>${account.name}</strong>
                        </div>
                        <div class="detail-item">
                            <span>Account Type:</span>
                            <strong>${account.accountType}</strong>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h5>Transaction Details</h5>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span>Transaction Type:</span>
                            <strong>${transactionData.transactionType}</strong>
                        </div>
                        <div class="detail-item">
                            <span>Amount:</span>
                            <strong class="${type === 'deposit' ? 'text-success' : 'text-danger'}">
                                ${type === 'deposit' ? '+' : '-'}₹${transactionData.amount.toLocaleString('en-IN')}
                            </strong>
                        </div>
                        <div class="detail-item">
                            <span>Description:</span>
                            <strong>${transactionData.description}</strong>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section balance-summary">
                    <h5>Balance Summary</h5>
                    <div class="balance-flow">
                        <div class="balance-item">
                            <span>Current Balance:</span>
                            <strong>₹${account.balance.toLocaleString('en-IN')}</strong>
                        </div>
                        <div class="balance-arrow">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                        <div class="balance-item">
                            <span>Balance After:</span>
                            <strong class="${transactionData.balanceAfter < 1000 ? 'text-warning' : 'text-success'}">
                                ₹${transactionData.balanceAfter.toLocaleString('en-IN')}
                            </strong>
                        </div>
                    </div>
                    ${transactionData.balanceAfter < 1000 ? `
                        <div class="balance-warning">
                            <i class="fas fa-exclamation-triangle text-warning"></i>
                            <small>Warning: Balance will be below minimum requirement</small>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    body.innerHTML = modalHTML;
    currentTransactionData = transactionData;
    modal.style.display = 'block';
}

// Confirm transaction
function confirmTransaction() {
    if (!currentTransactionData) return;

    const accountIndex = accounts.findIndex(acc => acc.accountNumber === currentTransactionData.accountNumber);
    
    if (accountIndex === -1) {
        showMessage('Account not found', 'error');
        closeModal();
        return;
    }

    // Update account balance
    accounts[accountIndex].balance = currentTransactionData.balanceAfter;
    
    // Add transaction record
    transactions.push(currentTransactionData);

    // Show success message
    const successMessage = `
        ✅ Transaction Successful!
        
        Transaction ID: ${currentTransactionData.transactionId}
        Amount: ${currentTransactionData.type === 'Deposit' ? '+' : '-'}₹${currentTransactionData.amount.toLocaleString('en-IN')}
        New Balance: ₹${currentTransactionData.balanceAfter.toLocaleString('en-IN')}
    `;
    
    alert(successMessage);
    showMessage(`${currentTransactionData.type} of ₹${currentTransactionData.amount.toLocaleString('en-IN')} completed successfully`, 'success');

    // Reset forms and update stats
    if (currentTransactionData.type === 'Deposit') {
        resetDepositForm();
    } else {
        resetWithdrawForm();
    }
    
    updateTransactionStats();
    closeModal();
    currentTransactionData = {};
}

// Close modal
function closeModal() {
    document.getElementById('confirmation-modal').style.display = 'none';
    currentTransactionData = {};
}

// Reset deposit form
function resetDepositForm() {
    document.getElementById('deposit-account').value = '';
    document.getElementById('deposit-amount').value = '';
    document.getElementById('deposit-type').value = '';
    document.getElementById('deposit-note').value = '';
    document.getElementById('deposit-account-info').style.display = 'none';
    delete verifiedAccounts.deposit;
}

// Reset withdrawal form
function resetWithdrawForm() {
    document.getElementById('withdraw-account').value = '';
    document.getElementById('withdraw-amount').value = '';
    document.getElementById('withdraw-type').value = '';
    document.getElementById('withdraw-note').value = '';
    document.getElementById('withdraw-account-info').style.display = 'none';
    document.getElementById('withdraw-balance-check').style.display = 'none';
    document.getElementById('withdraw-submit-btn').disabled = true;
    delete verifiedAccounts.withdraw;
}

// Enhanced check balance function
function checkBalance() {
    const accountNumber = document.getElementById('balance-account').value.trim();
    
    if (!accountNumber) {
        showMessage('Please enter account number', 'error');
        return;
    }

    const account = accounts.find(acc => acc.accountNumber === accountNumber);
    
    if (!account) {
        showMessage('Account not found', 'error');
        document.getElementById('balance-result').innerHTML = '';
        document.getElementById('balance-actions').style.display = 'none';
        return;
    }

    // Get recent transactions
    const recentTransactions = transactions
        .filter(t => t.accountNumber === accountNumber)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    const balanceHTML = `
        <div class="balance-display-card">
            <div class="balance-header">
                <div class="balance-main">
                    <h2 class="${account.balance < 1000 ? 'text-warning' : 'text-success'}">
                        ₹${account.balance.toLocaleString('en-IN')}
                    </h2>
                    <p>Available Balance</p>
                    ${account.balance < 1000 ? '<span class="low-balance-badge">Low Balance</span>' : ''}
                </div>
                <div class="account-info">
                    <h4>${account.name}</h4>
                    <p>Account: ${account.accountNumber}</p>
                    <p>Type: ${account.accountType}</p>
                </div>
            </div>
            
            <div class="balance-stats">
                <div class="stat-item">
                    <i class="fas fa-calendar"></i>
                    <span>Account Age: ${Math.floor((new Date() - new Date(account.createdDate)) / (1000 * 60 * 60 * 24))} days</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-history"></i>
                    <span>Total Transactions: ${transactions.filter(t => t.accountNumber === accountNumber).length}</span>
                </div>
            </div>
            
            ${recentTransactions.length > 0 ? `
                <div class="recent-transactions">
                    <h5><i class="fas fa-clock"></i> Recent Transactions</h5>
                    <div class="mini-transaction-list">
                        ${recentTransactions.map(t => `
                            <div class="mini-transaction ${t.type.toLowerCase()}">
                                <div class="transaction-info">
                                    <span class="type">${t.type}</span>
                                    <small>${new Date(t.date).toLocaleDateString()}</small>
                                </div>
                                <span class="amount ${t.type === 'Deposit' ? 'credit' : 'debit'}">
                                    ${t.type === 'Deposit' ? '+' : '-'}₹${t.amount.toLocaleString('en-IN')}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('balance-result').innerHTML = balanceHTML;
    document.getElementById('balance-result').style.display = 'block';
    document.getElementById('balance-actions').style.display = 'block';
}

// Quick action functions
function quickDeposit() {
    const accountNumber = document.getElementById('balance-account').value.trim();
    showTransactionTab('deposit');
    document.getElementById('deposit-account').value = accountNumber;
    verifyAccountForDeposit();
}

function quickWithdraw() {
    const accountNumber = document.getElementById('balance-account').value.trim();
    showTransactionTab('withdraw');
    document.getElementById('withdraw-account').value = accountNumber;
    verifyAccountForWithdraw();
}

function viewFullHistory() {
    const accountNumber = document.getElementById('balance-account').value.trim();
    showTransactionTab('history');
    document.getElementById('history-account').value = accountNumber;
    filterTransactionHistory();
}

function printBalanceStatement() {
    const accountNumber = document.getElementById('balance-account').value.trim();
    const account = accounts.find(acc => acc.accountNumber === accountNumber);
    
    if (!account) return;
    
    const accountTransactions = transactions
        .filter(t => t.accountNumber === accountNumber)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Balance Statement - ${account.accountNumber}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                    .account-info { margin-bottom: 20px; }
                    .balance { font-size: 24px; font-weight: bold; color: #2c5aa0; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                    th { background-color: #f5f5f5; }
                    .credit { color: green; }
                    .debit { color: red; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>SecureBank</h1>
                    <h2>Balance Statement</h2>
                </div>
                
                <div class="account-info">
                    <p><strong>Account Holder:</strong> ${account.name}</p>
                    <p><strong>Account Number:</strong> ${account.accountNumber}</p>
                    <p><strong>Account Type:</strong> ${account.accountType}</p>
                    <p><strong>Statement Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p class="balance"><strong>Current Balance:</strong> ₹${account.balance.toLocaleString('en-IN')}</p>
                </div>
                
                ${accountTransactions.length > 0 ? `
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Transaction Type</th>
                                <th>Description</th>
                                <th>Debit</th>
                                <th>Credit</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${accountTransactions.map(t => `
                                <tr>
                                    <td>${new Date(t.date).toLocaleDateString()}</td>
                                    <td>${t.transactionType || t.type}</td>
                                    <td>${t.description}</td>
                                    <td class="debit">${t.type === 'Withdrawal' ? '₹' + t.amount.toLocaleString('en-IN') : '-'}</td>
                                    <td class="credit">${t.type === 'Deposit' ? '₹' + t.amount.toLocaleString('en-IN') : '-'}</td>
                                    <td>₹${t.balanceAfter.toLocaleString('en-IN')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p>No transactions found.</p>'}
                
                <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
                    <p>This is a computer-generated statement and does not require a signature.</p>
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Transaction history with advanced filtering
function filterTransactionHistory() {
    const accountNumber = document.getElementById('history-account').value.trim();
    const transactionType = document.getElementById('history-type').value;
    const fromDate = document.getElementById('history-from').value;
    const toDate = document.getElementById('history-to').value;
    
    let filteredTransactions = transactions;
    
    // Filter by account number
    if (accountNumber) {
        filteredTransactions = filteredTransactions.filter(t => t.accountNumber === accountNumber);
        
        // Verify account exists
        const account = accounts.find(acc => acc.accountNumber === accountNumber);
        if (!account) {
            showMessage('Account not found', 'error');
            return;
        }
    }
    
    // Filter by transaction type
    if (transactionType) {
        filteredTransactions = filteredTransactions.filter(t => t.type === transactionType);
    }
    
    // Filter by date range
    if (fromDate) {
        filteredTransactions = filteredTransactions.filter(t => 
            new Date(t.date) >= new Date(fromDate)
        );
    }
    
    if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        filteredTransactions = filteredTransactions.filter(t => 
            new Date(t.date) <= endDate
        );
    }
    
    displayTransactionHistory(filteredTransactions);
}

// Display transaction history
function displayTransactionHistory(transactionList) {
    const container = document.getElementById('transaction-history-results');
    
    if (transactionList.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <i class="fas fa-search"></i>
                <p>No transactions found for the selected criteria</p>
            </div>
        `;
        return;
    }
    
    // Sort by date (newest first)
    const sortedTransactions = transactionList.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate totals
    const totalDeposits = sortedTransactions
        .filter(t => t.type === 'Deposit')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalWithdrawals = sortedTransactions
        .filter(t => t.type === 'Withdrawal')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const historyHTML = `
        <div class="history-summary">
            <h4><i class="fas fa-chart-line"></i> Transaction Summary</h4>
            <div class="summary-stats">
                <div class="summary-stat">
                    <span class="stat-label">Total Transactions:</span>
                    <span class="stat-value">${sortedTransactions.length}</span>
                </div>
                <div class="summary-stat credit">
                    <span class="stat-label">Total Deposits:</span>
                    <span class="stat-value">₹${totalDeposits.toLocaleString('en-IN')}</span>
                </div>
                <div class="summary-stat debit">
                    <span class="stat-label">Total Withdrawals:</span>
                    <span class="stat-value">₹${totalWithdrawals.toLocaleString('en-IN')}</span>
                </div>
                <div class="summary-stat">
                    <span class="stat-label">Net Amount:</span>
                    <span class="stat-value ${(totalDeposits - totalWithdrawals) >= 0 ? 'credit' : 'debit'}">
                        ₹${Math.abs(totalDeposits - totalWithdrawals).toLocaleString('en-IN')}
                        ${(totalDeposits - totalWithdrawals) >= 0 ? '(Credit)' : '(Debit)'}
                    </span>
                </div>
            </div>
        </div>
        
        <div class="transaction-list">
            ${sortedTransactions.map(transaction => {
                const account = accounts.find(acc => acc.accountNumber === transaction.accountNumber);
                return `
                    <div class="transaction-item ${transaction.type.toLowerCase()}">
                        <div class="transaction-header">
                            <div class="transaction-type">
                                <i class="fas fa-${transaction.type === 'Deposit' ? 'plus-circle text-success' : 'minus-circle text-danger'}"></i>
                                <strong>${transaction.type.toUpperCase()}</strong>
                            </div>
                            <div class="transaction-amount ${transaction.type === 'Deposit' ? 'credit' : 'debit'}">
                                ${transaction.type === 'Deposit' ? '+' : '-'}₹${transaction.amount.toLocaleString('en-IN')}
                            </div>
                        </div>
                        <div class="transaction-details">
                            <div class="detail-row">
                                <span><i class="fas fa-user"></i> Account Holder:</span>
                                <strong>${account ? account.name : 'Unknown'}</strong>
                            </div>
                            <div class="detail-row">
                                <span><i class="fas fa-id-card"></i> Account Number:</span>
                                <strong>${transaction.accountNumber}</strong>
                            </div>
                            <div class="detail-row">
                                <span><i class="fas fa-tag"></i> Transaction Type:</span>
                                <strong>${transaction.transactionType || transaction.type}</strong>
                            </div>
                            <div class="detail-row">
                                <span><i class="fas fa-calendar"></i> Date & Time:</span>
                                <strong>${new Date(transaction.date).toLocaleString()}</strong>
                            </div>
                            <div class="detail-row">
                                <span><i class="fas fa-comment"></i> Description:</span>
                                <strong>${transaction.description}</strong>
                            </div>
                            <div class="detail-row">
                                <span><i class="fas fa-wallet"></i> Balance After:</span>
                                <strong>₹${transaction.balanceAfter.toLocaleString('en-IN')}</strong>
                            </div>
                            ${transaction.transactionId ? `
                                <div class="detail-row">
                                    <span><i class="fas fa-receipt"></i> Transaction ID:</span>
                                    <strong>${transaction.transactionId}</strong>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    container.innerHTML = historyHTML;
}

// Clear history filters
function clearHistoryFilters() {
    document.getElementById('history-account').value = '';
    document.getElementById('history-type').value = '';
    document.getElementById('history-from').value = '';
    document.getElementById('history-to').value = '';
    
    document.getElementById('transaction-history-results').innerHTML = `
        <div class="no-data">
            <i class="fas fa-search"></i>
            <p>Use the filters above to view transaction history</p>
        </div>
    `;
    
    showMessage('Filters cleared', 'info');
}

// Export transaction history to CSV
function exportTransactionHistory() {
    const accountNumber = document.getElementById('history-account').value.trim();
    const transactionType = document.getElementById('history-type').value;
    const fromDate = document.getElementById('history-from').value;
    const toDate = document.getElementById('history-to').value;
    
    let filteredTransactions = transactions;
    
    // Apply same filters as display
    if (accountNumber) {
        filteredTransactions = filteredTransactions.filter(t => t.accountNumber === accountNumber);
    }
    if (transactionType) {
        filteredTransactions = filteredTransactions.filter(t => t.type === transactionType);
    }
    if (fromDate) {
        filteredTransactions = filteredTransactions.filter(t => 
            new Date(t.date) >= new Date(fromDate)
        );
    }
    if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        filteredTransactions = filteredTransactions.filter(t => 
            new Date(t.date) <= endDate
        );
    }
    
    if (filteredTransactions.length === 0) {
        showMessage('No transactions to export', 'error');
        return;
    }
    
    // Create CSV content
    const csvHeader = 'Date,Account Number,Account Holder,Transaction Type,Amount,Description,Balance After,Transaction ID\n';
    const csvContent = filteredTransactions.map(t => {
        const account = accounts.find(acc => acc.accountNumber === t.accountNumber);
        return [
            new Date(t.date).toLocaleDateString(),
            t.accountNumber,
            account ? account.name : 'Unknown',
            t.type,
            t.amount,
            `"${t.description}"`,
            t.balanceAfter,
            t.transactionId || ''
        ].join(',');
    }).join('\n');
    
    // Create and download file
    const blob = new Blob([csvHeader + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transaction_history_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    showMessage(`Exported ${filteredTransactions.length} transactions to CSV`, 'success');
}

// Load recent transactions for page initialization
function loadRecentTransactions() {
    const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
    
    // You can display these on the main transaction page if needed
    console.log('Recent transactions loaded:', recentTransactions.length);
}

// Update transaction statistics function (used by transactions page)
function updateTransactionStats() {
    const todayTransactions = transactions.filter(t => {
        const today = new Date();
        const transDate = new Date(t.date);
        return transDate.toDateString() === today.toDateString();
    });

    let totalDeposits = 0;
    let totalWithdrawals = 0;
    
    todayTransactions.forEach(transaction => {
        if (transaction.type === 'Deposit') {
            totalDeposits += parseFloat(transaction.amount);
        } else if (transaction.type === 'Withdrawal') {
            totalWithdrawals += parseFloat(transaction.amount);
        }
    });

    const totalBankBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
    
    // Update transaction page stats if elements exist
    const totalTransactionsEl = document.getElementById('total-transactions');
    const totalDepositsEl = document.getElementById('total-deposits');
    const totalWithdrawalsEl = document.getElementById('total-withdrawals');
    const totalBankBalanceEl = document.getElementById('total-bank-balance');
    
    if (totalTransactionsEl) totalTransactionsEl.textContent = transactions.length;
    if (totalDepositsEl) totalDepositsEl.textContent = '₹' + totalDeposits.toLocaleString('en-IN');
    if (totalWithdrawalsEl) totalWithdrawalsEl.textContent = '₹' + totalWithdrawals.toLocaleString('en-IN');
    if (totalBankBalanceEl) totalBankBalanceEl.textContent = '₹' + totalBankBalance.toLocaleString('en-IN');
}

// Authentication Functions
function checkAuthentication() {
    const currentUser = localStorage.getItem('current_user');
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    
    // Update user display
    const user = JSON.parse(currentUser);
    const userNameEl = document.getElementById('current-user-name');
    if (userNameEl) {
        userNameEl.textContent = user.fullname || user.username;
    }
    
    // Ensure user menu is visible
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.style.display = 'inline-block';
        userMenu.style.visibility = 'visible';
        userMenu.style.opacity = '1';
    }
    
    return true;
}

function toggleUserMenu(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        const isVisible = dropdown.classList.contains('show');
        if (isVisible) {
            dropdown.classList.remove('show');
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 300);
        } else {
            dropdown.style.display = 'block';
            setTimeout(() => {
                dropdown.classList.add('show');
            }, 10);
        }
    }
}

function logout() {
    // Clear authentication data
    localStorage.removeItem('current_user');
    localStorage.removeItem('remember_login');
    
    // Show logout message
    if (typeof showNotification === 'function') {
        showNotification('You have been logged out successfully', 'info');
    }
    
    // Redirect to login page after a short delay
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Close user dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('user-dropdown');
    
    if (userMenu && dropdown && !userMenu.contains(event.target)) {
        dropdown.classList.remove('show');
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 300);
    }
});

// Prevent dropdown from closing when clicking inside it
document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
});

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
});