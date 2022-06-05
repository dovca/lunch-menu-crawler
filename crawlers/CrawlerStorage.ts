import {ICrawlerResult} from '~/types/crawlers';
import {makeTimestamp} from '~/helpers';
import {DailyMenu} from '~/types/menu';
import {fromPairs, sortedUniq} from 'lodash-es';

export default class CrawlerStorage {
	constructor(private storage: any) {
	}

	async store(id: string, result: ICrawlerResult) {
		for (const [date, menu] of result.entries()) {
			const ts = makeTimestamp(date);
			await this.storage.setItem(CrawlerStorage.makeStorageKey(ts, id), menu);
		}
	}

	async load(timestamp: string, id: string): Promise<DailyMenu | null> {
		return await this.storage.getItem(CrawlerStorage.makeStorageKey(timestamp, id)) ?? null;
	}

	async loadAll(timestamp: string): Promise<Record<string, DailyMenu>> {
		const keys = await this.storage.getKeys(CrawlerStorage.makeStorageKey(timestamp));
		const promises = keys.map((key) => this.storage
			.getItem(key)
			.then((item) => [key.split(':')[3], item]));
		const pairs = await Promise.all(promises);

		return fromPairs(pairs);
	}

	async has(timestamp: string, id: string): Promise<boolean> {
		return await this.storage.hasItem(CrawlerStorage.makeStorageKey(timestamp, id));
	}

	async getAvailableTimestamps(): Promise<string[]> {
		const keys = await this.storage.getKeys(CrawlerStorage.makeStorageKey());
		return sortedUniq(keys.map((key) => key.split(':')[2]).sort());
	}

	private static makeStorageKey(timestamp?: string, id?: string) {
		return `/redis/menus:${[timestamp, id].filter(Boolean).join(':')}`;
	}
}
