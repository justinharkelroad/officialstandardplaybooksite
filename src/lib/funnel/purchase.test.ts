import { test } from 'node:test';
import assert from 'node:assert/strict';
import { amountFrom, checkoutOptionFor, isCheckoutSessionId, purchaseEventId, thanksRedirectUrl } from './purchase';

test('only real Stripe session ids count as purchases', () => {
  assert.equal(isCheckoutSessionId('cs_live_b1B43GYYA85q4VCCKZv6V6ntpP3D5wuEFiQqMjyErNAzUp3Q3BVe4n2Qki'), true);
  assert.equal(isCheckoutSessionId('cs_test_a1b2c3d4e5f6g7h8'), true);
  assert.equal(isCheckoutSessionId('{CHECKOUT_SESSION_ID}'), false);
  assert.equal(isCheckoutSessionId('cs_live_<script>'), false);
  assert.equal(isCheckoutSessionId(null), false);
});

test('the same session always gets the same hex event id', async () => {
  const a = await purchaseEventId('cs_live_abc123def456');
  assert.match(a, /^[a-f0-9]{32}$/);
  assert.equal(a, await purchaseEventId('cs_live_abc123def456'));
  assert.notEqual(a, await purchaseEventId('cs_live_abc123def457'));
});

test('each site checkout key maps to its offer and the amount charged today', () => {
  const expected: Record<string, [string, number]> = {
    boardroom: ['boardroom', 399],
    teamStandard2x: ['teamStandard2x', 2500],
    teamStandard4x: ['teamStandard4x', 4000],
    eightWeekPif: ['eightWeek', 4500],
    eightWeekWeekly: ['eightWeek', 625],
  };
  for (const [key, [offer, amount]] of Object.entries(expected)) {
    const found = checkoutOptionFor(key);
    assert.equal(found?.offer.key, offer, key);
    assert.equal(amountFrom(found!.option.billing), amount, key);
  }
  assert.equal(checkoutOptionFor('nope'), null);
});

test('the redirect keeps Stripe\'s placeholder intact', () => {
  assert.equal(
    thanksRedirectUrl('eightWeekWeekly'),
    'https://standardplaybook.com/thanks?offer=eightWeekWeekly&session_id={CHECKOUT_SESSION_ID}',
  );
});
