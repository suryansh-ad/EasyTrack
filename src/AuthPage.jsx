import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { account, ID } from "./appwrite.js";
import "./AuthPage.css";
//LEFT FEATURES :
// PASSWORD HIDE

function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [isLoginText, setIsLoginText] = useState("Login");
    const [isLogin, setIsLogin] = useState(true);
    const [isForgot, setIsForgot] = useState(false);
    const [resetNotice, setResetNotice] = useState("");
    const [resetError, setResetError] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        async function checkSession() {
            const res = await account.get();
            if (!res) {
                console.log("No current session exists");
            } else {
                navigate("/");
                console.log("SESSION EXISTS!");
            }
        }
        checkSession();
        console.log("CheckSession useEffect called!");
    }, []);

    useEffect(() => {
        const mode = searchParams.get("mode");
        if (mode === "signup") {
            setIsLogin(false);
            setIsLoginText("Signup");
            setIsForgot(false);
        } else if (mode === "login") {
            setIsLogin(true);
            setIsLoginText("Login");
            setIsForgot(false);
        }
    }, [searchParams]);

    async function login() {
        try {
            console.log("Button pressed!");
            const session = await account.createEmailPasswordSession(email, password);
            const user = await account.get();
            if (!user.emailVerification) {
                navigate("/verify-email?pending=1");
                return;
            }
            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    }

    async function handleSignin() {
        if (!userName || !email || !password) {
            alert("All fields are required!");
        } else {
            try {
                const response = await account.create(ID.unique(), email, password, userName);
                await account.createEmailPasswordSession(email, password);
                const redirect = `${window.location.origin}/verify-email`;
                await account.createVerification(redirect);
                console.log("USER CREATED!  : ", response);
                navigate("/verify-email?sent=1");
            } catch (error) {
                alert(error.message);
            }
        }
    }

    function handleGoogleLogin() {
        const success = `${window.location.origin}/`;
        const failure = `${window.location.origin}/auth`;
        account.createOAuth2Session("google", success, failure);
    }

    async function handleForgotPassword() {
        setResetNotice("");
        setResetError("");
        if (!email) {
            setResetError("Please enter your email address.");
            return;
        }
        try {
            const redirect = `${window.location.origin}/reset-password`;
            await account.createRecovery(email, redirect);
            setResetNotice("Password reset email sent. Check your inbox.");
        } catch (error) {
            setResetError(error.message);
        }
    }

    function changeAuth() {
        if (isLoginText == "Login") {
            setIsLoginText("Signup");
            setIsLogin(false);
            setIsForgot(false);
        } else {
            setIsLoginText("Login");
            setIsLogin(true);
        }
    }

    return (
        <div className="authPage">
            <div className="authCard">
                <div className="authHeader">
                    <div className="authBadge">{isLogin ? "Welcome back" : "Create account"}</div>
                    <h1>{isLogin ? "Login" : "Sign up"}</h1>
                    <p>{isLogin ? "Access your classes and track progress." : "Start organizing your syllabus in minutes."}</p>
                </div>

                <div className="authTabs">
                    <button className={`authTab ${isLogin ? "active" : ""}`} onClick={() => { setIsLogin(true); setIsLoginText("Login"); }}>Login</button>
                    <button className={`authTab ${!isLogin ? "active" : ""}`} onClick={() => { setIsLogin(false); setIsLoginText("Signup"); }}>Sign up</button>
                </div>

                <button className="authOAuthBtn" onClick={handleGoogleLogin}>
                    <span className="authGoogleDot">G</span>
                    Continue with Google
                </button>
                <div className="authDivider">
                    <span>or</span>
                </div>

                {isLogin ? (
                    isForgot ? (
                        <form className="authForm" onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
                            <label>Email</label>
                            <input type="email" autoComplete="on" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                            {resetNotice && <div className="authNotice">{resetNotice}</div>}
                            {resetError && <div className="authError">{resetError}</div>}
                            <button type="submit" className="authPrimary">Send reset link</button>
                            <button type="button" className="authLinkInline" onClick={() => { setIsForgot(false); setResetNotice(""); setResetError(""); }}>
                                Back to login
                            </button>
                        </form>
                    ) : (
                        <form className="authForm" onSubmit={(e) => { e.preventDefault(); login(); }}>
                            <label>Email</label>
                            <input type="email" autoComplete="on" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                            <label>Password</label>
                            <input type="password" autoComplete="on" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button type="button" className="authLinkInline" onClick={() => { setIsForgot(true); setResetNotice(""); setResetError(""); }}>
                                Forgot password?
                            </button>
                            <button type="submit" className="authPrimary">Login</button>
                        </form>
                    )
                ) : (
                    <form className="authForm" onSubmit={(e) => { e.preventDefault(); handleSignin(); }}>
                        <label>Full name</label>
                        <input type="text" value={userName} autoComplete="on" onChange={(e) => setUserName(e.target.value)} placeholder="John Doe" />
                        <label>Email</label>
                        <input type="email" autoComplete="on" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@gmail.com" />
                        <label>Password</label>
                        <input type="password" autoComplete="on" value={password} onChange={(e) => { setPassword(e.target.value); }} placeholder="Create a password" />
                        <button type="submit" className="authPrimary">Create account</button>
                    </form>
                )}

                <div className="authFooter">
                    <span>{isLogin ? "New here?" : "Already have an account?"}</span>
                    <button className="authLink" onClick={changeAuth}>
                        {isLogin ? "Create an account" : "Login instead"}
                    </button>
                </div>
            </div>
        </div>
    );
}
export default AuthPage;
