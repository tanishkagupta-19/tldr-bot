declare module '@vercel/analytics/next' {
  import * as React from 'react';

  // Minimal typing for Vercel Analytics Next integration
  // Exports an Analytics React component that you can drop into the app layout.
  export function Analytics(props?: Record<string, any>): React.JSX.Element;

  export default Analytics;
}
