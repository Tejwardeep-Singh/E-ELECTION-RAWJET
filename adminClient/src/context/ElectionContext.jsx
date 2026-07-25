import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const ElectionContext = createContext(null);

export function ElectionProvider({ children }) {
  const [selectedElection, setSelectedElection] = useState(null);
  const [availableElections, setAvailableElections] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshElections = useCallback(async () => {
    setLoading(true);
    try {
      const elections = await api('/api/head/elections', { role: 'head' });
      setAvailableElections(elections);
      setSelectedElection((current) => current && elections.find((election) => election._id === current._id) || null);
      return elections;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshElections().catch(() => setAvailableElections([])); }, [refreshElections]);

  const value = useMemo(() => ({ selectedElection, setSelectedElection, availableElections, loading, refreshElections }), [selectedElection, availableElections, loading, refreshElections]);
  return <ElectionContext.Provider value={value}>{children}</ElectionContext.Provider>;
}

export function useElection() {
  const context = useContext(ElectionContext);
  if (!context) throw new Error('useElection must be used within an ElectionProvider');
  return context;
}
