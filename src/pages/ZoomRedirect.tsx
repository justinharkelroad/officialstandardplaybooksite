import { useEffect } from 'react';

const ZoomRedirect = () => {
  useEffect(() => {
    window.location.replace('https://us06web.zoom.us/s/5716939535?pwd=S21iem9oT0xrTjk5TldMMHdRcks0QT09#success');
  }, []);

  return null;
};

export default ZoomRedirect;
