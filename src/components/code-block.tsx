import React from 'react';

export const CodeBlock = ({ children }: { children: React.ReactNode }) => {
  return (
    <pre className="bg-gray-100 p-4 rounded">
      <code>{children}</code>
    </pre>
  );
}; 