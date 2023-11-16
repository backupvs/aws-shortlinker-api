import { MessagesFormatHandler } from './email-notifications-formatter';

export const linkExpiredFormatter: MessagesFormatHandler = (params) => {
  const { shortLinkId, reason } = params;

  const contentType = 'html';
  const subject = 'Short link expired';
  const message = `Short link with ID <b>${shortLinkId}"</b> has been deactivated.<br>
      Reason: <b>${reason}</b>`;

  return { subject, message, contentType };
};
