import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailerService {
  //config nodemailer
  private async transporter() {
    const testaccount = await nodemailer.createTestAccount();
    const transport = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
      auth: {
        user: testaccount.user,
        pass: testaccount.pass,
      },
    });
    return transport;
  }
  // send mail function
  async sendSignupEmilConfirmation(userEmail: string) {
    (await this.transporter()).sendMail({
      from: 'irnas@localhost.com',
      to: userEmail,
      subject: 'Inscription',
      html: '<h3>Your account is successfuly created',
    });
  }
}
