import {keyBy} from 'lodash-es';
import {ICrawler} from '~/types/crawlers';
import PotrefenaHusa from '~/crawlers/implementations/potrefena-husa';
import KolkovnaCelnice from '~/crawlers/implementations/kolkovna-celnice';
import Masarycka from '~/crawlers/implementations/masarycka';
import Tiskarna from '~/crawlers/implementations/tiskarna';
import BredovskyDvur from '~/crawlers/implementations/bredovsky-dvur';
import SicilyCafe from '~/crawlers/implementations/sicily-cafe';

const crawlers = keyBy([
	PotrefenaHusa,
	KolkovnaCelnice,
	Masarycka,
	Tiskarna,
	BredovskyDvur,
	SicilyCafe,
], 'id') as Record<string, ICrawler>;

export default crawlers;
