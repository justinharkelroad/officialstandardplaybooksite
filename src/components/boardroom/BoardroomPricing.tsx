import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import BoardroomPlanChoices, { type CheckoutAudience } from './BoardroomPlanChoices';
import { watchCheckoutAudience } from './checkoutAudience';
import './boardroomPlans.css';

export default function BoardroomPricing() {
  const [audience, setAudience] = useState<CheckoutAudience>('checking');

  useEffect(() => watchCheckoutAudience(supabase.auth, setAudience), []);

  return <BoardroomPlanChoices audience={audience} />;
}
