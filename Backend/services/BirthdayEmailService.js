const nodemailer = require("nodemailer");
const User = require("../Models/UserModel");
require("dotenv").config();

const Email = process.env.MAIL_USER;
const passKey = process.env.PASS_KEY;

// In-memory cache to prevent duplicate emails (resets daily)
const sentBirthdayEmails = new Set();

// Email transporter setup (reusing existing configuration)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: Email,
        pass: passKey,
    },
});

/**
 * Get all users whose birthday is today (matching day and month only)
 * @returns {Promise<Array>} Array of users with birthdays today
 */
async function getTodaysBirthdays() {
    try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
        const currentDay = today.getDate();

        console.log(`[Birthday Service] Checking for birthdays on ${currentMonth}/${currentDay}`);

        // Fetch all users from database
        const allUsers = await User.find({}).select("first_name last_name email dateOfBirth");

        // Filter users whose birthday matches today (day and month only)
        const birthdayUsers = allUsers.filter((user) => {
            if (!user.dateOfBirth) return false;

            // Parse dateOfBirth (expected format: YYYY-MM-DD)
            const birthDate = new Date(user.dateOfBirth);
            const birthMonth = birthDate.getMonth() + 1;
            const birthDay = birthDate.getDate();

            return birthMonth === currentMonth && birthDay === currentDay;
        });

        console.log(`[Birthday Service] Found ${birthdayUsers.length} user(s) with birthdays today`);
        return birthdayUsers;
    } catch (error) {
        console.error("[Birthday Service] Error fetching birthdays:", error);
        return [];
    }
}

/**
 * Send birthday email to a single user
 * @param {Object} user - User object with email and first_name
 * @returns {Promise<boolean>} True if email sent successfully
 */
async function sendBirthdayEmail(user) {
    try {
        const mailOptions = {
            from: Email,
            to: user.email,
            subject: "🎉 Happy Birthday!",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🎉 Happy Birthday! 🎉</h1>
          </div>
          
          <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
              Dear <strong>${user.first_name}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              Wishing you a fantastic birthday filled with joy, laughter, and wonderful moments! 🎂🎈
            </p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              Thank you for being a valued member of our community. We hope this year brings you success, happiness, and all the things you've been dreaming of!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; border-radius: 25px; font-size: 18px; font-weight: bold;">
                🎁 Enjoy Your Special Day! 🎁
              </div>
            </div>
            
            <p style="font-size: 14px; color: #888; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              Best wishes,<br>
              <strong>MMDC Team</strong>
            </p>
          </div>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`[Birthday Service] ✅ Birthday email sent successfully to ${user.email}`);
        return true;
    } catch (error) {
        console.error(`[Birthday Service] ❌ Failed to send birthday email to ${user.email}:`, error.message);
        return false;
    }
}

/**
 * Main function to process birthday emails
 * Fetches users with birthdays today and sends emails
 */
async function processBirthdayEmails() {
    console.log("\n========================================");
    console.log("[Birthday Service] Starting birthday email process...");
    console.log("========================================\n");

    try {
        // Get users with birthdays today
        const birthdayUsers = await getTodaysBirthdays();

        if (birthdayUsers.length === 0) {
            console.log("[Birthday Service] No birthdays today. Process complete.\n");
            return;
        }

        let successCount = 0;
        let failureCount = 0;
        let skippedCount = 0;

        // Send emails to each user
        for (const user of birthdayUsers) {
            const cacheKey = `${user.email}-${new Date().toDateString()}`;

            // Check if email already sent today (duplicate prevention)
            if (sentBirthdayEmails.has(cacheKey)) {
                console.log(`[Birthday Service] ⏭️  Skipped ${user.email} (already sent today)`);
                skippedCount++;
                continue;
            }

            // Send email
            const success = await sendBirthdayEmail(user);

            if (success) {
                sentBirthdayEmails.add(cacheKey);
                successCount++;
            } else {
                failureCount++;
            }

            // Small delay to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Log summary
        console.log("\n========================================");
        console.log("[Birthday Service] Summary:");
        console.log(`  Total birthdays found: ${birthdayUsers.length}`);
        console.log(`  ✅ Successfully sent: ${successCount}`);
        console.log(`  ❌ Failed: ${failureCount}`);
        console.log(`  ⏭️  Skipped (duplicates): ${skippedCount}`);
        console.log("========================================\n");
    } catch (error) {
        console.error("[Birthday Service] ❌ Error processing birthday emails:", error);
    }
}

/**
 * Clear the sent emails cache (called daily to reset)
 */
function clearDailyCache() {
    const previousSize = sentBirthdayEmails.size;
    sentBirthdayEmails.clear();
    console.log(`[Birthday Service] 🔄 Daily cache cleared (${previousSize} entries removed)`);
}

module.exports = {
    processBirthdayEmails,
    getTodaysBirthdays,
    sendBirthdayEmail,
    clearDailyCache,
};
