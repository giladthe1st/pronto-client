// lets add a components for a deal, we will grab it from http://localhost:3001/api/deals based on the restaurant ID
/*
  {
    "id": 4,
    "created_at": "2025-03-09T16:52:39.116637+00:00",
    "details": "Family Value #2\n2 Large 15\" 2 Topping Pizzas Plus Salad and Breadsticks\n$59.00",
    "restaurant_id": 1,
    "summarized_deal": "Family Value #2: 2 Small 15\" 2-Topping Pizzas + Salad & Breadsticks - $59",
    "price": 59,
    "restaurant_name": "Nicolinos"
  }

*/
import { useEffect, useState } from 'react';
import type { Deal } from '@/types/deals';

const Deal: React.FC<{ restaurantId: number }> = ({ restaurantId }) => {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/deals/${restaurantId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch deal');
        }
        const data = await response.json();
        setDeal(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [restaurantId]);

  if (loading) return <div>Loading deal...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!deal) return <div>No deal available</div>;

  return (
    <div className="deal-container">
      <div className="deal-summary">
        <strong> Summarized Deal: {deal.summarized_deal} </strong>
      </div>
      <div className="deal-details">
        <p>Details: {deal.details}</p>
      </div>
      <div className="deal-price">
        Price: ${deal.price}
      </div>
    </div>
  );
};

export default Deal;

