export type Task = {
  id: string;
  user_id: string;
  title: string;
  kind: 'poi-visit' | 'facility-visit' | 'doc-check' | 'ad-purchase';
  tertiary: 'defer' | 'proof' | 'nav' | 'open';
  start?: string; end?: string;
  place?: { name: string; lat?: number; lng?: number };
};
