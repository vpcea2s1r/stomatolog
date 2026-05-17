import { getCollection } from 'astro:content';

export const allDistricts = await getCollection('districts');
