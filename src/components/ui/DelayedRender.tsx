"use client";

import { useDelayedRender } from '@/hooks';

type DelayedRenderProps = {
  delay: number;
  children: React.ReactNode;
};

const DelayedRender: React.FC<DelayedRenderProps> = ({ delay, children }) => useDelayedRender(delay)(() => children);

export { DelayedRender };
