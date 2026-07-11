import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { useAuth } from '@/app/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dumbbell, Heart, Briefcase, Plus, CheckCircle2, Loader2, Pencil, Trash2 } from 'lucide-react';
import { LatinCross } from '@/app/components/icons/LatinCross';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Core4Domain } from '@/app/hooks/useCore4Stats';
import { AppIcon } from "@/app/components/icons/appIcons";

interface MissionItem {
  text: string;
  completed: boolean;
}

interface Core4Mission {
  id: string;
  user_id: string;
  domain: Core4Domain;
  title: string;
  items: MissionItem[];
  weekly_measurable: string | null;
  status: 'active' | 'completed' | 'archived';
  month_year: string;
  created_at: string | null;
  updated_at: string | null;
}

const domainConfig: Record<Core4Domain, { label: string; icon: React.ElementType; color: string }> = {
  body: { label: 'Body', icon: Dumbbell, color: 'text-[#2997FF]' },
  being: { label: 'Being', icon: LatinCross, color: 'text-[#2997FF]' },
  balance: { label: 'Balance', icon: Heart, color: 'text-[#2997FF]' },
  business: { label: 'Business', icon: Briefcase, color: 'text-[#2997FF]' },
};

function getMissionTimestamp(mission: Pick<Core4Mission, 'updated_at' | 'created_at'>) {
  const timestamp = new Date(mission.updated_at ?? mission.created_at ?? 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function dedupeActiveMissionsByDomain(rows: Core4Mission[]) {
  const latestByDomain = new Map<Core4Domain, Core4Mission>();

  for (const row of rows) {
    const existing = latestByDomain.get(row.domain);
    const isNewer =
      existing &&
      (getMissionTimestamp(row) > getMissionTimestamp(existing) ||
        (getMissionTimestamp(row) === getMissionTimestamp(existing) && row.id > existing.id));

    if (!existing || isNewer) {
      latestByDomain.set(row.domain, row);
    }
  }

  return [...latestByDomain.values()];
}

export function Core4MonthlyMissions() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Core4Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<Core4Mission | null>(null);
  const [newMission, setNewMission] = useState({
    domain: 'body' as Core4Domain,
    title: '',
    items: ['', '', '', ''],
    weekly_measurable: '',
  });

  const currentMonthYear = format(new Date(), 'yyyy-MM');

  const fetchMissions = useCallback(async () => {
    if (!user?.id) {
      setMissions([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('core4_monthly_missions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .eq('month_year', currentMonthYear)
        .order('updated_at', { ascending: false })
        .order('created_at', { ascending: false })
        .order('id', { ascending: false });

      if (error) throw error;
      
      // Parse items JSON
      const parsedMissions = (data || []).map(m => ({
        ...m,
        items: Array.isArray(m.items) ? m.items : [],
      })) as unknown as Core4Mission[];
      
      setMissions(dedupeActiveMissionsByDomain(parsedMissions));
    } catch (err) {
      console.error('Error fetching missions:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, currentMonthYear]);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const getMissionForDomain = (domain: Core4Domain): Core4Mission | null => {
    return missions.find(m => m.domain === domain) || null;
  };

  const openEditDialog = (mission: Core4Mission) => {
    setEditingMission(mission);
    setNewMission({
      domain: mission.domain,
      title: mission.title,
      items: [
        mission.items[0]?.text || '',
        mission.items[1]?.text || '',
        mission.items[2]?.text || '',
        mission.items[3]?.text || '',
      ],
      weekly_measurable: mission.weekly_measurable || '',
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingMission(null);
    setNewMission({
      domain: 'body',
      title: '',
      items: ['', '', '', ''],
      weekly_measurable: '',
    });
  };

  const handleSaveMission = async () => {
    if (!user?.id || !newMission.title.trim()) {
      toast.error('Please enter a mission title');
      return;
    }

    // Check if mission already exists for this domain (only for new missions)
    if (!editingMission && getMissionForDomain(newMission.domain)) {
      toast.error(`A mission already exists for ${domainConfig[newMission.domain].label}`);
      return;
    }

    try {
      const items: MissionItem[] = newMission.items
        .filter(item => item.trim())
        .map((text, idx) => ({ 
          text, 
          completed: editingMission?.items[idx]?.completed || false 
        }));

      if (editingMission) {
        // Update existing mission
        const { error } = await supabase
          .from('core4_monthly_missions')
          .update({
            title: newMission.title.trim(),
            items: items as never,
            weekly_measurable: newMission.weekly_measurable.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingMission.id);

        if (error) throw error;
        toast.success('Mission updated!');
      } else {
        // Create new mission
        const { error } = await supabase
          .from('core4_monthly_missions')
          .insert({
            user_id: user.id,
            domain: newMission.domain,
            title: newMission.title.trim(),
            items: items as never,
            weekly_measurable: newMission.weekly_measurable.trim() || null,
            month_year: currentMonthYear,
            status: 'active',
          });

        if (error) throw error;
        toast.success('Mission created!');
      }

      closeDialog();
      fetchMissions();
    } catch (err) {
      console.error('Error saving mission:', err);
      toast.error('Failed to save mission');
    }
  };

  const toggleMissionItem = async (missionId: string, itemIndex: number) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    const updatedItems = [...mission.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      completed: !updatedItems[itemIndex].completed,
    };

    // Optimistic update
    setMissions(prev => prev.map(m => 
      m.id === missionId ? { ...m, items: updatedItems } : m
    ));

    try {
      const { error } = await supabase
        .from('core4_monthly_missions')
        .update({ items: updatedItems as never, updated_at: new Date().toISOString() })
        .eq('id', missionId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating mission item:', err);
      fetchMissions(); // Revert on error
    }
  };

  const updateMissionStatus = async (missionId: string, status: 'active' | 'completed' | 'archived') => {
    try {
      const { error } = await supabase
        .from('core4_monthly_missions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', missionId);

      if (error) throw error;
      
      toast.success(status === 'completed' ? 'Mission marked complete!' : 'Mission updated');
      fetchMissions();
    } catch (err) {
      console.error('Error updating mission status:', err);
      toast.error('Failed to update mission');
    }
  };

  const archiveMission = async (missionId: string) => {
    const confirmed = window.confirm('Delete this monthly mission? You can create a new one for this domain afterward.');
    if (!confirmed) return;

    await updateMissionStatus(missionId, 'archived');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div id="monthly-missions" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Monthly Missions</h3>
          <p className="text-sm text-muted-foreground">
            One active mission per domain for this month. Quarterly Targets can fill empty domains and refresh generated missions you have not edited.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" onClick={() => setEditingMission(null)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Mission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <div className="flex items-center gap-3">
                {(() => {
                  const { icon: Icon, color } = domainConfig[newMission.domain];
                  return <Icon className={cn("h-8 w-8", color)} />;
                })()}
                <DialogTitle className={cn("text-2xl font-bold", domainConfig[newMission.domain].color)}>
                  {editingMission ? 'Edit' : ''} {domainConfig[newMission.domain].label.toUpperCase()}
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>MISSION</Label>
                <Input
                  placeholder="e.g., Run 50 miles this month"
                  value={newMission.title}
                  onChange={(e) => setNewMission(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>WEEKLY STRIKES</Label>
                {newMission.items.map((item, idx) => (
                  <Input
                    key={idx}
                    placeholder={`Week ${idx + 1}`}
                    value={item}
                    onChange={(e) => {
                      const items = [...newMission.items];
                      items[idx] = e.target.value;
                      setNewMission(prev => ({ ...prev, items }));
                    }}
                  />
                ))}
              </div>

              <div className="space-y-2">
                <Label>WHY IS THIS IMPORTANT? (optional)</Label>
                <Textarea
                  placeholder="Why does this mission matter this month?"
                  value={newMission.weekly_measurable}
                  onChange={(e) => setNewMission(prev => ({ ...prev, weekly_measurable: e.target.value }))}
                />
              </div>

              <Button onClick={handleSaveMission} className="w-full">
                {editingMission ? 'Save Changes' : 'Create Mission'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(domainConfig) as Core4Domain[]).map(domain => {
          const mission = getMissionForDomain(domain);
          const { label, icon: Icon, color } = domainConfig[domain];
          const completedCount = mission?.items.filter(i => i.completed).length || 0;
          const totalItems = mission?.items.length || 0;

          return (
            <Card key={domain} className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className={cn("h-5 w-5", color)} />
                  <CardTitle className="text-base">{label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {mission ? (
                  <div className="space-y-3">
                    <p className="font-medium text-sm">{mission.title}</p>
                    
                    {mission.items.length > 0 && (
                      <div className="space-y-2">
                        {mission.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Checkbox
                              checked={item.completed}
                              onCheckedChange={() => toggleMissionItem(mission.id, idx)}
                            />
                            <span className={cn(
                              "text-sm",
                              item.completed && "line-through text-muted-foreground"
                            )}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {mission.weekly_measurable && (
                      <p className="text-xs text-muted-foreground border-t border-border pt-2 mt-2">
                        <AppIcon name="metric" className="mr-1.5 inline h-3.5 w-3.5" />{mission.weekly_measurable}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        {completedCount}/{totalItems} complete
                      </span>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-xs"
                          onClick={() => openEditDialog(mission)}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-[#2997FF] hover:text-[#2997FF]"
                          onClick={() => archiveMission(mission.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-xs text-[#2997FF] hover:text-[#2997FF]"
                          onClick={() => updateMissionStatus(mission.id, 'completed')}
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Complete
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setNewMission(prev => ({ ...prev, domain }));
                      setDialogOpen(true);
                    }}
                    className="w-full py-6 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Mission
                  </button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
