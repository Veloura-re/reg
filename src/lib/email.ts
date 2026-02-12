import { Resend } from "resend";

const getResend = () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey && process.env.NODE_ENV === "production") {
        console.warn("RESEND_API_KEY is missing in production environment.");
    }
    return new Resend(apiKey || "dummy_key");
};

export async function sendResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${token}`;
    const resend = getResend();

    try {
        if (!process.env.RESEND_API_KEY) {
            console.log("Mocking email send (No API Key):", resetUrl);
            return { success: true };
        }
        await resend.emails.send({
            from: "Admin Terminal <noreply@resend.dev>", // Replace with your verified domain in production
            to: email,
            subject: "Access Recovery Protocol | Admin Terminal",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 40px; color: #111827;">
                    <div style="max-width: 600px; margin: 0 auto; bg-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <div style="background-color: #001a3d; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px;">ADMIN TERMINAL</h1>
                        </div>
                        <div style="padding: 40px;">
                            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Access Recovery Initiated</h2>
                            <p style="line-height: 1.6; margin-bottom: 30px;">An access recovery protocol was triggered for this identity relay. If you did not initiate this, please disregard this message.</p>
                            <div style="text-align: center; margin-bottom: 30px;">
                                <a href="${resetUrl}" style="background-color: #001a3d; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">ACTIVATE RECOVERY LINK</a>
                            </div>
                            <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">This recovery link will expire in 1 hour. For security reasons, it can only be used once.</p>
                        </div>
                        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
                            <p>© ${new Date().getFullYear()} ADMIN TERMINAL | SECURE NODE ACCESS</p>
                        </div>
                    </div>
                </div>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error("Email delivery failed:", error);
        return { success: false, error };
    }
}
