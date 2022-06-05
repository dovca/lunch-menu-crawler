import CrawlerStorage from '~/crawlers/CrawlerStorage';
import CrawlerService from '~/crawlers/CrawlerService';
import {sendError} from 'h3';

export default defineCachedEventHandler(async (event) => {
	const {timestamp} = event.context.params;
	const storage = new CrawlerStorage(useStorage());
	const service = new CrawlerService(storage);

	try {
		const menus = await service.getDailyMenus(timestamp, {cache: false});

		return {menus};
	} catch (e) {
		console.error(e);
		sendError(event, e);
	}
}, {
	group: 'menus',
	maxAge: 3600, // 1 hour in seconds
	swr: false,
});
