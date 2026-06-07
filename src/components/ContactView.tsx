/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { LOCAL_SHOP_INFO } from '../data/defaultData';
import { MapPin, Phone, MessageSquare, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { submitInquiry } = useFirebase();

  // Form controls
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      alert('Please fill out all mandatory details.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry({
        name,
        email,
        phone,
        message
      });
      setCompleted(true);
      // Reset
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${LOCAL_SHOP_INFO.mapCoordinates.lat},${LOCAL_SHOP_INFO.mapCoordinates.lng}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16 animate-fadeIn">
      
      {/* Top section header */}
      <section className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-amber-600 font-bold font-mono">
          Get in Touch
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mt-2 font-sans">
          Connect with Vapi's Framing Experts
        </h1>
        <p className="text-sm text-slate-505 mt-2">
          Want a specific lamination texture? Sizing layout problems? Or a bulk corporate frames order? Send us a message below, and Hasan will help you directly.
        </p>
      </section>

      {/* Grid Arrangement layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Contact form left side */}
        <div className="lg:col-span-7 bg-white rounded-2.5xl p-6 sm:p-8 border shadow-sm flex flex-col justify-between">
          {completed ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-sm">
                <CheckCircle2 size={28} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">Inquiry Received Successfully!</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-md">
                  Thank you for contacting A to Z Photo Frame. Hasan's showroom team has received your message and will telephone/WhatsApp you within a few working hours.
                </p>
              </div>
              <button
                onClick={() => setCompleted(false)}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <h3 className="text-base font-bold text-slate-900 mb-2">Send Online Message</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Abhishek Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-205 focus:border-slate-805 bg-white py-2.5 px-3.5 font-medium outline-none transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">WhatsApp / Call Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-205 focus:border-slate-805 bg-white py-2.5 px-3.5 font-medium outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-705">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="abhishek@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-205 focus:border-slate-805 bg-white py-2.5 px-3.5 font-medium outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Detailed Message * (Add sizes, frame preferences etc)</label>
                <textarea
                  required
                  rows={4}
                  placeholder="I would like to inquire about wrapping 3 canvas paintings of size 18x24 with black synthetic margins..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-205 focus:border-slate-805 bg-white py-2.5 px-3.5 font-medium outline-none transition-all shadow-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 border hover:bg-slate-800 text-white py-3 text-xs font-bold transition-all shadow cursor-pointer disabled:opacity-50"
              >
                <Send size={12} />
                <span>{isSubmitting ? 'Submitting Details...' : 'Submit Message'}</span>
              </button>

            </form>
          )}
        </div>

        {/* Info panel right side */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50 border p-6 sm:p-8 rounded-2.5xl space-y-6">
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 font-sans">Workshop Showroom Details</h3>
            
            <div className="space-y-4 text-xs text-slate-655 font-medium">
              <div className="flex gap-2.5">
                <MapPin size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block mb-0.5">Physical Address</strong>
                  <span className="leading-relaxed block">{LOCAL_SHOP_INFO.address}</span>
                </div>
              </div>
              <div className="flex gap-2.5">
                <Phone size={16} className="text-amber-605 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block mb-0.5">Showroom Contacts</strong>
                  <a href={`tel:${LOCAL_SHOP_INFO.phone}`} className="hover:text-amber-600 hover:underline">
                    {LOCAL_SHOP_INFO.phone}
                  </a>
                </div>
              </div>
              <div className="flex gap-2.5">
                <Clock size={16} className="text-amber-605 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold block mb-0.5">Showroom Timing</strong>
                  <span>{LOCAL_SHOP_INFO.openingHours}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-3">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-205 text-slate-800 py-3 text-[11px] font-bold cursor-pointer hover:bg-slate-50 shadow-sm"
            >
              <span>Get Maps Pin</span>
            </a>
            
            <a
              href={`https://wa.me/${LOCAL_SHOP_INFO.whatsapp.replace(/\+/g, '')}?text=Hello%20Hasan!%20Quick%20Framing%20Inquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-white py-3 text-[11px] font-bold cursor-pointer hover:bg-emerald-550 shadow-sm"
            >
              <MessageSquare size={12} />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>

      </section>

    </div>
  );
};
