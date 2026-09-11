# Gmail manuscript submission notifications

This integration sends Expanding Horizon Journal Netlify Form submission notifications to `editor@expandinghorizonjournal.org` through Google Apps Script and the Gmail account used to authorize the script.

## Setup

1. Open https://script.google.com/create while signed into the Google account that should send the editorial notifications.
2. Create a new Apps Script project.
3. Copy the contents of `Code.gs` from this folder into the Apps Script editor.
4. Replace `CHANGE_THIS_TO_A_PRIVATE_SECRET` with a private random string. Do not publish the secret in GitHub.
5. Save the project.
6. Select **Deploy > New deployment**.
7. Choose **Web app**.
8. Set **Execute as** to **Me**.
9. Set **Who has access** to **Anyone** so Netlify can send the webhook without signing into Google.
10. Deploy and complete Google's authorization prompts for sending email.
11. Copy the generated `/exec` web app URL.
12. In Netlify, open **Project configuration > Notifications > Form submission notifications > Add notification > HTTP POST request**.
13. Select the `manuscript-submission` form and paste the Apps Script URL with the secret query parameter:
    `YOUR_WEB_APP_URL?key=YOUR_PRIVATE_SECRET`
14. Save the notification.

## Test

Open the Apps Script `/exec` URL in a browser. It should display:

`Expanding Horizon Journal submission notification endpoint is active.`

Then submit a test manuscript through the journal website. Netlify should retain the submission and send the webhook to Apps Script, which sends the editorial email.

The script does not move manuscript files through Gmail. Netlify remains the system storing the submission and uploaded files. The email contains the submission information and the Netlify Forms link for accessing the submission.
