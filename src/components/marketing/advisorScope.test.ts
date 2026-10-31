import {test} from 'node:test';
import assert from 'node:assert/strict';
import {advisorAllowed} from './advisorScope';
test('Standard chat only appears on the exact public homepage',()=>{
 for(const host of ['standardplaybook.com','www.standardplaybook.com'])assert.ok(advisorAllowed('standard',host,'/'));
 for(const path of ['/bold','/app','/login','/boardroom','/paag'])assert.ok(!advisorAllowed('standard','standardplaybook.com',path));
 for(const host of ['myagencybrain.com','livecallcoach.ai','standardplaybook.com.evil.test','localhost'])assert.ok(!advisorAllowed('standard',host,'/'));
 assert.ok(advisorAllowed('standard','localhost','/',true));
});
