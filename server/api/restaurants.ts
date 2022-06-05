import crawlers from '~/crawlers';
import {mapValues} from 'lodash-es';

export default defineEventHandler((event) => {
	return mapValues(crawlers, (crawler) => ({
		name: crawler.name,
	}));
});
