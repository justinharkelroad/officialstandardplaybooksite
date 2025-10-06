import { useEffect } from 'react';

const AppRedirect = () => {
  useEffect(() => {
    window.location.replace('https://app.wakeupwarrior.com');
  }, []);

  return null;
};

export default AppRedirect;
