const cron = require("node-cron");
const { processBirthdayEmails, clearDailyCache } = require("../services/BirthdayEmailService");

/**
 * Initialize the birthday email scheduler
 * Runs daily at 9:00 AM to check for birthdays and send emails
 */
function initializeBirthdayScheduler() {
    console.log("[Birthday Scheduler] Initializing birthday email scheduler...");

    // Schedule: Run every day at 9:00 AM
    // Cron format: '0 9 * * *'
    // - Minute: 0
    // - Hour: 9
    // - Day of Month: * (every day)
    // - Month: * (every month)
    // - Day of Week: * (every day of week)

    cron.schedule("0 9 * * *", async () => {
        const now = new Date();
        console.log(`\n[Birthday Scheduler] Triggered at ${now.toLocaleString()}`);

        try {
            // Clear yesterday's cache before processing today's birthdays
            clearDailyCache();

            // Process birthday emails
            await processBirthdayEmails();

            console.log(`[Birthday Scheduler] Completed at ${new Date().toLocaleString()}\n`);
        } catch (error) {
            console.error("[Birthday Scheduler] ❌ Error during scheduled run:", error);
        }
    });

    console.log("[Birthday Scheduler] ✅ Birthday email scheduler initialized successfully!");
    console.log("[Birthday Scheduler] Schedule: Daily at 9:00 AM");
    console.log("[Birthday Scheduler] Next run will check for birthdays and send emails automatically.\n");
}

module.exports = { initializeBirthdayScheduler };
