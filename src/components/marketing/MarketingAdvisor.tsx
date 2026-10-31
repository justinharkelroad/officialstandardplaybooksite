import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useLocation } from 'react-router-dom';
import { advisorAllowed, type AdvisorBrand } from './advisorScope';
import './MarketingAdvisor.css';

const SERVICE = 'https://standard-marketing-advisor.justin-15e.workers.dev';

/** Mounted only by public marketing pages; never included in the app shell. */
export function MarketingAdvisor({ brand }: { brand: AdvisorBrand }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  if (!advisorAllowed(brand, window.location.hostname, pathname, import.meta.env.DEV)) return null;
  const name = brand === 'standard' ? 'STANDARDAI' : 'Stanley';
  const image = brand === 'standard' ? '/standardai.png' : '/stanley.webp';
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={`marketing-advisor-launcher marketing-advisor-${brand}`} aria-label={`Chat with ${name}`}>
        <img src={SERVICE + image} alt="" width={44} height={44} loading="lazy" />
        <span><strong>{name}</strong><small>Find your next move</small></span>
        <span aria-hidden="true" className="marketing-advisor-chat-icon">•••</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="marketing-advisor-overlay" />
        <Dialog.Content className={`marketing-advisor-panel marketing-advisor-${brand}`} aria-describedby="advisor-description">
          <div className="marketing-advisor-bar">
            <Dialog.Title>{name} · AI guide</Dialog.Title>
            <Dialog.Close aria-label="Close chat">×</Dialog.Close>
          </div>
          <Dialog.Description id="advisor-description" className="sr-only">A short conversation to help you find the right next step. This is an AI guide.</Dialog.Description>
          <iframe title={`${name} conversation`} src={`${SERVICE}/?brand=${brand}`} referrerPolicy="no-referrer" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
