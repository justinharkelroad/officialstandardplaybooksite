import { useFeatureFlag } from '@/app/lib/featureFlags';
import { useParams } from 'react-router-dom';
import FlowSessionAgent from './FlowSessionAgent';
import FlowSessionLegacy from './FlowSessionLegacy';

export default function FlowSession() {
  const { slug } = useParams<{ slug: string }>();
  const useAgent = useFeatureFlag('agent_driven_flows');
  const requiresAgent = slug === 'bible' || slug === 'daily-frame'
    || slug === 'profile-builder' || slug === 'profile-reprofile';
  return useAgent || requiresAgent ? <FlowSessionAgent /> : <FlowSessionLegacy />;
}
