<script setup lang="ts">
	import {makeTimestamp} from '~/helpers';
	import {isWeekend, startOfToday, nextMonday} from 'date-fns';
	import {navigateTo} from '#app';

	let today = startOfToday();
	const nextDate = isWeekend(today) ? nextMonday(today) : today;
	const timestamp = makeTimestamp(nextDate);

	navigateTo({name: 'menu-timestamp', params: {timestamp}}, {replace: true, redirectCode: 302});
</script>
