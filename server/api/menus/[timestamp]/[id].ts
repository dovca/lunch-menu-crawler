import {createError, send, sendError, useQuery} from 'h3';
import CrawlerService from '~/crawlers/CrawlerService';
import CrawlerStorage from '~/crawlers/CrawlerStorage';
import CrawlerNotFoundError from '~/crawlers/CrawlerNotFoundError';

export default defineEventHandler(async (event) => {
	const {id, timestamp} = event.context.params;
	const query = useQuery(event);
	const fresh = 'fresh' in query;

	const storage = new CrawlerStorage(useStorage());
	const service = new CrawlerService(storage);

	try {
		return await service.getDailyMenu(timestamp, id, {cache: !fresh});
	} catch (e) {
		console.error(e);

		if (e instanceof CrawlerNotFoundError) {
			return sendError(event, createError({
				statusCode: 404,
				statusMessage: e.message,
			}));
		}

		sendError(event, e);
	}
});
