/**
 * NANO WORLD SCHOOL - PROFESSIONAL EMAIL TEMPLATES
 */

const primaryColor = '#0B192C';
const goldColor = '#D4AF37';
const whiteColor = '#ffffff';
const lightBg = '#f4f7f6';

const baseStyles = `
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
`;

const headerStyles = `
  background-color: ${primaryColor};
  padding: 30px;
  text-align: center;
  color: ${whiteColor};
`;

const contentStyles = `
  padding: 40px;
  background-color: ${whiteColor};
`;

const footerStyles = `
  padding: 20px;
  background-color: ${lightBg};
  text-align: center;
  font-size: 12px;
  color: #64748b;
`;

// 1. TEMPLATE FOR ADMIN NOTIFICATION
export const adminEnquiryTemplate = (data) => `
  <div style="${baseStyles}">
    <div style="${headerStyles}">
      <h1 style="margin: 0; color: ${goldColor}; font-size: 24px;">New Admission Enquiry</h1>
      <p style="margin: 10px 0 0; opacity: 0.8;">Action required: New lead from website</p>
    </div>
    <div style="${contentStyles}">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Parent Name:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Grade:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: ${goldColor}; font-weight: bold;">${data.grade.toUpperCase()}</td>
        </tr>
      </table>
      <div style="margin-top: 30px;">
        <p style="font-weight: bold; margin-bottom: 10px;">Message:</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid ${goldColor};">
          ${data.message}
        </div>
      </div>
      <div style="margin-top: 30px; text-align: center;">
        <a href="https://nanoworldschool.co.in/admin/inbox" style="display: inline-block; padding: 12px 25px; background-color: ${primaryColor}; color: ${whiteColor}; text-decoration: none; border-radius: 6px; font-weight: bold;">View in Admin Panel</a>
      </div>
    </div>
    <div style="${footerStyles}">
      <p>&copy; ${new Date().getFullYear()} Nano World School Management System</p>
    </div>
  </div>
`;

// 2. TEMPLATE FOR PARENT ACKNOWLEDGMENT
export const parentAutoReplyTemplate = (name) => `
  <div style="${baseStyles}">
    <div style="${headerStyles}">
      <h1 style="margin: 0; color: ${goldColor}; font-size: 24px;">Thank You for Reaching Out</h1>
    </div>
    <div style="${contentStyles}">
      <p>Dear <strong>${name}</strong>,</p>
      <p>We have received your admission enquiry for <strong>Nano World School</strong>. We are delighted that you are considering us for your child's educational journey.</p>
      <p>Our admissions team is currently reviewing your details and will contact you within the next 24-48 hours to schedule a campus visit or discuss the next steps.</p>
      
      <div style="margin: 30px 0; padding: 20px; background-color: ${lightBg}; border-radius: 8px;">
        <h4 style="margin: 0 0 10px; color: ${primaryColor};">Why Nano World School?</h4>
        <ul style="padding-left: 20px; margin: 0;">
          <li>Experiential learning methodology</li>
          <li>World-class digital classrooms</li>
          <li>Holistic development focus</li>
        </ul>
      </div>

      <p>In the meantime, feel free to explore our virtual tour on our website.</p>
      <p>Best Regards,<br><strong>Admissions Team</strong><br>Nano World School</p>
    </div>
    <div style="${footerStyles}">
      <p>Plot No. 45, Nano World School Road, Hyderabad<br>+91 98765 43210 | info@nanoworldschool.com</p>
    </div>
  </div>
`;
