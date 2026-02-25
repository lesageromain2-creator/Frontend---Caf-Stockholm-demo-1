/**
 * Layout principal Kafé Stockholm
 * Fond crème (--color-bg), Header sticky, Footer, Chatbot Björn
 */

import React from 'react';
import EcommerceHeaderFigma from './EcommerceHeaderFigma';
import EcommerceFooter from './EcommerceFooter';
import dynamic from 'next/dynamic';

const ChatbotWidget = dynamic(() => import('@/components/ChatbotWidget'), { ssr: false });

interface Props {
  children: React.ReactNode;
  noPadding?: boolean;
}

export default function EcommerceLayout({ children, noPadding }: Props) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <EcommerceHeaderFigma />
      <main className={`flex-1 ${noPadding ? '' : 'pt-20 lg:pt-24'}`}>
        {children}
      </main>
      <EcommerceFooter />
      <ChatbotWidget />
    </div>
  );
}
