import React from 'react';

const ClientLogos = React.memo(() => {
  const clients = [
    { name: "Condé Nast", logo: "conde-nast-logo.png" },
    { name: "Loewe", logo: "loewe-cleaned.svg" },
    { name: "Jaguar", logo: "jaguar.svg" },
    { name: "Land Rover", logo: "landrover.svg" },
    { name: "Toyota", logo: "toyota.svg" },
    { name: "Lexus", logo: "lexus.svg" },
    { name: "Coutts Bank", logo: "coutts.png" },
    { name: "Marriott Bonvoy", logo: "marriott.svg" }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8 max-w-7xl mx-auto px-4">
      {clients.map((client, index) => (
        <div key={index} className="group text-center p-6 md:p-10 bg-stone-50 border border-stone-200 hover:border-stone-400 hover:bg-white transition-all duration-500 flex flex-col items-center justify-center min-h-[120px] md:min-h-[160px] rounded-lg">
          <div className="mb-2 md:mb-4 h-10 md:h-16 flex items-center justify-center w-full">
            <img
              src={`/images/clients/${client.logo}`}
              alt={client.name}
              className="max-h-10 md:max-h-16 mx-auto object-contain"
              loading="lazy"
            />
          </div>
          <div className="text-xs text-stone-500 font-mono tracking-wide mt-2">{client.name}</div>
        </div>
      ))}
    </div>
  );
});

export default ClientLogos; 