// ✅ Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ Function to send logs to Flask (command prompt)
const logToBackend = (message, isError = false) => {
    console.log(message); // ✅ Log in the browser console for debugging
    fetch("/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, isError }),
    }).catch(error => console.error("[ERROR] Failed to send log to backend:", error));
};

// ✅ Step 1: Confirm JavaScript Execution
logToBackend("[DEBUG] app.js is loaded and executing.");

// ✅ Step 2: Wait for full page load before running scripts
window.onload = async () => {
    logToBackend("[DEBUG] Window fully loaded. Fetching Firebase config...");

    try {
        const response = await fetch("/firebase-config");
        if (!response.ok) throw new Error("Failed to load Firebase config.");
        const firebaseConfig = await response.json();
        logToBackend("[DEBUG] Firebase config loaded successfully.");

        // ✅ Step 3: Initialize Firebase
        const app = initializeApp(firebaseConfig);
        logToBackend("[DEBUG] Firebase initialized.");

        const auth = getAuth(app);
        logToBackend("[DEBUG] Firebase Auth initialized.");

        // ✅ Attach Global Event Listeners
        document.getElementById("login-btn").onclick = () => handleLogin(auth);
        document.getElementById("signup-btn").onclick = () => handleSignup(auth);
        document.getElementById("google-login").onclick = () => handleGoogleLogin(auth);
        document.getElementById("microsoft-login").onclick = () => handleMicrosoftLogin(auth);
        document.getElementById("logout-btn").onclick = () => handleLogout(auth);


    } catch (error) {
        logToBackend("[ERROR] Failed to load Firebase config: " + error, true);
    }
};

// ✅ Authentication Handlers
const handleLogin = async (auth) => {
    alert("✅ Login button clicked!");
    logToBackend("[DEBUG] Login button clicked.");

    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    if (!email || !password) {
        logToBackend("[ERROR] Missing email or password.", true);
        alert("Please enter email and password.");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        logToBackend(`[DEBUG] Login successful! User ID: ${user.uid}`);

        // ✅ Ensure the user is authenticated before redirecting
        auth.onAuthStateChanged((loggedInUser) => {
            if (loggedInUser) {
                logToBackend("[DEBUG] Auth state changed - user is logged in. Redirecting...");
                window.location.href = "/chatbot";
            } else {
                logToBackend("[ERROR] Auth state change detected but no user found.", true);
                alert("Login failed: No authenticated user detected.");
            }
        });
    } catch (error) {
        logToBackend("[ERROR] Firebase login failed: " + error.message, true);
        alert("Login failed: " + error.message);
    }
};

const handleSignup = async (auth) => {
    alert("✅ Sign-up button clicked!");
    logToBackend("[DEBUG] Sign-up button clicked.");

    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    if (!email || !password) {
        logToBackend("[ERROR] Missing email or password.", true);
        alert("Please enter email and password.");
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        logToBackend("[DEBUG] Sign-up successful!");
        window.location.href = "/chatbot";
    } catch (error) {
        logToBackend("[ERROR] Firebase sign-up failed: " + error.message, true);
        alert("Sign-up failed: " + error.message);
    }
};

const handleGoogleLogin = async (auth) => {
    alert("✅ Google login button clicked!");
    logToBackend("[DEBUG] Google login button clicked.");
    const provider = new GoogleAuthProvider();

    try {
        await signInWithPopup(auth, provider);
        logToBackend("[DEBUG] Google sign-in successful!");
        window.location.href = "/chatbot";
    } catch (error) {
        logToBackend("[ERROR] Google sign-in failed: " + error.message, true);
        alert("Google login failed: " + error.message);
    }
};

const handleMicrosoftLogin = async (auth) => {
    alert("✅ Microsoft login button clicked!");
    logToBackend("[DEBUG] Microsoft login button clicked.");
    const provider = new OAuthProvider("microsoft.com");

    try {
        await signInWithPopup(auth, provider);
        logToBackend("[DEBUG] Microsoft sign-in successful!");
        window.location.href = "/chatbot";
    } catch (error) {
        logToBackend("[ERROR] Microsoft sign-in failed: " + error.message, true);
        alert("Microsoft login failed: " + error.message);
    }
};

const handleLogout = async (auth) => {
    alert("✅ Logout button clicked!");
    logToBackend("[DEBUG] Logout button clicked.");
    
    try {
        await signOut(auth);
        logToBackend("[DEBUG] Sign-out successful.");
        window.location.href = "/";
    } catch (error) {
        logToBackend("[ERROR] Logout failed: " + error.message, true);
    }
};
