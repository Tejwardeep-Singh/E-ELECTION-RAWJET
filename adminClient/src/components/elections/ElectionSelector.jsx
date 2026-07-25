import { useElection } from '../../context/ElectionContext';

export default function ElectionSelector() {
  const { selectedElection, setSelectedElection, availableElections, loading } = useElection();

  return <div className="mr-3 hidden min-w-56 sm:block">
    <label className="sr-only" htmlFor="global-election-selector">Selected election</label>
    <select id="global-election-selector" value={selectedElection?._id || ''} disabled={loading || !availableElections.length} onChange={(event) => setSelectedElection(availableElections.find((election) => election._id === event.target.value) || null)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-600">
      <option value="">{loading ? 'Loading elections…' : availableElections.length ? 'Select an election' : 'No elections available.'}</option>
      {availableElections.map((election) => <option key={election._id} value={election._id}>{`${election.title} — ${election.type} (${election.status})`}</option>)}
    </select>
  </div>;
}
