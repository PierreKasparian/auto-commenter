'use client';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export default function Account() {
  const [isLoading, setIsLoading] = useState(false);

  const handleManageSubscription = async () => {
    setIsLoading(true);
    const supabase = await createClient();
    const {data: user } = await supabase.auth.getUser();
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        body: JSON.stringify({ user_id: user.user?.id }),
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Account</h1>
      <button onClick={handleManageSubscription} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Manage Subscription'}
      </button>
    </div>
  );
}