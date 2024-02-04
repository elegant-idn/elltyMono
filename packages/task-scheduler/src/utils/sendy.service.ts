import axios from 'axios';
import { configuration } from '../config/configuration';

const LISTS = {
  ru: 'scKB2s18925EwPPSeLawOrLA',
  en: 'qd83HXosFDQsAwpfEyXoZQ',
  br: 'REYjO7LJ1yqOzaDptEjiJg',
  mx: 'ApmRghjoKI763v4m892ClPdwdw',
  uk: 'hohqLrVg5x9gE3Ich2dFPA',
};

const DEFAULT_LIST_ID = LISTS.en;

export class SendyService {
  getListId = (type: 'payment-failed', language: string) => {
    return LISTS[language] ?? DEFAULT_LIST_ID;
  };
  async subscribe(email: string, listId: string, name: string) {
    let params = {
      api_key: configuration().sendy.apiKey,
      email: email,
      name: name,
      list: listId,
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

  async unsubscribe(email: string, listId: string) {
    let params = {
      email: email,
      list: listId,
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
