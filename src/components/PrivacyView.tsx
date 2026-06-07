/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LOCAL_SHOP_INFO } from '../data/defaultData';
import { ShieldCheck, Heart, FileText } from 'lucide-react';

interface PrivacyViewProps {
  type: 'terms' | 'privacy';
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ type }) => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fadeIn text-slate-700 leading-relaxed text-xs sm:text-sm">
      
      {/* Icon header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-700 mx-auto border shadow-sm">
          <FileText size={22} className="stroke-[1.5]" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-905 font-sans">
          {type === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
        </h1>
        <p className="text-[11px] text-slate-400 font-mono">
          Last revised: June 6, 2026 | {LOCAL_SHOP_INFO.name} Vapi Showroom
        </p>
      </div>

      <div className="bg-white border rounded-2.5xl p-6 sm:p-10 space-y-6 shadow-sm">
        {type === 'terms' ? (
          <>
            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider border-b pb-2">1. Local Store Policy</h3>
            <p>
              By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use {LOCAL_SHOP_INFO.name}'s website if you do not agree to all of the terms and conditions stated on this page.
            </p>
            <p>
              Our shopping system lets customers generate digital cart orders. Once submitted, orders should be sent to our official WhatsApp helpline: <strong>{LOCAL_SHOP_INFO.phone}</strong> to confirm wood choice, border layout styles, and delivery schedules in Vapi, Gujarat.
            </p>

            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider border-b pb-2 mt-6">2. Payment & Billing</h3>
            <p>
              We handle bills and payouts locally inside our physical showroom or via verified secure UPI QR codes (GPay, PhonePe, Paytm) upon safe handover or showroom pick up. No online digital payment is processed directly on this website.
            </p>

            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider border-b pb-2 mt-6">3. Custom Design Approvals</h3>
            <p>
              Due to the customized nature of photo framing, once borders are cut on our machine, physical cancellations cannot be accommodated. We request you verify individual frame sizes carefully.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider border-b pb-2">1. Personal Information Collection</h3>
            <p>
              We compile personal coordinates in full compliance with the privacy laws of India. When you place a framing order or file messages on this platform, we store your Name, WhatsApp Contact Number, Complete physical showroom Address, and email details securely in our private Firebase Firestore database, shielded by strict security rules.
            </p>

            <h3 className="text-sm font-bold text-slate-904 uppercase font-mono tracking-wider border-b pb-2 mt-6">2. Customer Data Security</h3>
            <p>
              We verify that your delivery coordinates are uniquely accessed by verified administration profiles to complete orders. We maintain a zero-tolerance policy against list scraping and never share customer logs with third-party networks.
            </p>

            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider border-b pb-2 mt-6">3. Google Login OAuth</h3>
            <p>
              By signing in with Google, we pull basic authentication claims (display name, email, profile photo) to personalize bills and maintain order histories. You can request record removal at our showroom point at any time.
            </p>
          </>
        )}
      </div>

    </div>
  );
};
