export interface IEmailService {
  sendMessage(
    to: string,
    message: string,
    type: 'text' | 'html',
    subject?: string
  ): Promise<void>;
}
