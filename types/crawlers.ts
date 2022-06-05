import {DailyMenu} from '~/types/menu';

type ICrawlerResult = Map<Date, DailyMenu>

interface ICrawler {
	readonly id: string
	readonly name: string
	readonly crawlUrl: string
	readonly crawlHeaders?: Record<string, string>
	readonly encoding?: string
	crawl: (data: string) => Promise<ICrawlerResult>
}



export {ICrawlerResult, ICrawler};
