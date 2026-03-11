'use client';

import './globals.css';
import { useState }              from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster }               from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime:  30_000,   // 30s antes de refetch automático
            retry:      1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <html lang="pt-BR">
      <head>
        <title>Carteira do Produtor Rural — CPCPR</title>
        <meta name="description" content="Sistema de Gestão — CPCPR" />
        <meta name="viewport"    content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>

          {children}

          {/* Toast global */}
          <Toaster
            position="top-right"
            gutter={10}
            toastOptions={{
              duration: 3500,
              style: {
                background:  'var(--bg-card)',
                color:       '#fff',
                border:      '1px solid var(--border)',
                borderRadius: '10px',
                fontSize:    '13px',
                fontFamily:  'Sora, sans-serif',
              },
              success: {
                iconTheme: { primary: '#2FA572', secondary: '#fff' },
                style: { borderColor: '#2FA57244' },
              },
              error: {
                iconTheme: { primary: '#e05252', secondary: '#fff' },
                style: { borderColor: '#e0525244' },
              },
            }}
          />

        </QueryClientProvider>
      </body>
    </html>
  );
}