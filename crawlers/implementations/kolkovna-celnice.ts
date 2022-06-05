import cheerio from 'cheerio';
import {Course, DailyMenu, Dish} from '~/types/menu';
import {ICrawler} from '~/types/crawlers';
import {parse} from 'date-fns';
import {extractDishFeatures, sanitizeWhitespace} from '~/helpers';

const KolkovnaCelnice: ICrawler = {
	id: 'kolkovna-celnice',
	name: 'Kolkovna Celnice',
	crawlUrl: 'https://www.kolkovna.cz/cs/kolkovna-celnice-13/denni-menu',

	async crawl(data) {
		const $ = cheerio.load(data);
		const menuContainer = $('.dailyMenuWeek');
		const menus = menuContainer
			.children()
			.toArray()
			.map<[Date, DailyMenu]>((day) => {
				const dateText = $(day).find('h2').text().split(' ')[1];
				const date = parse(dateText, 'dd.MM.yyyy', new Date());
				const offers = $('tr', day)
					.toArray()
					.map<Dish>((dish) => {
						const course = $('.title', dish).text().startsWith('Polévka') ? Course.SOUP : Course.MAIN;
						const name = sanitizeWhitespace(
							$('.name', dish)
								.text()
								.replace(/[|I][\d,]+[|I]/, '')
								.replace(/\d+\s*g/, '')
						);
						const price = parseInt($('.price', dish).text());
						const features = extractDishFeatures(name);

						return {
							type: 'dish',
							name,
							price,
							course,
							features,
						};
					});

				return [date, {offers}];
			});

		return new Map(menus);
	}
};

export default KolkovnaCelnice;
