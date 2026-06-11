import { useState, useEffect } from "react";

type Listener = () => void;

const MAX = 8;
let recentIds: string[] = [];
const listeners = new Set<Listener>();

export function trackViewed(id: string) {
  recentIds = [id, ...recentIds.filter(x => x !== id)].slice(0, MAX);
  listeners.forEach(l => l());
}

export function useRecent(): string[] {
  const [ids, setIds] = useState<string[]>(recentIds);
  useEffect(() => {
    const cb = () => setIds([...recentIds]);
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);
  return ids;
}
