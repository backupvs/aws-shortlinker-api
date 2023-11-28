import { MessagesFormatHandler } from './email-notifications-formatter';

export const linkExpiredFormatter: MessagesFormatHandler = (params) => {
  const { shortLinkId } = params;

  const contentType = 'html';
  const subject = 'Short link expired';
  const message = `Short link with ID <b>${shortLinkId}</b> has been deactivated.<br>
      Reason: <b>Expired</b>`;

  return { subject, message, contentType };
};
