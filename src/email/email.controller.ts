import { Controller, Post, Body, UploadedFiles, UseInterceptors, ParseArrayPipe } from '@nestjs/common';
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { extname } from 'path';

import { EmailService } from './email.service';
@Controller('email-service')
export class EmailController {

    constructor(private readonly emailService: EmailService) {}

    @Post('send-email')
    @UseInterceptors(
        FilesInterceptor('files', 20, {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }) as any,
    )

    async sendEmails(
        @Body('to', new ParseArrayPipe({ items: String })) to: string[],
        @Body('subject') subject: string,
        @Body('html') html: string,
        @UploadedFiles() files: Array<Express.Multer.File>,
    ) {

        const attachments = files.map((file) => ({
            filename: file.originalname,
            content: file.buffer,
        }));
        await this.emailService.sendEmail(to, subject, html, attachments);
        return { message: 'Emails sent successfully' };
    }

}

/*
{
    "to": ["edgarmnm.dev@gmail.com", "developer.mendez@qasar.app"],
    "subject": "Important Announcement",
    "html": "<b>Hello!</b>",
    "files": ["path/to/file1.pdf", "path/to/file2.txt"] // Array of file paths
}fo*/
