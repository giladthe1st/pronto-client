import EditRestaurantPage from '@/components/admin/restaurants/edit';

export default function AdminRestaurantsEditPage({ params }: { params: { id: string } }) {
  return <EditRestaurantPage id={params.id} />;
}
