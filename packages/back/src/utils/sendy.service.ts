import axios from 'axios';
import { configuration } from '../config/configuration';
import { lists } from './lists';

const PAYMENT_FAILED_LISTS = {
  ru: 'scKB2s18925EwPPSeLawOrLA',
  en: 'qd83HXosFDQsAwpfEyXoZQ',
  br: 'REYjO7LJ1yqOzaDptEjiJg',
  mx: 'ApmRghjoKI763v4m892ClPdwdw',
  uk: 'hohqLrVg5x9gE3Ich2dFPA',
};

const DEFAULT_LIST_ID = PAYMENT_FAILED_LISTS.en;

export class SendyService {
  getListId = (type: 'payment-failed', language: string) => {
    return PAYMENT_FAILED_LISTS[language] ?? DEFAULT_LIST_ID;
  };

  async subscribe(email, language, name) {
    let params = {
      api_key: configuration().sendy.apiKey,
      email: email,
      name: name,
      list: lists[language],
      boolean: true,
    };
    const data = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    axios
      .post(`https://mail.ellty.com/subscribe`, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
      .then((res) => console.log(res));
  }

  async unsubscribe(email: string, list_id: string) {
    let params = {
      email: email,
      list: list_id,
      boolean: true,
    };
    const data = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    axios
      .post(`https://mail.ellty.com/unsubscribe`, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
      .then((res) => console.log(res));
  }
}
