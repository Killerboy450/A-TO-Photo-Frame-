/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { MapPin, Navigation, Phone, MessageSquare, Clock } from 'lucide-react';
import { LOCAL_SHOP_INFO } from '../data/defaultData';

export const MapSection: React.FC = () => {
  const { lat, lng } = LOCAL_SHOP_INFO.mapCoordinates;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const whatsappUrl = `https://wa.me/${LOCAL_SHOP_INFO.whatsapp.replace(/\+/g, '')}?text=Hi%20A%20to%20Z%20Photo%20Frame,%20I%20would%20like%20to%20inquire%2520about%2520custom%2520framing%2520options.`;

  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-100">
      <div className="mx-auto max-w-7xl">
        
        {/* Title Group */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-600 font-bold font-mono">
            Locate Showroom
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
            Visit Our Frame Workshop in Vapi
          </h2>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed">
            Ready to choose borders or texture mountings yourself? Drop by our physical showroom in GIDC Vapi to browse over 150+ unique wood design frames.
          </p>
        </div>

        {/* Content Panel Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Map display column */}
          <div className="lg:col-span-7 h-[350px] lg:h-auto min-h-[350px] relative">
            <iframe
              title="A to Z Photo Frame Location Map"
              src={mapEmbedUrl}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Contact Details Column */}
          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-white border-t lg:border-l lg:border-t-0 border-slate-100">
            
            <div className="space-y-6">
              
              {/* Local Details */}
              <div className="space-y-1.5">
                <span className="text-xs uppercase tracking-wide font-mono text-amber-600 font-bold">
                  Address
                </span>
                <p className="text-slate-800 text-sm font-semibold flex items-start gap-2.5 leading-relaxed">
                  <MapPin size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>{LOCAL_SHOP_INFO.address}</span>
                </p>
              </div>

              {/* Time */}
              <div className="space-y-1.5">
                <span className="text-xs uppercase tracking-wide font-mono text-amber-650 font-bold">
                  Working Hours
                </span>
                <p className="text-slate-700 text-sm font-medium flex items-center gap-2.5">
                  <Clock size={16} className="text-amber-650 shrink-0" />
                  <span>{LOCAL_SHOP_INFO.openingHours}</span>
                </p>
              </div>

              {/* Help Line */}
              <div className="space-y-1.5">
                <span className="text-xs uppercase tracking-wide font-mono text-amber-650 font-bold">
                  Support Helpdesk
                </span>
                <div className="flex flex-col gap-2">
                  <p className="text-slate-700 text-sm font-medium flex items-center gap-2.5">
                    <Phone size={15} className="text-amber-650 shrink-0" />
                    <span>Call: {LOCAL_SHOP_INFO.phone}</span>
                  </p>
                </div>
              </div>

            </div>

            {/* CTAs Anchor Controls */}
            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-3.5">
              
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer"
              >
                <Navigation size={15} />
                <span>Get Directions</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer"
              >
                <MessageSquare size={15} />
                <span>Chat on WhatsApp</span>
              </a>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
