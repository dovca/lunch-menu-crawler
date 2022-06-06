import cheerio from 'cheerio';
import {Dish} from '~/types/menu';
import {ICrawler} from '~/types/crawlers';
import {parse} from 'date-fns';
import {cs} from 'date-fns/esm/locale';
import {extractDishFeatures} from '~/helpers';

const PotrefenaHusa: ICrawler = {
	id: 'potrefena-husa',
	name: 'Potrefená husa',
	crawlUrl: 'https://www.potrefena-husa.eu/',

	async crawl(data) {
		const $ = cheerio.load(data);
		const menuContainer = $('.foodbox.denninabidka');
		const items = $('.foodbox-item', menuContainer);
		const offers = items.toArray().map<Dish>((el) => {
			const price = parseInt($(el).nextUntil('.foodbox-item', '.price').first().text());
			const name = $(el).text();
			const features = extractDishFeatures(name);

			return {
				type: 'dish',
				name,
				price,
				features,
			};
		});
		const dateText = $('h2.ppb_menu_title').text().split(' ').slice(1).join(' '); // Drop day name
		const date = parse(dateText, 'd. MMMM', new Date(), {locale: cs});

		return new Map([[date, {offers}]]);
	},
};

export default PotrefenaHusa;
