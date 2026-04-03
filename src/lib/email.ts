import { Resend } from 'resend';

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress: string;
  city: string;
  state: string;
  country: string;
  orderDate: string;
  paystackReference?: string;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  const resendApiKey = import.meta.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured');
    return false;
  }

  try {
    const resend = new Resend(resendApiKey);
    const emailHtml = generateOrderEmailTemplate(data);
    
    const { data: emailData, error } = await resend.emails.send({
      from: 'GLOWVA SKIN <onboarding@resend.dev>',
      to: [data.customerEmail],
      subject: `Order Confirmation #${data.orderId.slice(0, 8)}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return false;
    }

    console.log('Order confirmation email sent to:', data.customerEmail);
    console.log('Email ID:', emailData?.id);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
}

function generateOrderEmailTemplate(data: OrderEmailData): string {
  const itemsHtml = data.orderItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <strong>${item.name}</strong>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
            ₦${item.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
            ₦${(item.price * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </td>
        </tr>
      `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #E91E63 0%, #9C27B0 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">GLOWVA SKIN</h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Order Confirmation</p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Thank you for your order, ${data.customerName}!</h2>
                  <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                    We've received your order and will process it shortly. You'll receive another email when your order ships.
                  </p>

                  <!-- Order Details -->
                  <div style="background-color: #f9f9f9; border-left: 4px solid #E91E63; padding: 20px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0; color: #333; font-size: 14px;">
                      <strong>Order ID:</strong> #${data.orderId.slice(0, 8).toUpperCase()}
                    </p>
                    <p style="margin: 0 0 10px 0; color: #333; font-size: 14px;">
                      <strong>Order Date:</strong> ${new Date(data.orderDate).toLocaleDateString('en-NG', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    ${data.paystackReference ? `
                      <p style="margin: 0; color: #333; font-size: 14px;">
                        <strong>Payment Reference:</strong> ${data.paystackReference}
                      </p>
                    ` : ''}
                  </div>

                  <!-- Order Items -->
                  <h3 style="margin: 30px 0 15px 0; color: #333; font-size: 18px;">Order Items</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 4px; overflow: hidden;">
                    <thead>
                      <tr style="background-color: #f5f5f5;">
                        <th style="padding: 12px; text-align: left; font-size: 14px; color: #666;">Product</th>
                        <th style="padding: 12px; text-align: center; font-size: 14px; color: #666;">Qty</th>
                        <th style="padding: 12px; text-align: right; font-size: 14px; color: #666;">Price</th>
                        <th style="padding: 12px; text-align: right; font-size: 14px; color: #666;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                      <tr>
                        <td colspan="3" style="padding: 16px; text-align: right; font-size: 16px; font-weight: bold; color: #333;">
                          Total Amount:
                        </td>
                        <td style="padding: 16px; text-align: right; font-size: 18px; font-weight: bold; color: #E91E63;">
                          ₦${data.totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- Shipping Address -->
                  <h3 style="margin: 30px 0 15px 0; color: #333; font-size: 18px;">Shipping Address</h3>
                  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px;">
                    <p style="margin: 0 0 5px 0; color: #333; font-size: 14px; line-height: 1.6;">
                      ${data.shippingAddress}<br>
                      ${data.city}, ${data.state}<br>
                      ${data.country}
                    </p>
                  </div>

                  <!-- Support -->
                  <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
                    <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                      Questions about your order? Contact us at:
                    </p>
                    <p style="margin: 0; color: #E91E63; font-size: 14px;">
                      📧 support@glowvaskin.ng<br>
                      📱 +234 806 739 4465<br>
                      💬 WhatsApp: 0806 739 4465
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #9C27B0; padding: 30px; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px;">
                    Thank you for shopping with GLOWVA SKIN!
                  </p>
                  <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 12px;">
                    © ${new Date().getFullYear()} GLOWVA SKIN. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
