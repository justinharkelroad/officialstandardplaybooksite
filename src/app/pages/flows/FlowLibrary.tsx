import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/app/lib/supabaseClient';
import { useAuth } from '@/app/lib/auth';
import { FlowSession } from '@/app/types/flows';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Clock, CheckCircle2, FileEdit, ChevronRight, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { FlowTypeIcon } from '@/app/components/flows/FlowTypeIcon';
import { AppIcon } from "@/app/components/icons/appIcons";

export default function FlowLibrary() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sessions, setSessions] = useState<FlowSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('completed');
  const [activeSessionIconId, setActiveSessionIconId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchSessions();
    }
  }, [user?.id]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('flow_sessions')
        .select('*, flow_template:flow_templates(id, name, slug, icon)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions((data || []) as unknown as FlowSession[]);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = session.title?.toLowerCase().includes(query);
      const matchesType = session.flow_template?.name?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesType) return false;
    }
    
    // Type filter
    if (filterType !== 'all' && session.flow_template?.slug !== filterType) {
      return false;
    }
    
    // Status filter
    if (filterStatus !== 'all' && session.status !== filterStatus) {
      return false;
    }
    
    return true;
  });

  // Get unique flow types for filter
  const flowTypes = [...new Set(sessions.map(s => s.flow_template?.slug).filter(Boolean))];
  const completedCount = sessions.filter(session => session.status === 'completed').length;
  const draftCount = sessions.filter(session => session.status === 'in_progress').length;

  const handleSessionClick = (session: FlowSession) => {
    if (session.status === 'completed') {
      navigate(`/app/flows/view/${session.id}`);
    } else {
      navigate(`/app/flows/session/${session.flow_template?.slug}`);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-10 bg-muted rounded" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/app/flows')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={1.5} />
          Back to Flows
        </Button>
        
        <h1 className="text-2xl font-medium flex items-center gap-2">
          <AppIcon name="library" className="h-5 w-5" /> Your Flow Library
        </h1>
        <p className="text-muted-foreground/70 mt-1">
          {completedCount} completed {draftCount > 0 ? `• ${draftCount} draft${draftCount === 1 ? '' : 's'}` : ''}
        </p>
        <p className="text-sm text-muted-foreground/60 mt-1">
          Showing completed flows by default. Switch the status filter to resume drafts.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search flows..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {flowTypes.map(type => (
              <SelectItem key={type} value={type!}>
                {type!.charAt(0).toUpperCase() + type!.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <Card className="border-border/10">
          <CardContent className="p-8 text-center">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" strokeWidth={1} />
            {sessions.length === 0 ? (
              <>
                <h3 className="font-medium mb-2">No flows yet</h3>
                <p className="text-sm text-muted-foreground/70 mb-4">
                  Start your first Flow to begin building your library.
                </p>
                <Button onClick={() => navigate('/app/flows')}>
                  Start a Flow
                </Button>
              </>
            ) : (
              <>
                <h3 className="font-medium mb-2">No matches found</h3>
                <p className="text-sm text-muted-foreground/70">
                  Try adjusting your search or filters.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredSessions.map(session => (
            <Card
              key={session.id}
              className="cursor-pointer hover:bg-accent/5 transition-colors border-border/10"
              onClick={() => handleSessionClick(session)}
              onMouseEnter={() => setActiveSessionIconId(session.id)}
              onMouseLeave={() => setActiveSessionIconId(null)}
              onFocus={() => setActiveSessionIconId(session.id)}
              onBlur={() => setActiveSessionIconId(null)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FlowTypeIcon
                    flowSlug={session.flow_template?.slug}
                    
                    size="md"
                    active={activeSessionIconId === session.id}
                    className="text-foreground"
                  />
                  <div>
                    <h4 className="font-medium">
                      {session.title || 'Untitled Flow'}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground/70">
                      <span>{session.flow_template?.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(session.created_at), 'MMM d, yyyy')}
                      </span>
                      {session.domain && (
                        <>
                          <span>•</span>
                          <span>{session.domain}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {session.status === 'completed' ? (
                    <span className="flex items-center gap-1 text-sm text-[#2997FF]">
                      <CheckCircle2 className="h-4 w-4" />
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-[#2997FF]">
                      <FileEdit className="h-4 w-4" />
                      Draft
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
