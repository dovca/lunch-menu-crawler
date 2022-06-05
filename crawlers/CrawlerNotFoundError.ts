export default class CrawlerNotFoundError extends Error {
	constructor (id: string) {
		super(`The crawler with id "${id}" was not found`);
		this.name = 'CrawlerNotFoundError';
	}
}
