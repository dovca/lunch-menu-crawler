<template>
	<h1 v-text="format(date, 'd. M. yyyy')" />
	<v-list>
		<v-list-item
			v-for="(dish, index) in combinedDishes"
			:key="index"
			:title="dish.name"
			:subtitle="dish.restaurant"
			two-line
		>
			<template #append>
				<span v-text="formatDishPrice(dish.price)" />
			</template>
		</v-list-item>
	</v-list>
</template>

<script setup lang="ts">
	import {format, parse} from 'date-fns';
	import {DailyMenu} from '~/types/menu';

	const route = useRoute();
	const {timestamp} = route.params;
	const date = parse(timestamp, 'yyyy-MM-dd', new Date());

	const {data: menusData} = useFetch(() => `/api/menus/${timestamp}`, {retry: false});
	const {data: restaurantsData} = useFetch(() => '/api/restaurants', {retry: false});
	const combinedDishes = computed(() => menusData.value?.menus
		? Object
			.keys(menusData.value.menus)
			.reduce((acc, key) => [
				...acc,
				...menusData.value.menus[key].offers.map((offer) => ({
					...offer,
					restaurant: restaurantsData.value[key]?.name ?? key,
				})),
			], []) as DailyMenu[]
		: []
	);

	const formatDishPrice = (price: number | number[]) => (typeof price === 'number'
		? price.toString()
		: price.map((p) => p.toString()).join(' / ')) + ' Kč';
</script>
