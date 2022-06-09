import {defineNitroConfig} from 'nitropack';

export default defineNitroConfig({
	storage: {
		'/redis': {
			driver: 'redis',
			password: process.env.REDIS_PASSWORD,
		}
	}
});
