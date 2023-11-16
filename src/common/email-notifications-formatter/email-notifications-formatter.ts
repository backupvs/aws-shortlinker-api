import { linkExpiredFormatter } from './handlers';
import { NotificationType } from './notification-type.enum';

export interface FormattedMessage {
  subject: string;
  message: string;
  contentType: 'html' | 'text';
}

export type MessagesFormatHandler = (params: Record<string, any>) => FormattedMessage;

export class EmailNotificationsFormatter {
  private handlers: Record<NotificationType, MessagesFormatHandler>;

  constructor() {
    this.handlers = {
      [NotificationType.DeactivationExpiredLink]: linkExpiredFormatter,
    };
  }

  format(type: NotificationType, params: Record<string, any>): FormattedMessage {
    return this.handlers[type](params);
  }
}
