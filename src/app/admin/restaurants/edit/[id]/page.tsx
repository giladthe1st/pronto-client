import EditRestaurantPage from '@/components/admin/restaurants/edit';
import { use } from 'react';

export default function AdminRestaurantsEditPage({ params }: {params: Promise<{ id: string }>}) {
  const { id } = use(params);
  return <EditRestaurantPage id={id} />;
}