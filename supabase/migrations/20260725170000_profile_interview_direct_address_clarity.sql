-- Make every profile-interview question explicit about the shape of the answer,
-- and make all adaptive coaching address the member directly.

UPDATE public.flow_templates
SET
  questions_json = $questions$[
    {
      "id":"preferred_name",
      "type":"text",
      "prompt":"Before we begin, what first name or nickname should I use when I speak to you?",
      "required":true,
      "placeholder":"The name you want me to call you."
    },
    {
      "id":"life_roles",
      "type":"textarea",
      "prompt":"List the roles you carry in this season. Then tell me which one takes the most from you right now and which one is getting the least attention.",
      "required":false,
      "placeholder":"For example: parent, spouse, business owner, employee, caregiver, leader, creative, or athlete. Add any others that fit you."
    },
    {
      "id":"core_values",
      "type":"textarea",
      "prompt":"List exactly five values that guide your decisions, in order from most important to least important. If your top two values conflict, which one usually wins?",
      "required":false,
      "placeholder":"For example: Faith, Family, Health, Connection, Impact. Use your own values and put them in order."
    },
    {
      "id":"current_goals",
      "type":"textarea",
      "prompt":"Choose one area: Body, Being, Balance, or Business. In that one area, what single result do you want in the next 90 days? Include the specific finish line that will tell you it is done.",
      "required":false,
      "placeholder":"Area: Body. Result: Run a 10K without stopping by October 20."
    },
    {
      "id":"current_challenges",
      "type":"textarea",
      "prompt":"Think about the one 90-day result you just named. What pattern keeps getting in your way repeatedly? Describe what you do and what usually triggers it.",
      "required":false,
      "placeholder":"Name the repeated loop, not a one-time obstacle."
    },
    {
      "id":"peak_state",
      "type":"textarea",
      "prompt":"Think of one recent day when you felt and performed at your best. What was present that day? Name the routine, environment, people, and choices that helped you.",
      "required":false,
      "placeholder":"Describe what was observably different on that specific day."
    },
    {
      "id":"growth_edge",
      "type":"textarea",
      "prompt":"What is the one area where you know you need to grow but keep avoiding the work?",
      "required":false,
      "placeholder":"Name the work you keep putting off, even if it is not the impressive answer."
    },
    {
      "id":"overwhelm_response",
      "type":"textarea",
      "prompt":"When you feel overwhelmed, what do you usually do first? Name your actual default behavior without judging it.",
      "required":false,
      "placeholder":"For example: I shut down, overwork, get controlling, go quiet, or numb out."
    },
    {
      "id":"accountability_style",
      "type":"select",
      "prompt":"Choose the one accountability style most likely to help you follow through.",
      "required":false,
      "options":[
        "Direct challenge - Tell me the hard truth",
        "Gentle nudge - Lead with encouragement",
        "Questions to discover - Help me figure it out myself"
      ]
    },
    {
      "id":"feedback_preference",
      "type":"select",
      "prompt":"Choose the one approach your coach should use when giving you feedback.",
      "required":false,
      "options":[
        "Blunt truth first - Don't sugarcoat it",
        "Encouragement then truth - Acknowledge before challenging",
        "Questions that let me discover it - Socratic approach"
      ]
    },
    {
      "id":"spiritual_beliefs",
      "type":"textarea",
      "prompt":"Does faith or a spiritual tradition shape how you live? If yes, what should your coach understand about it? This is optional, so you may skip it.",
      "required":false,
      "placeholder":"Describe the faith or spiritual context you want your coach to respect, or skip."
    },
    {
      "id":"background_notes",
      "type":"textarea",
      "prompt":"What is the one additional piece of context your coach needs to understand you well? It could be about your family, health, current season, or how to speak to you when you drift.",
      "required":false,
      "placeholder":"Share the context that makes your other answers easier to understand."
    }
  ]$questions$::jsonb,
  coach_prompt = $coach$You are The Standard Flow Interviewer. Help the person in front of you create an honest profile for better Flow coaching.

Speak to the person, never about them. Every acknowledgment, reflection, transition, and follow-up must use second-person language such as "you" and "your." Never refer to the person by name as though they are absent. Never describe the person as "he," "she," or "they." Do not write profile notes or case-study narration in the conversation. Reflect the meaning directly instead of saying "you said," "you shared," or "you clarified."

Sound like a coach who has been in the fight, not a form. Be warm, direct, brief, and free of corporate language, guru language, and hype. Use short sentences. Honor hard truths before moving. Faith awareness is welcome, but never forced.

Person first, producer second. Use Business, Being, Body, and Balance as the lens. People often hide in Business. When the other three are missing, invite the whole person into the answer.

This is an interview, not field validation. Treat the first answer as a starting point. Ask at most one follow-up for an official question, and only when it will uncover the truth, make the answer concrete, or expose a recurring loop. Ask one clear question at a time. Never combine several requests into one follow-up. Never shame, diagnose, assign motive, invent facts, or agree with a self-attack.

Keep each official answer in its requested shape:
- preferred_name: one first name or nickname.
- life_roles: the roles, the one carrying the most weight, and the one getting the least attention.
- core_values: exactly five ordered values and which wins when the top two conflict.
- current_goals: one of the four areas, one 90-day result, and one observable finish line.
- current_challenges: one recurring behavior loop and its usual trigger.
- peak_state: one real day and the observable conditions and choices that supported it.
- growth_edge: one avoided area of growth.
- overwhelm_response: the first default behavior under pressure.
- accountability_style and feedback_preference: one listed option.
- spiritual_beliefs: the context to respect, or a skip.
- background_notes: one additional piece of useful context.

Keep the interview moving. Do not produce the finished profile during the interview. The app builds a separate editable review after completion. Never claim the profile has been saved.$coach$,
  updated_at = now()
WHERE slug = 'profile-builder';

UPDATE public.flow_templates
SET
  questions_json = $questions$[
    {"id":"preferred_name","type":"text","prompt":"What first name or nickname should I use when I speak to you now? If it has not changed, say same as before.","required":true,"placeholder":"Your current name, or same as before."},
    {"id":"life_roles","type":"textarea","prompt":"List the roles you carry now. Then tell me which one takes the most from you, which one gets the least attention, and what changed since your last profile. If nothing changed, say same as before.","required":false,"placeholder":"Your roles now, the heaviest one, the least-attended one, and what changed."},
    {"id":"core_values","type":"textarea","prompt":"List exactly five values that guide you now, in order from most important to least important. If your top two conflict, which one wins? Tell me what changed, or say same as before.","required":false,"placeholder":"Your five ordered values, the value that wins, and what changed."},
    {"id":"current_goals","type":"textarea","prompt":"First, did you complete your previous 90-day result: yes, no, or partly? Then choose one area—Body, Being, Balance, or Business—and name one result for the next 90 days. Include the specific finish line that will tell you it is done.","required":false,"placeholder":"Previous result: partly. Area: Business. Next result: ... Finish line: ..."},
    {"id":"current_challenges","type":"textarea","prompt":"What one pattern is most likely to interfere with your new 90-day result? Describe what you do, what triggers it, and whether it is new, weaker, or the same as before.","required":false,"placeholder":"The repeated loop, its trigger, and how it changed."},
    {"id":"peak_state","type":"textarea","prompt":"Think of one recent day when you felt and performed at your best. What routine, environment, people, and choices helped you? Tell me what changed, or say same as before.","required":false,"placeholder":"One real day, the conditions that helped, and what changed."},
    {"id":"growth_edge","type":"textarea","prompt":"What is the one area where you know you need to grow but keep avoiding the work now? Tell me what changed, or say same as before.","required":false,"placeholder":"The one area you are avoiding now."},
    {"id":"overwhelm_response","type":"textarea","prompt":"When you feel overwhelmed now, what do you usually do first? Name your actual default behavior and tell me whether it changed, or say same as before.","required":false,"placeholder":"Your first default under pressure and what changed."},
    {"id":"accountability_style","type":"select","prompt":"Choose the one accountability style most likely to help you follow through now.","required":false,"options":["Keep my current setting","Direct challenge - Tell me the hard truth","Gentle nudge - Lead with encouragement","Questions to discover - Help me figure it out myself"]},
    {"id":"feedback_preference","type":"select","prompt":"Choose the one approach your coach should use when giving you feedback now.","required":false,"options":["Keep my current setting","Blunt truth first - Don't sugarcoat it","Encouragement then truth - Acknowledge before challenging","Questions that let me discover it - Socratic approach"]},
    {"id":"spiritual_beliefs","type":"textarea","prompt":"Does faith or a spiritual tradition shape how you live now? If yes, what should your coach understand? Tell me what changed, say same as before, or skip this optional question.","required":false,"placeholder":"What is true now, same as before, or skip."},
    {"id":"background_notes","type":"textarea","prompt":"What is the one additional change in your family, health, responsibilities, or current season that your coach needs to understand? If nothing important changed, say same as before.","required":false,"placeholder":"One important change, or same as before."}
  ]$questions$::jsonb,
  coach_prompt = $coach$You are The Standard Flow Interviewer. Help the person in front of you update an honest profile for better Flow coaching. Treat the existing profile as reference, not truth.

Speak to the person, never about them. Every acknowledgment, reflection, transition, and follow-up must use second-person language such as "you" and "your." Never refer to the person by name as though they are absent. Never describe the person as "he," "she," or "they." Do not write profile notes or case-study narration in the conversation. Reflect the meaning directly instead of saying "you said," "you shared," or "you clarified."

Be warm, direct, brief, and specific. Use short sentences. Ask whether old context still fits instead of assuming. Ask at most one follow-up for an official question, and only when the answer is unclear, incomplete, or consequential. Ask one clear question at a time. Never invent facts, diagnose, assign motives, shame, or agree with a self-attack.

Preserve the requested answer shape for every topic: one name; current roles plus the heaviest and least-attended roles; exactly five ordered values plus the value that wins; the prior goal scorecard plus one area, one new 90-day result, and one finish line; one recurring loop and trigger; one real best day and its conditions; one avoided growth area; one first overwhelm behavior; one accountability option; one feedback option; optional faith context; and one additional change.

Keep the interview moving. Do not produce or save the finished profile during the interview. The app builds a separate editable review after completion.$coach$,
  updated_at = now()
WHERE slug = 'profile-reprofile';
