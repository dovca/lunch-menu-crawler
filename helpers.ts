import {format} from 'date-fns';
import {DishFeature} from '~/types/menu';
import {toPairs} from 'lodash-es';

const dishFeatureRegexMap: Record<DishFeature, RegExp> = {
	[DishFeature.APPLE]: /\bjabl[eík]/i,
	[DishFeature.ARUGULA]: /\brukol/i,
	[DishFeature.ASPARAGUS]: /\bchřest/i,
	[DishFeature.AVOCADO]: /\bavokád/i,
	[DishFeature.BACON]: /\bslanin/i,
	[DishFeature.BAGUETTE]: /\bbaget/i,
	[DishFeature.BAKED]: /peč[eí][nň]/i,
	[DishFeature.BASIL]: /\bbazal/i,
	[DishFeature.BEAN]: /\bfazol/i,
	[DishFeature.BEEF]: /\b(hovězí|telecí)/i,
	[DishFeature.BEETROOT]: /řep[anoy]/i,
	[DishFeature.BLACK_PEPPER]: /\bpepř/i,
	[DishFeature.BOAR]: /\b(kan(čí|ec)|divočá)/i,
	[DishFeature.BOILED]: /vařen/i,
	[DishFeature.BREAD]: /\bchl[eé]b/i,
	[DishFeature.BROCCOLI]: /\bbrokol/i,
	[DishFeature.BUTTER]: /\bmásl/i,
	[DishFeature.CABBAGE]: /\bzel([ínň]|o\b)/i,
	[DishFeature.CAPER]: /\bkapar/i,
	[DishFeature.CARAWAY]: /\bkmín/i,
	[DishFeature.CARROT]: /\b(mrke?v|karotk)/i,
	[DishFeature.CAULIFLOWER]: /\bkvěták/i,
	[DishFeature.CELERY]: /\bceler/i,
	[DishFeature.CHEESE]: /\b(sýr|parm[ae][sz][aá]n|gorgon|hermelín|niv[ao]|eidam|goud)|(č|\bch)edd?ar/i,
	[DishFeature.CHICKEN]: /\b(kuř(e(cí)?|átk[ao])|drůbeží?|slepi[cč])/i,
	[DishFeature.CHICKPEA]: /\bcizrn/i,
	[DishFeature.CHILLI]: /\b(chil+i|jalape|(č|ch)ipotl)/i,
	[DishFeature.CHIVE]: /\bpažitk/i,
	[DishFeature.CITRUS]: /\bcitrus/i,
	[DishFeature.COCONUT]: /\bkokos/i,
	[DishFeature.CORN]: /\bkukuři/i,
	[DishFeature.CRANBERRY]: /\bbrusink/i,
	[DishFeature.CREAM]: /\bsmetan/i,
	[DishFeature.CROUTON]: /\bkrut[oó]n/i,
	[DishFeature.CUCUMBER]: /\bokurk/i,
	[DishFeature.CURD]: /\btvaroh/i,
	[DishFeature.DESSERT]: /\bde[sz]ert/i,
	[DishFeature.DILL]: /\bkopr/i,
	[DishFeature.DRESSING]: /\bdress?in[kg]/i,
	[DishFeature.DRIED]: /sušen(?!k)/i,
	[DishFeature.DUCK]: /\bkachn/i,
	[DishFeature.DUMPLING]: /\b(knedl|hk\b)/i,
	[DishFeature.EGG]: /\b(vejc|vaj[eí]č)/i,
	[DishFeature.EGGPLANT]: /\b(lile?k|melanzane)/i,
	[DishFeature.FILLED]: /plněn/i,
	[DishFeature.FILLET]: /\bfil[eé]t?/i,
	[DishFeature.FISH]: /\b(ryb[aí](?!z)|candát|tres[čk]|kap[rř]|fish)/i,
	[DishFeature.FRESH]: /čerstv/i,
	[DishFeature.FRIED]: /smaž/i,
	[DishFeature.FRIES]: /\bhranolk/i,
	[DishFeature.GARLIC]: /česn[e.]/i,
	[DishFeature.GINGER]: /\bzázv/i,
	[DishFeature.GNOCCHI]: /\b(gnocchi|noky)/i,
	[DishFeature.GOULASH]: /guláš/i,
	[DishFeature.GRILLED]: /gril/i,
	[DishFeature.HALUSKY]: /\bhalušk/i,
	[DishFeature.HAM]: /šunk/i,
	[DishFeature.HAMBURGER]: /burger/i,
	[DishFeature.HERB]: /\bbylin/i,
	[DishFeature.HORSERADISH]: /\bkřen/i,
	[DishFeature.JUICE]: /šťáv/i,
	[DishFeature.KARBANATEK]: /\bkarbanát/i,
	[DishFeature.LAMB]: /\bjehně/i,
	[DishFeature.LARD]: /\bsáde?l/i,
	[DishFeature.LEEK]: /\bpóre?k/i,
	[DishFeature.LEMON]: /\bcitr[oó]n/i,
	[DishFeature.LENTIL]: /\bčočk/i,
	[DishFeature.LIME]: /\blimet/i,
	[DishFeature.LIVER]: /\bjátr/i,
	[DishFeature.MARJORAM]: /\bmajorán/i,
	[DishFeature.MASHED]: /\bmačk|šťouch/i,
	[DishFeature.MAYONNAISE]: /\bmajo(lk|néz)/i,
	[DishFeature.MEAT]: /\bmas(o|em)/i,
	[DishFeature.MILK]: /\bmlé[čk]/i,
	[DishFeature.MINCED]: /mlet/i,
	[DishFeature.MUSHROOM]: /\b(houb|hříbk|hlív|hub\b)|žampi[oó]n/i,
	[DishFeature.NOODLES]: /\bnudl[eo]/i,
	[DishFeature.NUT]: /\boř[eí]/i,
	[DishFeature.OIL]: /\bolej/i,
	[DishFeature.ONION]: /\bcibul/i,
	[DishFeature.PARSLEY]: /\bpetrželk/i,
	[DishFeature.PASTA]: /\b(těstovin|la[sz]ag?[nň]|penne|tagliat|fusil+i|papardelle)|[sš]pagh?et|[ao]fleky|špecle|sp[aä]tzle\b/i,
	[DishFeature.PEA]: /\bhr(ach|áše?k)/i,
	[DishFeature.PEANUT]: /\barašíd/i,
	[DishFeature.PEPPER]: /\bpapr/i,
	[DishFeature.PESTO]: /\bpest(o|em)\b/i,
	[DishFeature.PIZZA]: /\bpizza/i,
	[DishFeature.PORK]: /\bvepř/i,
	[DishFeature.POTATO]: /\b(br(\.|am(\.|b[oů]r(?!á)))|grenaill)/i,
	[DishFeature.PUREE]: /\b(kaš[eí]|pyré)/i,
	[DishFeature.RABBIT]: /\b(král[ií]|zaj(eč|íc))/i,
	[DishFeature.RICE]: /\b(rýž|ri[sz]ot+o)/i,
	[DishFeature.SALAD]: /\bsalát/i,
	[DishFeature.SALMON]: /\blosos/i,
	[DishFeature.SAUCE]: /\b(omáčk|dip\b)/i,
	[DishFeature.SAUSAGE]: /\b(páre?k|klobás|[bv]uřt)|špekáč/i,
	[DishFeature.SCHNITZEL]: /říze?[čk]/i,
	[DishFeature.SESAME]: /\bsezam/i,
	[DishFeature.SKEWER]: /špíz/i,
	[DishFeature.SMOKED]: /\b(za|vy)?uzen/i,
	[DishFeature.SOUP]: /\b(polévk|vývar\b)/i,
	[DishFeature.SPICE]: /\bkořen[íě]/i,
	[DishFeature.SPICY]: /\b(pikant|páliv|ostr)/i,
	[DishFeature.SPINACH]: /špen/i,
	[DishFeature.STEAK]: /\b(steak|krkovi[cč]|panenk)/i,
	[DishFeature.STRAWBERRY]: /\bjah[oů]d/i,
	[DishFeature.SVICKOVA]: /\bsvíčkov/i,
	[DishFeature.TOAST]: /\bto[au]st/i,
	[DishFeature.TOMATO]: /\braj(sk|č)/i,
	[DishFeature.TORTILLA]: /\btortil/i,
	[DishFeature.TURKEY]: /\bkrůt/i,
	[DishFeature.VEGETABLE]: /\bzelenin/i,
	[DishFeature.WHEAT]: /\bpšen/i,
	[DishFeature.WHIPPED]: /šleha/i,
	[DishFeature.WINE]: /\bv(í|in)n/i,
	[DishFeature.YOGURT]: /\bjogurt/i,
	[DishFeature.ZUCCHINI]: /\bcuket/i,
}

export function nonNullable<T>(value: T): value is NonNullable<T> {
	return value !== null && value !== undefined;
}

export function makeTimestamp(date: Date): string {
	return format(date, 'yyyy-LL-dd');
}

export function extractDishFeatures(name: string) {
	const pairs = toPairs(dishFeatureRegexMap) as [DishFeature, RegExp][];

	return pairs
		.map<[DishFeature, number] | null>(([feature, regexp]) => {
			const match = regexp.exec(name);
			return match ? [feature, match.index] : null;
		}, [])
		.filter(nonNullable)
		.sort(([,a], [,b]) => a - b)
		.map(([feature]) => feature);
}

export function sanitizeWhitespace(str: string): string {
	return str
		.replaceAll(/\s+/g, ' ')
		.trim()
}
