# Google Sheets Contact Form Integration Setup

This guide will help you set up Google Sheets to store contact form submissions from your website.

## Quick Setup (10 minutes)

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Koby AI Contact Form Submissions"
4. In the first row (header), add these columns exactly as shown:
   - A1: `Timestamp`
   - B1: `Type`
   - C1: `Service Type`
   - D1: `First Name`
   - E1: `Last Name`
   - F1: `Email`
   - G1: `Phone`
   - H1: `Company`
   - I1: `Message`
   - J1: `Integrations`
   - K1: `Preferred Contact`
   - L1: `Newsletter`

### Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code
3. Copy and paste this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Add the form submission to the sheet
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.type || '',
      data.serviceType || '',
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      data.company || '',
      data.message || '',
      data.integrations || '',
      data.preferredContact || '',
      data.newsletter || ''
    ]);

    // Optional: Send email notification for new submissions
    // Uncomment and configure the following lines if you want email notifications
    /*
    const recipient = "admin@kobyai.com"; // Change to your email
    const subject = "New Contact Form Submission";
    const body = `
      New contact form submission:

      Name: ${data.firstName} ${data.lastName}
      Email: ${data.email}
      Company: ${data.company}
      Subject: ${data.type}

      Message:
      ${data.message}
    `;

    MailApp.sendEmail(recipient, subject, body);
    */

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: GET endpoint to retrieve submissions (for admin dashboard)
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const action = e.parameter.action;

    if (action === 'getSubmissions') {
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const submissions = [];

      // Skip header row
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[0]) { // Check if row has data
          submissions.push({
            timestamp: row[0],
            type: row[1],
            serviceType: row[2],
            firstName: row[3],
            lastName: row[4],
            email: row[5],
            phone: row[6],
            company: row[7],
            message: row[8],
            integrations: row[9],
            preferredContact: row[10],
            newsletter: row[11]
          });
        }
      }

      return ContentService
        .createTextOutput(JSON.stringify({ success: true, submissions: submissions }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Invalid action' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (💾 icon) and name it "Contact Form Handler"

### Step 3: Deploy as Web App

1. Click **Deploy** → **New Deployment**
2. Click the gear icon ⚙️ and select **Web app**
3. Configure the deployment:
   - **Description**: Contact Form API
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**
5. **IMPORTANT**: Copy the Web App URL (looks like `https://script.google.com/macros/s/XXXXXXXXXXXX/exec`)
6. Click **Done**

### Step 4: Update Your Website Configuration

1. Open your `.env.local` file in the project root
2. Replace `YOUR_GOOGLE_SHEETS_URL_HERE` with your Web App URL:
```
GOOGLE_SHEETS_URL=https://script.google.com/macros/s/XXXXXXXXXXXX/exec
```
3. Save the file
4. Restart your development server (`npm run dev` or `yarn dev`)

## Testing the Integration

### Test Form Submission
1. Go to your website's contact page: http://localhost:3000/contact
2. Fill out the contact form with test data
3. Submit the form
4. Check your Google Sheet - you should see the new entry appear!

### Verify the Data
The submitted data should appear in your Google Sheet with:
- Timestamp of submission
- Contact type/subject
- Name (split into first and last)
- Email address
- Phone number (if provided)
- Company name (if provided)
- Message content

## Troubleshooting

### Form submissions not appearing in Google Sheet?
- **Check the Apps Script deployment**: Make sure it's deployed as a Web App
- **Verify the URL**: Ensure the URL in `.env.local` is correct and complete
- **Access permissions**: Confirm the Web App is set to "Anyone" for access
- **Check browser console**: Look for any error messages when submitting the form

### Getting CORS errors?
- The API endpoint uses `mode: 'no-cors'` to avoid CORS issues
- This is normal with Google Apps Script
- The form will still work even if you see CORS warnings in the console

### Need to update the Apps Script?
1. Make your changes in the Apps Script editor
2. Click **Deploy** → **Manage deployments**
3. Click the edit icon (pencil) on your deployment
4. Under **Version**, select **New version**
5. Click **Deploy**
6. The URL remains the same, no need to update `.env.local`

## Security Considerations

- The Google Sheet is only accessible through your Apps Script
- The Apps Script runs under your Google account permissions
- Form submissions are validated on both client and server side
- Consider adding rate limiting for production use
- Add CAPTCHA for spam prevention if needed

## Email Notifications (Optional)

To receive email notifications for new submissions:
1. Uncomment the email notification code in the Apps Script (lines 24-38)
2. Change `admin@kobyai.com` to your email address
3. Save and redeploy the script
4. You'll receive an email for each new submission

## Advanced Features

You can extend this setup by:
- Adding automatic response emails to form submitters
- Creating submission statistics and analytics
- Setting up webhook notifications to Slack or Discord
- Implementing data export features
- Adding custom validation rules
- Creating an admin dashboard to view submissions

## Support

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Verify all URLs and configurations are correct
3. Ensure Google Sheets permissions are properly set
4. Test the Apps Script URL directly in your browser (should return an error about GET not being configured)
5. Check that environment variables are loaded correctly