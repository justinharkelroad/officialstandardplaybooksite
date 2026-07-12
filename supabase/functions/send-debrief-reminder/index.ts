// send-debrief-reminder — "your weekly debrief is ready", Sundays at 8am Eastern.
//
// Invoked by pg_cron hourly across 11:00-14:00 UTC on Sundays (see the
// 20260712180000 migration). Cron runs in UTC and Eastern moves with DST, so the
// schedule is deliberately wider than needed and the ACTUAL send decision is made
// here, against America/New_York local time. Redundant hours are harmless: the
// unique index on member_emails (member_id, kind, ref_key) means the first run to
// claim a member's send is the only one that sends.
//
// Caller must present the service-role key. There is no member-facing path in.

import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { sendMemberEmail } from '../_shared/member-email.ts';
import { BRAND, buildEmailHtml, EmailComponents, escapeHtml } from '../_shared/email-template.ts';

const APP_URL = 'https://standardplaybook.com/app';
const DEBRIEF_URL = `${APP_URL}/debrief`;
const SEND_HOUR_ET = 8;

interface EasternNow {
  year: number;
  month: number;
  day: number;
  hour: number;
  weekday: string;
}

/** Civil date + hour in America/New_York, DST included, without a date library. */
function easternNow(now: Date): EasternNow {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    weekday: 'short',
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    // Some ICU builds render midnight as '24' under hour12:false.
    hour: Number(get('hour')) % 24,
    weekday: get('weekday'),
  };
}

/**
 * ISO week key ('2026-W28') for a civil date — must match the client's
 * getWeekKey() in src/app/lib/date-utils.ts or the reminder targets the wrong
 * row and every member gets mailed about a debrief they already finished.
 */
function isoWeekKey(year: number, month: number, day: number): string {
  const d = new Date(Date.UTC(year, month - 1, day));
  const dayNum = d.getUTCDay() || 7; // Monday=1 .. Sunday=7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum); // Thursday of this ISO week
  const isoYear = d.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${isoYear}-W${String(week).padStart(2, '0')}`;
}

/** Monday..Sunday range of an ISO week key, formatted the way the app formats it. */
function weekLabelFor(weekKey: string): string {
  const [yearStr, weekStr] = weekKey.split('-W');
  const isoYear = Number(yearStr);
  const week = Number(weekStr);

  const jan4 = new Date(Date.UTC(isoYear, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - jan4Day + 1);

  const monday = new Date(week1Monday);
  monday.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const month = (d: Date) =>
    new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(d);
  const sameMonth = monday.getUTCMonth() === sunday.getUTCMonth();

  return sameMonth
    ? `${month(monday)} ${monday.getUTCDate()} – ${sunday.getUTCDate()}, ${sunday.getUTCFullYear()}`
    : `${month(monday)} ${monday.getUTCDate()} – ${month(sunday)} ${sunday.getUTCDate()}, ${sunday.getUTCFullYear()}`;
}

function buildReminderHtml(firstName: string, weekLabel: string): string {
  return buildEmailHtml({
    title: 'Your weekly debrief is ready',
    subtitle: weekLabel,
    eyebrow: 'WEEKLY DEBRIEF',
    footerName: BRAND.name,
    bodyContent: `
      ${EmailComponents.paragraph(`${escapeHtml(firstName)},`)}
      ${EmailComponents.paragraph(
        'The week is closed. Before you plan the next one, look honestly at the one you just ran — ' +
          'what you scored, where you drifted, and the one big thing that carries forward.',
      )}
      ${EmailComponents.paragraph('It takes about ten minutes. You get a coaching report at the end.')}
      ${EmailComponents.button('Run my debrief', DEBRIEF_URL)}
      ${EmailComponents.infoText('The debrief stays open through Sunday.')}
    `,
  });
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const presented = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '').trim();
  if (!serviceKey || presented !== serviceKey) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // `force` lets us run the whole path on demand instead of waiting for Sunday.
  // It bypasses the clock gate only — never the dedupe, never the "already
  // completed" skip. A forced run is a real send to real members.
  let force = false;
  try {
    const body = await req.json();
    force = body?.force === true;
  } catch {
    // Empty body is the normal cron shape.
  }

  const now = new Date();
  const et = easternNow(now);
  const isSendTime = et.weekday === 'Sun' && et.hour === SEND_HOUR_ET;

  if (!isSendTime && !force) {
    return new Response(
      JSON.stringify({
        skipped: 'outside send window',
        eastern: `${et.weekday} ${et.hour}:00`,
        expected: `Sun ${SEND_HOUR_ET}:00`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey, {
    auth: { persistSession: false },
  });

  const weekKey = isoWeekKey(et.year, et.month, et.day);
  const weekLabel = weekLabelFor(weekKey);

  const { data: members, error: membersError } = await supabase
    .from('members')
    .select('id, full_name, email')
    .eq('is_active', true);

  if (membersError) {
    console.error('send-debrief-reminder: member fetch failed:', membersError.message);
    return new Response(JSON.stringify({ error: membersError.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Anyone who already sealed this week's debrief gets nothing.
  const { data: done, error: doneError } = await supabase
    .from('weekly_reviews')
    .select('user_id')
    .eq('week_key', weekKey)
    .eq('status', 'completed');

  if (doneError) {
    console.error('send-debrief-reminder: review fetch failed:', doneError.message);
    return new Response(JSON.stringify({ error: doneError.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const completed = new Set((done ?? []).map((r) => r.user_id as string));
  const tally = { sent: 0, duplicate: 0, failed: 0, skipped_no_key: 0, already_completed: 0, no_email: 0 };

  for (const member of members ?? []) {
    if (completed.has(member.id)) {
      tally.already_completed++;
      continue;
    }
    if (!member.email) {
      tally.no_email++;
      continue;
    }

    const firstName = (member.full_name ?? '').trim().split(/\s+/)[0] || 'there';
    const result = await sendMemberEmail({
      supabase,
      memberId: member.id,
      to: member.email,
      kind: 'debrief_reminder',
      refKey: weekKey,
      subject: `Your weekly debrief is ready — ${weekLabel}`,
      html: buildReminderHtml(firstName, weekLabel),
    });

    tally[result.status]++;
  }

  console.log(`send-debrief-reminder: week=${weekKey} ${JSON.stringify(tally)}`);
  return new Response(JSON.stringify({ week_key: weekKey, forced: force && !isSendTime, ...tally }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
