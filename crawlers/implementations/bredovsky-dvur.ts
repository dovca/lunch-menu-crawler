import cheerio from 'cheerio';
import {ICrawler} from '~/types/crawlers';
import {first, last} from 'lodash-es';
import {eachDayOfInterval, parse, startOfToday} from 'date-fns';
import {extractDishFeatures, sanitizeWhitespace} from '~/helpers';
import {Course, DailyMenu, Dish} from '~/types/menu';


const BredovskyDvur: ICrawler = {
	id: 'bredovsky-dvur',
	name: 'Bredovský dvůr',
	crawlUrl: 'https://restauracebredovskydvur.cz/#poledni-nabidka',

	async crawl(data) {
		const $ = cheerio.load(data);
		const wrapper = $('.wpb_wrapper');
		const title = $('.vc_custom_heading', wrapper).eq(0).text();

		let dateTexts = title.split(' ').filter((t) => /\d/.test(t));

		if (dateTexts.length === 1) {
			dateTexts = first(dateTexts).split('-');
		}

		const lastDate = parse(last(dateTexts), 'd.M.', startOfToday());
		const firstDate = parse(first(dateTexts), 'd', lastDate);
		const dates = eachDayOfInterval({
			start: firstDate,
			end: lastDate,
		});

		const menuItems = $('.dine-menu-item', wrapper);
		const dishes = menuItems.toArray().map<Dish>((item) => {
			const price = parseInt($('.menu-item-price', item).text());
			const name = sanitizeWhitespace($('.menu-item-name, .menu-item-desc', item).text());
			const features = extractDishFeatures(name);

			return {
				type: 'dish',
				course: Course.MAIN,
				name,
				price,
				features,
			};
		});

		const menu: DailyMenu = {
			offers: dishes
		};

		const datesWithDishes = dates.map<[Date, DailyMenu]>((date) => [date, menu]);

		return new Map(datesWithDishes);
	},
};

export default BredovskyDvur;
