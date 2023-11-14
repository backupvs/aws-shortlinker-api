import { ScheduledHandler } from 'aws-lambda';
import { ShortLinksRepository } from 'src/database/repositories/short-links.repository';
import { UsersRepository } from 'src/database/repositories/users.repository';
import { SqsQueueClient } from 'src/sqs-queue/sqs-queue-client';
import { ShortLinksService } from 'src/resources/short-links/short-links.service';

const notificationsQueueClient = new SqsQueueClient(process.env.NOTIFICATIONS_QUEUE_URL);
const shortLinksService = new ShortLinksService(new ShortLinksRepository());
const usersRepository = new UsersRepository();

export const deactivateExpiredShortLinks: ScheduledHandler = async () => {
  console.log('starting to deactivate expired links...');

  const expiredLinks = await shortLinksService.findExpiredActive();

  const promises = expiredLinks.map(async (link) => {
    await shortLinksService.deactivateById(link.shortLinkId);
    const user = await usersRepository.findById(link.ownerId);

    const message = JSON.stringify({
      email: user.email,
      shortLinkId: link.shortLinkId,
    });

    await notificationsQueueClient.sendMessage(message, user.userId);
  });

  await Promise.all(promises);
};

export const main = deactivateExpiredShortLinks;
