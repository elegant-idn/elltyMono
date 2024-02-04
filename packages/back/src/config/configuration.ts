const path = require('path');
import * as fs from 'fs';

type PricingConfig = Record<string, { annual: string; monthly: string }>;

const unwrapKeys = (pricingObject: PricingConfig) => {
  return Object.keys(pricingObject).reduce((acc, key) => {
    const keysSplit = key
      .split(',')
      .filter((v) => v !== '' && v !== ' ')
      .map((v) => v.trim());

    keysSplit.forEach((splitKey) => {
      acc[splitKey] = pricingObject[key];
    });

    return acc;
  }, {});
};

const createCountryPricingMap = (provider: 'stripe' | 'paypal') => {
  const filepath = path.join(
    __dirname,
    `../../country-based-pricing/${provider}.${process.env.NODE_ENV}.json`,
  );
  const countryBasedPricing = fs.readFileSync(filepath, {
    encoding: 'utf-8',
  });

  const parsed = JSON.parse(countryBasedPricing) as PricingConfig;

  return unwrapKeys(parsed);
};

export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  NODE_ENV: process.env.NODE_ENV,
  DB_URI: process.env.MONGODB_DB_URI,
  expiresIn: process.env.JWT_EXPIRESIN,
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
  sendy: {
    apiKey: process.env.SENDY_API_KEY || 'IjjrWHx8xHFtA2TeEGzu',
  },
  google: {
    clientID:
      process.env.GOOGLE_CLIENT_ID ||
      '1040281058482-d4krm45pq34qddpij99tarmn1ulmind2.apps.googleusercontent.com',
    clientSecret:
      process.env.GOOGLE_SECRET || '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',
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['email', 'profile'],
  },
  facebook: {
    clientID: process.env.FACEBOOK_CLIENT_ID || '1088921271855976',
    clientSecret:
      process.env.FACEBOOK_SECRET || '1255699ffd82719c16937b0282d82fcf',
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    scope: 'email',
    profileFields: ['emails', 'name'],
  },
  apple: {
    client_id: process.env.APPLE_CLIENT_ID,
    team_id: process.env.APPLE_TEAM_ID,
    redirect_uri: process.env.APPLE_REDIRECT,
    key_id: process.env.APPLE_KEY_ID,
    scope: process.env.APPLE_SCOPE,
    key_path:
      process.env.APPLE_KEY_PATH ||
      path.join(__dirname, '../../../config/AuthKey_MVFFXDWGQ2.p8'),
  },
  mailchimp: {
    api_key: process.env.MAILCHIMP_APIKEY,
    all_customers: process.env.MAILCHIMP_ALL_CUSTOMERS,
  },
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY,
    defaultMonthlyPriceId: process.env.STRIPE_DEFAULT_PRICE_ID,
    defaultAnnualPriceId: process.env.STRIPE_DEFAULT_ANNUAL_PRICE_ID,
    countryBasedPricing: createCountryPricingMap('stripe'),
  },
  paypal: {
    environment: process.env.PAYPAL_ENVIRONMENT,
    url: process.env.PAYPAL_URL,
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    defaultMonthlyPriceId: process.env.PAYPAL_DEFAULT_PRICE_ID,
    defaultAnnualPriceId: process.env.PAYPAL_DEFAULT_ANNUAL_PRICE_ID,
    countryBasedPricing: createCountryPricingMap('paypal'),
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
  scope: 'email',
  profileFields: ['emails', 'name'],
  redirectURL: process.env.BASE_URL,
  host: process.env.HOST,
  baseUrl: process.env.BASE_URL,
  elltyApi: process.env.ELLTY_API,
  serverUrl: process.env.BACK_URL,
  maxImageSize: 20 * 1024 * 1024,
  maxUploadsSize: 50 * 1024 * 1024,
  allowedUploadsExtensions: [
    'raw',
    'image/png',
    // tif and tiff
    'image/tiff',
    // jpg and jpeg
    'image/jpeg',
    'image/bmp',
    'image/svg+xml',
    'image/webp',
  ],
});
