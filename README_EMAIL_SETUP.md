# Email Setup Instructions

To enable email notifications when someone submits the contact form:

## 1. Gmail App Password Setup

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to Security → 2-Step Verification (enable if not already)
3. Click on "App passwords" at the bottom
4. Select "Mail" and your device
5. Copy the generated 16-character password

## 2. Update .env File

Edit the `.env` file and update these values:

```
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_16_character_app_password
RECEIVER_EMAIL=pranit.prasanna@gmail.com
```

## 3. Start the Server

```bash
npm install
npm start
```

The server will run on http://localhost:3000

## Notes

- The contact form will work even without MongoDB running
- Email notifications will be sent to pranit.prasanna@gmail.com
- Form submissions will be saved to MongoDB if it's running
- Make sure to keep your .env file secure and never commit it to version control