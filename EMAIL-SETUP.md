# Email Receipt/Confirmation Setup Guide

This guide explains how to set up email confirmations for order receipts.

## ✅ What's Been Implemented

- ✅ Email service utility (`src/lib/email.ts`)
- ✅ Beautiful HTML email template with order details
- ✅ Integration with order creation API
- ✅ Automatic email sending after successful order

## 📧 Email Service Options

### Option 1: Resend (Recommended)

**Why Resend:**
- Modern, developer-friendly API
- Free tier: 3,000 emails/month
- Great deliverability
- Simple setup

**Setup Steps:**

1. **Sign up for Resend**
   - Go to https://resend.com
   - Create a free account
   - Verify your email

2. **Get API Key**
   - Go to API Keys section
   - Create a new API key
   - Copy the key (starts with `re_`)

3. **Add to Environment Variables**
   ```bash
   # Add to your .env file
   RESEND_API_KEY=re_your_api_key_here
   ```

4. **Verify Domain (Optional but Recommended)**
   - Go to Domains section in Resend
   - Add your domain (e.g., glowvaskin.ng)
   - Add DNS records as instructed
   - Once verified, update the `from` address in `src/lib/email.ts`:
     ```typescript
     from: 'Glowvaskin <orders@glowvaskin.ng>'
     ```

5. **Test Email**
   - For testing, you can use any email address
   - Resend allows sending to any email in development

---

### Option 2: Nodemailer with Gmail

**Setup Steps:**

1. **Install Nodemailer**
   ```bash
   npm install nodemailer
   ```

2. **Enable Gmail App Password**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate app password for "Mail"

3. **Update `src/lib/email.ts`**
   Replace the Resend implementation with:
   ```typescript
   import nodemailer from 'nodemailer';

   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: import.meta.env.GMAIL_USER,
       pass: import.meta.env.GMAIL_APP_PASSWORD,
     },
   });

   export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
     try {
       const emailHtml = generateOrderEmailTemplate(data);
       
       await transporter.sendMail({
         from: '"Glowvaskin" <your-email@gmail.com>',
         to: data.customerEmail,
         subject: `Order Confirmation #${data.orderId.slice(0, 8)}`,
         html: emailHtml,
       });

       return true;
     } catch (error) {
       console.error('Error sending email:', error);
       return false;
     }
   }
   ```

4. **Add to .env**
   ```bash
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-char-app-password
   ```

---

### Option 3: SendGrid

**Setup Steps:**

1. **Sign up for SendGrid**
   - Go to https://sendgrid.com
   - Free tier: 100 emails/day

2. **Get API Key**
   - Create API key in Settings → API Keys

3. **Install SendGrid**
   ```bash
   npm install @sendgrid/mail
   ```

4. **Update `src/lib/email.ts`**
   ```typescript
   import sgMail from '@sendgrid/mail';

   sgMail.setApiKey(import.meta.env.SENDGRID_API_KEY);

   export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
     try {
       const emailHtml = generateOrderEmailTemplate(data);
       
       await sgMail.send({
         to: data.customerEmail,
         from: 'orders@glowvaskin.ng',
         subject: `Order Confirmation #${data.orderId.slice(0, 8)}`,
         html: emailHtml,
       });

       return true;
     } catch (error) {
       console.error('Error sending email:', error);
       return false;
     }
   }
   ```

5. **Add to .env**
   ```bash
   SENDGRID_API_KEY=SG.your_api_key_here
   ```

---

## 📝 Email Template Features

The email template includes:
- ✅ Professional branded header
- ✅ Order ID and date
- ✅ Payment reference (Paystack)
- ✅ Itemized product list with quantities and prices
- ✅ Total amount
- ✅ Shipping address
- ✅ Support contact information
- ✅ Mobile-responsive design

## 🧪 Testing

1. **Test Order Creation**
   - Create a test order through the checkout
   - Check the email inbox for the customer email used
   - Verify all order details are correct

2. **Check Logs**
   - Monitor server logs for email sending status
   - Look for "Order confirmation email sent to: [email]"

3. **Test Different Scenarios**
   - Single item order
   - Multiple items order
   - Different shipping addresses
   - Different payment statuses

## 🔧 Customization

### Update Email Branding

Edit `src/lib/email.ts` to customize:
- Company name and logo
- Color scheme (currently pink/purple gradient)
- Support contact information
- Footer text

### Add More Email Types

You can create additional email functions for:
- Order shipped notification
- Order delivered confirmation
- Payment failed notification
- Welcome emails for new customers

Example:
```typescript
export async function sendOrderShippedEmail(data: ShippingEmailData): Promise<boolean> {
  // Similar implementation
}
```

## 🚨 Troubleshooting

### Email Not Sending

1. **Check API Key**
   - Verify `.env` file has correct API key
   - Restart dev server after adding env variables

2. **Check Logs**
   - Look for error messages in console
   - Check if email service is responding

3. **Verify Domain**
   - For production, verify your domain with email provider
   - Use verified sender email addresses

### Email Going to Spam

1. **Verify Domain**
   - Add SPF, DKIM, and DMARC records
   - Use domain verification in email service

2. **Use Professional Email**
   - Avoid free email addresses as sender
   - Use your domain email (e.g., orders@glowvaskin.ng)

3. **Warm Up Domain**
   - Start with small volume
   - Gradually increase sending

## 📊 Monitoring

### Track Email Delivery

Most email services provide dashboards to track:
- Delivery rate
- Open rate
- Bounce rate
- Spam complaints

### Log Email Events

The current implementation logs:
- ✅ Successful sends
- ❌ Failed sends
- 📧 Recipient email addresses

## 🔐 Security Best Practices

1. **Never commit API keys**
   - Keep `.env` in `.gitignore`
   - Use environment variables

2. **Validate Email Addresses**
   - Already done in checkout form
   - Email service will also validate

3. **Rate Limiting**
   - Email services have built-in rate limits
   - Monitor usage to avoid hitting limits

## 📈 Next Steps

1. **Set up email service** (Resend recommended)
2. **Add API key to `.env`**
3. **Test with real order**
4. **Verify domain for production**
5. **Monitor email delivery**

## 💡 Future Enhancements

- Add order tracking link in email
- Include estimated delivery date
- Add product images in email
- Send shipping confirmation emails
- Add email preferences/unsubscribe
- Multi-language support
