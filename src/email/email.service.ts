import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService} from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('EMAIL_HOST'),
            port: this.configService.get('EMAIL_PORT'),
            secure: this.configService.get<number>('MAIL_PORT') === 465,
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASS'),
            },
            tls: {
                rejectUnauthorized: false, // Solo si estás en un entorno de desarrollo
            },
        });
    }

    async sendEmail(
        to: string[],
        subject: string,
        html: string,
        attachments: { filename: string; content: Buffer }[],
    ){
        try {
            await this.transporter.sendMail({
                from: this.configService.get('EMAIL_FROM'),
                to,
                subject,
                html,
                attachments,
            });
            console.log('Email sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

