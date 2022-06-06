import cheerio from 'cheerio';
import {parse, startOfWeek} from 'date-fns';
import {cs} from 'date-fns/esm/locale';
import {ICrawler} from '~/types/crawlers';
import {Course, DailyMenu, Dish} from '~/types/menu';
import {capitalize} from 'lodash-es';
import {extractDishFeatures, sanitizeWhitespace} from '~/helpers';

const Tiskarna: ICrawler = {
	id: 'tiskarna',
	name: 'Tiskárna',
	crawlUrl: 'https://www.restauracetiskarna.cz/obedy/',

	async crawl(data) {
		const $ = cheerio.load(data);
		const days = $('header + section > *').toArray().slice(0, 5);
		const weekStart = startOfWeek(new Date(), {locale: cs});
		const datesWithMenus = days.map<[Date, DailyMenu]>((day) => {
			const dateText = $(day).find('h2').text().split(' ').slice(1).join(' '); // Drop day name
			const date = parse(dateText, 'd. M.', weekStart);
			const offers = $(day).find('.polozka4').toArray().map<Dish>((dish, index) => {
				const titleContainer = $(dish).find('.nazev5 > p');
				titleContainer.find('strong').remove();
				const name = capitalize(sanitizeWhitespace(titleContainer.text()));

				return {
					type: 'dish',
					name,
					price: parseInt($(dish).find('.cena').text()),
					course: index === 0 ? Course.SOUP : Course.MAIN,
					features: extractDishFeatures(name),
				};
			});

			return [date, {offers}];
		});

		return new Map(datesWithMenus);
	}
};

export default Tiskarna;
