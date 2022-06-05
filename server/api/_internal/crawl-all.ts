import {sendError} from 'h3';
import CrawlerStorage from '~/crawlers/CrawlerStorage';
import CrawlerService from '~/crawlers/CrawlerService';
import {makeTimestamp} from '~/helpers';

export default defineEventHandler(async (event) => {
	const timestamp = makeTimestamp(new Date());
	const storage = new CrawlerStorage(useStorage());
	const service = new CrawlerService(storage);

	try {
		await service.getDailyMenus(timestamp, {cache: false});
	} catch (e) {
		console.error(e);
		sendError(event, e);
	}
});
