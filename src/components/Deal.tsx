import { useEffect, useState } from 'react';
import type { Deal } from '@/types/deals';

const Deal: React.FC<{ restaurantId: number }> = ({ restaurantId }) => {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await fetch(`https://pronto-server.vercel.app/api/deals/${restaurantId}`);
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

