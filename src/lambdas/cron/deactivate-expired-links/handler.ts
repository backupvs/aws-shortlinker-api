import { ScheduledHandler } from 'aws-lambda';
import { ShortLinksRepository } from '@database/repositories/short-links.repository';
import { UsersRepository } from '@database/repositories/users.repository';
import { SqsQueue } from 'src/sqs-queue/sqs.queue';
import { ShortLinksService } from '@resources/short-links/short-links.service';
import { NotificationType } from '@common/email-notifications-formatter/notification-type.enum';

const notificationsQueue = new SqsQueue(process.env.NOTIFICATIONS_QUEUE_URL);
const shortLinksService = new ShortLinksService(new ShortLinksRepository());
const usersRepository = new UsersRepository();

export const deactivateExpiredShortLinks: ScheduledHandler = async () => {
  const expiredLinks = await shortLinksService.findExpiredActive();

  const promises = expiredLinks.map(async (link) => {
    await shortLinksService.deactivateById(link.shortLinkId);
    const user = await usersRepository.findById(link.ownerId);

    const message = JSON.stringify({
      type: NotificationType.ExpiredLinkDeactivation,
      email: user.email,
      params: {
        shortLinkId: link.shortLinkId,
      },
    });

    await notificationsQueue.push(message);
  });

  await Promise.all(promises);
};

export const main = deactivateExpiredShortLinks;
