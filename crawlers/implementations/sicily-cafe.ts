import {ICrawler} from '~/types/crawlers';
import cheerio from 'cheerio';
import {parse} from 'date-fns';
import {extractDishFeatures, nonNullable, sanitizeWhitespace} from '~/helpers';
import {Course, DailyMenu, Dish} from '~/types/menu';

const SicilyCafe: ICrawler = {
	id: 'sicily-cafe',
	name: 'Sicily Café',
	crawlUrl: 'https://menicka.cz/api/iframe/?id=6009',
	encoding: 'CP1250',

	async crawl(data) {
		const $ = cheerio.load(data);
		const daysWithMenus = $('.content')
			.toArray()
			.map<[Date, DailyMenu] | null>((day) => {
				const rows = $(day).find('tr');

				if (rows.length < 2) {
					return null;
				}

				const dateText = $('h2', day).text().trim().split(' ').find((t) => /\d/.test(t));
				const date = parse(dateText, 'd.M.yyyy', new Date());

				rows.find('.no').remove();
				const offers = rows
					.toArray()
					.map<Dish | null>((row) => {
						let nameText = $(row).find('.food').text();

						if (/^poznámka/i.test(nameText)) {
							return null;
						}

						let price: number | number[] = parseInt($(row).find('.prize').text());

						if (isNaN(price)) {
							const match = /(\d+)\/(\d+)/.exec(nameText);

							if (!match) {
								return null;
							}

							price = [match[1], match[2]].map((t) => parseInt(t, 10));
							nameText = nameText.slice(0, match.index);
						}

						const name = sanitizeWhitespace(
							nameText
								.replace(/^[A-ZÁÍÉÝ\s]+:/, '')
								.replace(/\[\w+(,\s*\w+)*]/, '')
						);

						return {
							type: 'dish',
							name,
							price,
							course: $(row).hasClass('soup') ? Course.SOUP : Course.MAIN,
							features: extractDishFeatures(name),
						};
					})
					.filter(nonNullable);

				return [date, {offers}]
			})
			.filter(nonNullable);

		return new Map(daysWithMenus);
	}
};

export default SicilyCafe;
