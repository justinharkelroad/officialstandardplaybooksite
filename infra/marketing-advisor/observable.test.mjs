import {getKnowledge} from './knowledge.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateRoutedReply,isServiceChoiceQuestion} from './engine/routing.mjs';

const k=getKnowledge('standard');
const base={reply:'',question:'',actionIds:[]};const decision={allowedQuestions:1,actionIds:[],mode:'discover'};
test('the abstract choices from the founder conversation are rejected',()=>{
 for(const question of [
  'Do you mainly need a manager accountability process built, or ongoing owner coaching so you lead that process consistently?',
  'Do you want help mostly with your leadership cadence, or with building a manager-run accountability process they can actually enforce?',
  'Are you looking for software or coaching?',
 ]) assert.throws(()=>validateRoutedReply({...base,question},decision),/observable/);
});
test('observable questions about behavior, authority and fear remain valid',()=>{
 for(const question of ['What did your manager do the last time someone missed the number?','What are they afraid will happen if they follow through?','What have you told them they can do without checking with you?','What software are they using today?'])
  assert.ok(validateRoutedReply({...base,question},decision,[{role:'user',text:'I have a sales manager.'}]));
});
test('all twenty patterns suggest observations rather than product choices',()=>{
 for(const p of k.routing.problemPatterns) for(const q of p.distinguishingQuestions) assert.equal(isServiceChoiceQuestion(q),false,p.id);
});
test('saved assistant questions cannot be repeated verbatim',()=>{
 assert.throws(()=>validateRoutedReply({...base,question:'What did the manager do?'},decision,[{role:'user',text:'I have a manager.'},{role:'assistant',text:'Let’s get specific.\n\nWhat did the manager do?'}]),/repeated/);
});

test('handoffs also reject the consultant wording found in the live replay',()=>{
 assert.throws(()=>validateRoutedReply({...base,reply:'The main fix is your leadership rhythm.'},{allowedQuestions:0,actionIds:[],mode:'handoff'}),/jargon/);
});


test('VC questions cannot turn an agency requirement into an individual miss',()=>{
 for(const question of ['The last time someone missed VC, what did their manager actually do?', 'The last time someone missed VC, what did you actually do next?', 'Which producer is not hitting VC?'])
  assert.throws(()=>validateRoutedReply({...base,question},decision),/agency-level/);
 for(const question of ['Which part of the agency’s VC requirement are you falling short on?', 'How are you checking the agency’s progress toward VC right now?', 'What individual activity goals have you set to support the agency’s VC result?'])
  assert.ok(validateRoutedReply({...base,question},decision));
});

test('discovery cannot presume a manager from an assistant question or ignore a correction',()=>{
 const question='What did your manager do about that?';
 assert.throws(()=>validateRoutedReply({...base,question},decision,[]),/assume a manager/);
 assert.throws(()=>validateRoutedReply({...base,question},decision,[{role:'assistant',text:'Your manager should review this.'}]),/assume a manager/);
 assert.throws(()=>validateRoutedReply({...base,question},decision,[{role:'user',text:'I have a manager.'},{role:'user',text:"I don't have a manager anymore."}]),/assume a manager/);
 assert.ok(validateRoutedReply({...base,question:'Who checks progress toward the agency goal?'},decision,[{role:'user',text:'I do not have a manager.'}]));
});


test('VC tracking questions cannot be repeated with only auxiliary verbs changed',()=>{
 const messages=[{role:'assistant',text:'How are you checking the agency’s progress toward VC right now?'}];
 assert.throws(()=>validateRoutedReply({...base,question:'How do you check the agency’s progress toward VC today?'},decision,messages),/repeated/);
 assert.ok(validateRoutedReply({...base,question:'When did the agency last hit VC?'},decision,messages));
 assert.ok(validateRoutedReply({...base,question:'Who checks the agency’s progress toward VC?'},decision,messages));
});
