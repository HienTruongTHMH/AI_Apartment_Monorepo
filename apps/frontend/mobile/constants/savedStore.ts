import { useState, useEffect } from "react";

let _ids = new Set<string>();
const _subs = new Set<() => void>();

function _emit() { _subs.forEach(f => f()); }

export function isSaved(id: string) { return _ids.has(id); }
export function toggleSave(id: string) {
  _ids.has(id) ? _ids.delete(id) : _ids.add(id);
  _emit();
}
export function getSaved() { return [..._ids]; }

export function useSaved() {
  const [, tick] = useState(0);
  useEffect(() => {
    const fn = () => tick(n => n + 1);
    _subs.add(fn);
    return () => void _subs.delete(fn);
  }, []);
  return _ids;
}
