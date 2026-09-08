# Run2Win — UI Build

This is a **presentation-only** copy of 3 screens (Home, Buy Tickets, Wallet) for
client walkthroughs before the project is paid for. It is intentionally incomplete:

- No database, no `.env`, no server — every number on screen is hardcoded in the
  page files under `app/`.
- No authentication/login — the header is static.
- No payment gateway — "Buy" shows a notice instead of opening Razorpay.
- No withdrawal processing — "Request Withdrawal" shows a notice instead of
  submitting anywhere.
- None of the real project's `lib/` business logic (spin scheduling, draw
  selection, prize-tier rules, wallet ledger, Razorpay integration) is present in
  this folder at all — there's nothing here to reverse-engineer.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — it redirects to `/home`. `/purchase` and
`/wallet` are reachable from the header nav.

## Do not

- Don't point this at production data or a real payment key.
- Don't hand out the main `run_2_win` repository alongside this — only this
  folder is meant to be shared pre-payment.
# run-2-win

Run2Win – Android App Setup Guide

Steps required to set up the project on a new system after receiving the updated code.


# 1. Install Prerequisites

Node.js and npm

Java JDK 17 or 21

Android Studio

Android SDK

Android SDK Platform-Tools

# 2. Get the Project

Clone the repository or extract the project ZIP, then open the project directory:

cd /opt/projects/run-2-win

# 3. Install Node Dependencies

npm install

# 4. Build the Next.js Application

npm run build

This generates the out/ folder used by the Android application.

# 5. Sync the Android Project

npx cap sync android

If the android/ folder is not included in the shared project, run these once:

npx cap add android
npx cap sync android

# 6. Configure Java

Check the installed Java version:

java -version

Java 17 or 21 should be used. If required, set JAVA_HOME:

export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"

Verify again:

java -version

# 7. Open the Android Project

Run:

npx cap open android

Or open the android/ folder directly in Android Studio.

# 8. Android Studio Setup

Allow Gradle sync to complete.

If Android Studio asks which JVM to use, select JDK 21.

Wait until the project finishes syncing/building successfully.

# 9. Connect an Android Phone

Enable Developer Options on the phone.

Enable USB Debugging.

Connect the phone to the computer using USB.

Check the connection:

adb devices

The phone should appear as a device. If it shows unauthorized, accept the USB debugging permission on the phone.

# 10. Run the App

Select the connected phone (or an Android emulator) in Android Studio.

Click Run ▶.

Android Studio installs the application.

Run2Win opens as an Android app.

For Future Code Updates

After pulling the latest code, normally run:

npm install
npm run build
npx cap sync android

Then open/run the Android project again:

npx cap open android

Quick Setup Flow

npm install
↓
npm run build
↓
npx cap sync android
↓
Open android/ in Android Studio
↓
Connect phone / start emulator
↓
Run ▶