const path = require('path');

export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 5555,
  NODE_ENV: process.env.NODE_ENV,
  DB_URI: process.env.MONGODB_DB_URI,

  database: {
    host: process.env.DB_HOST || '46.226.104.56',
    port: parseInt(process.env.DB_PORT, 10),
  },
  mail: {
    email: process.env.EMAIL || 'temp@ellty.com',
    smtpHost: process.env.SMTP_HOST || 'email-smtp.us-east-1.amazonaws.com',
    smtpPort: parseInt(process.env.SMTP_PORT) || 587,
    from: process.env.MAIL_FROM || 'confirmation@ellty.com',
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS || 'qegkiv-bybvo0-Mozsud',
    tls: process.env.MAIL_TLS === 'true' ? true : false,
  },

  yookassa: {
    shopId: process.env.YOOKASSA_SHOP_ID,
    secretKey: process.env.YOOKASSA_SECRET_KEY,
    currency: process.env.YOOKASSA_CURRENCY,
  },

  s3: {
    access_key: process.env.AWS_ACCESS_KEY_ID,
    secret_key: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_BUCKET_NAME,
  },

  sendy: {
    apiKey: process.env.SENDY_API_KEY || 'IjjrWHx8xHFtA2TeEGzu',
  },
});
