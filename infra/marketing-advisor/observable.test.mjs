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
  assert.ok(validateRoutedReply({...base,question},decision));
});
test('all twenty patterns suggest observations rather than product choices',()=>{
 for(const p of k.routing.problemPatterns) for(const q of p.distinguishingQuestions) assert.equal(isServiceChoiceQuestion(q),false,p.id);
});
test('saved assistant questions cannot be repeated verbatim',()=>{
 assert.throws(()=>validateRoutedReply({...base,question:'What did the manager do?'},decision,[{role:'assistant',text:'Let’s get specific.\n\nWhat did the manager do?'}]),/repeated/);
});

test('handoffs also reject the consultant wording found in the live replay',()=>{
 assert.throws(()=>validateRoutedReply({...base,reply:'The main fix is your leadership rhythm.'},{allowedQuestions:0,actionIds:[],mode:'handoff'}),/jargon/);
});
