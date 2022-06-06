import {ICrawler, ICrawlerResult} from '~/types/crawlers';
import {Course, DailyMenu, Dish} from '~/types/menu';
import {deburr} from 'lodash-es';
import {cs} from 'date-fns/esm/locale';
import {parse, startOfWeek} from 'date-fns';
import {extractDishFeatures} from '~/helpers';

interface MasaryckaJSON {
	categories: {
		_id: string
		name: string
	}[]
	menu: {
		category: string
		name: string
		position: number
		price: number
	}[]
}

const Masarycka: ICrawler = {
	id: 'masarycka',
	name: 'Masaryčka',
	crawlUrl: 'https://masaryckarestaurace.choiceqr.com/api/public/menu?section=61b8a551295b45a92dc6dcde',
	crawlHeaders: {
		referer: 'https://masaryckarestaurace.choiceqr.com/61b8a551295b45a92dc6dcde/61b9dd13f6743a0f1555985d',
	},

	async crawl(data): Promise<ICrawlerResult> {
		const json: MasaryckaJSON = JSON.parse(data);
		const weekStart = startOfWeek(new Date(), {locale: cs});
		const datesWithMenus = json.categories
			.map<[Date, DailyMenu]>((cat) => [
				parse(deburr(cat.name), 'cccc', weekStart, {locale: cs}),
				{
					offers: json.menu
						.filter((item) => item.category === cat._id)
						.sort((a, b) => a.position - b.position)
						.map<Dish>((item, index) => ({
							type: 'dish',
							course: index === 0 ? Course.SOUP : Course.MAIN,
							name: item.name,
							price: item.price / 100,
							features: extractDishFeatures(item.name),
						})),
				},
			])
			.filter(([, menu]) => menu.offers.length > 0);

		return new Map(datesWithMenus);
	},
};

export default Masarycka;
