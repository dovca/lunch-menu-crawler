import CrawlerStorage from '~/crawlers/CrawlerStorage';

export default defineCachedEventHandler(async (event) => {
	return await new CrawlerStorage(useStorage()).getAvailableTimestamps();
}, {
	maxAge: 3600,
	swr: false,
});
