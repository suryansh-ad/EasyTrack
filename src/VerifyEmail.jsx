import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { account } from "./appwrite";
import "./AuthPage.css";

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");
    const sent = searchParams.get("sent");
    const pending = searchParams.get("pending");

    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        async function verify() {
            if (!userId || !secret) return;
            setVerifying(true);
            setNotice("");
            setError("");
            try {
                await account.updateVerification(userId, secret);
                setNotice("Email verified. You can now log in.");
            } catch (err) {
                setError(err.message || "Verification failed.");
            } finally {
                setVerifying(false);
            }
        }
        verify();
    }, [userId, secret]);

    async function resend() {
        setNotice("");
        setError("");
        try {
            await account.get();
            const redirect = `${window.location.origin}/verify-email`;
            await account.createVerification(redirect);
            setNotice("Verification email sent. Check your inbox.");
        } catch (err) {
            setError("Please log in to resend the verification email.");
        }
    }

    return (
        <div className="authPage">
            <div className="authCard">
                <div className="authHeader">
                    <div className="authBadge">Verify email</div>
                    <h1>Confirm your email</h1>
                    <p>We sent you a verification link to confirm your account.</p>
                </div>

                <div className="authForm">
                    {verifying && <div className="authNotice">Verifying...</div>}
                    {sent && !verifying && !notice && !error && (
                        <div className="authNotice">Verification email sent. Check your inbox.</div>
                    )}
                    {pending && !verifying && !notice && !error && (
                        <div className="authNotice">Please verify your email to continue.</div>
                    )}
                    {notice && <div className="authNotice">{notice}</div>}
                    {error && <div className="authError">{error}</div>}

                    <button type="button" className="authPrimary" onClick={resend}>
                        Resend verification email
                    </button>
                    <button type="button" className="authLinkInline" onClick={() => navigate("/auth")}>
                        Back to login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;
