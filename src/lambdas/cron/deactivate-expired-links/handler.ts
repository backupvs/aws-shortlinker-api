import { ScheduledHandler } from 'aws-lambda';
import { ShortLinksRepository } from 'src/database/repositories/short-links.repository';
import { UsersRepository } from 'src/database/repositories/users.repository';
import { SqsQueue } from 'src/sqs-queue/sqs.queue';
import { ShortLinksService } from 'src/resources/short-links/short-links.service';
import { NotificationType } from 'src/common/email-notifications-formatter/notification-type.enum';

const notificationsQueue = new SqsQueue(process.env.NOTIFICATIONS_QUEUE_URL);
const shortLinksService = new ShortLinksService(new ShortLinksRepository());
const usersRepository = new UsersRepository();

export const deactivateExpiredShortLinks: ScheduledHandler = async () => {
  const expiredLinks = await shortLinksService.findExpiredActive();

  const promises = expiredLinks.map(async (link) => {
    await shortLinksService.deactivateById(link.shortLinkId);
    const user = await usersRepository.findById(link.ownerId);

    const message = JSON.stringify({
      type: NotificationType.DeactivationExpiredLink,
      email: user.email,
      params: {
        shortLinkId: link.shortLinkId,
        reason: 'Expired',
      },
    });

    await notificationsQueue.push(message);
  });

  await Promise.all(promises);
};

export const main = deactivateExpiredShortLinks;
