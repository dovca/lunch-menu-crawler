import crawlers from '~/crawlers/index';
import CrawlerStorage from '~/crawlers/CrawlerStorage';
import {defaults} from 'lodash-es';
import {DailyMenu} from '~/types/menu';
import CrawlerNotFoundError from '~/crawlers/CrawlerNotFoundError';
import {Iconv} from 'iconv';
import {Buffer} from 'buffer';

interface ICrawlOptions {
	cache: boolean
}

export default class CrawlerService {
	constructor(private storage: CrawlerStorage) {
	}

	async crawlAll() {
		await Promise.all(Object.keys(crawlers).map(async (id) => {
			try {
				return await this.crawlOne(id);
			} catch (e: any) {
				console.error(e);
				return null;
			}
		}));
	}

	async crawlOne(id: string) {
		if (!(id in crawlers)) {
			throw new CrawlerNotFoundError(id);
		}

		const crawler = crawlers[id];
		const response = await fetch(crawler.crawlUrl, {
			headers: crawler.crawlHeaders,
		});

		let data;

		if (crawler.encoding === undefined) {
			data = await response.text();
		} else {
			const buffer = await response.arrayBuffer()
			const iconv = new Iconv(crawler.encoding, 'UTF-8');
			data = iconv.convert(Buffer.from(buffer)).toString();
		}
		const crawlerResult = await crawler.crawl(data);
		await this.storage.store(id, crawlerResult);
	}

	async getDailyMenu(timestamp: string, id: string, options?: ICrawlOptions): Promise<DailyMenu | null> {
		if (!(id in crawlers)) {
			throw new CrawlerNotFoundError(id);
		}

		const opts = defaults({}, options, {
			cache: true
		});

		const isCached = await this.storage.has(timestamp, id);

		if (!opts.cache || !isCached) {
			await this.crawlOne(id);
		}

		return this.storage.load(timestamp, id);
	}

	async getDailyMenus(timestamp: string, options?: ICrawlOptions): Promise<Record<string, DailyMenu>> {
		const opts = defaults({}, options, {
			cache: true
		});

		if (!opts.cache) {
			await this.crawlAll();
		}

		return this.storage.loadAll(timestamp);
	}
}
