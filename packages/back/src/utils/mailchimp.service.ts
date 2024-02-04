import { configuration } from '../config/configuration';
import { HttpException, HttpStatus } from '@nestjs/common';

const Mailchimp = require('mailchimp-api-v3');

const mailchimp = new Mailchimp(configuration().mailchimp.api_key);

export class MailchimpService {
  async addUserToList(
    list_id: string,
    user_email: string,
    user_language: string,
  ) {
    await mailchimp
      .post({
        path: `/lists/${list_id}/members`,
        body: {
          email_address: user_email,
          //
          // revert for the mailchimp double opt-in feature 
          // status: 'pending',
          status: 'unsubscribed',
          merge_fields: {
            LANGUAGE: user_language,
          },
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      });
  }

  async updateUserStatus(list_id: string, user_email: string) {
    await mailchimp
      .put({
        path: `/lists/${list_id}/members/${user_email}`,
        body: {
          email_address: user_email,
          status_if_new: 'subscribed',
          status: 'subscribed',
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      });
  }

  async updateUserLanguage(
    list_id: string,
    user_email: string,
    user_language: string,
  ) {
    await mailchimp.patch({
      path: `/lists/${list_id}/members/${user_email}`,
      body: {
        merge_fields: {
          LANGUAGE: user_language,
        },
      },
    });
  }
}
