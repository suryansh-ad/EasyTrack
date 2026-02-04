import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { account } from "./appwrite";
import "./AuthPage.css";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");

    async function handleReset(e) {
        e.preventDefault();
        setNotice("");
        setError("");
        if (!password || !confirm) {
            setError("Please fill in both password fields.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (!userId || !secret) {
            setError("Invalid or expired reset link.");
            return;
        }
        try {
            await account.updateRecovery(userId, secret, password, confirm);
            setNotice("Password updated. You can now log in.");
            setTimeout(() => navigate("/auth"), 1200);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="authPage">
            <div className="authCard">
                <div className="authHeader">
                    <div className="authBadge">Reset password</div>
                    <h1>Set a new password</h1>
                    <p>Choose a strong password you will remember.</p>
                </div>

                <form className="authForm" onSubmit={handleReset}>
                    <label>New password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" />
                    <label>Confirm password</label>
                    <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" />
                    {notice && <div className="authNotice">{notice}</div>}
                    {error && <div className="authError">{error}</div>}
                    <button type="submit" className="authPrimary">Update password</button>
                    <button type="button" className="authLinkInline" onClick={() => navigate("/auth")}>
                        Back to login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
