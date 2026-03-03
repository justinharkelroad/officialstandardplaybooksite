import { useState } from 'react';
import NewLanding from './NewLanding';
import StandardFitModal from '@/components/StandardFitModal';

const StandardFit = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
      <NewLanding />
      <StandardFitModal open={open} onOpenChange={setOpen} />
    </>
  );
};

export default StandardFit;
