import {test} from 'node:test';
import assert from 'node:assert/strict';
import {advisorAllowed} from './advisorScope';
test('Standard chat appears only on the public homepage and /start',()=>{
 for(const host of ['standardplaybook.com','www.standardplaybook.com'])for(const path of ['/','/start'])assert.ok(advisorAllowed('standard',host,path));
 for(const path of ['/bold','/app','/login','/boardroom','/paag','/start/','/started','/book'])assert.ok(!advisorAllowed('standard','standardplaybook.com',path));
 for(const host of ['myagencybrain.com','livecallcoach.ai','standardplaybook.com.evil.test','localhost'])assert.ok(!advisorAllowed('standard',host,'/start'));
 assert.ok(advisorAllowed('standard','localhost','/start',true));
});
