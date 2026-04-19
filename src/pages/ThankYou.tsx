import React from 'react';

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/9947cba1-df06-4c18-b17c-819bede8d4c0.png" 
            alt="The Standard Playbook Logo" 
            className="h-16 w-auto"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
        
        {/* Thank you message */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Thank you for booking your call!
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            We will be in touch. Please watch your email and text for any required information to be completed before you hop on the call.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;