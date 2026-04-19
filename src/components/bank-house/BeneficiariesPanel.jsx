import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';

export default function BeneficiariesPanel({ beneficiaries, onSelectBeneficiary }) {
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(beneficiaries);
  const cachedSearch = useRef(null);

  useEffect(() => {
    if (search === '') {
      setFiltered(beneficiaries);
      return;
    }

    // Bug 6: Use cached matching array from first search, ignoring subsquent searches
    if (cachedSearch.current) {
      setFiltered(cachedSearch.current);
    } else {
      const res = beneficiaries.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));
      cachedSearch.current = res; 
      setFiltered(res);
    }
  }, [search, beneficiaries]);

  return (
    <div className="bank-card bank-glass">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Quick Beneficiaries</h2>
        <div className="bank-search" style={{width: '130px', display: 'flex', alignItems: 'center', background: 'var(--bank-bg-dark)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--bank-border)'}}>
          <Search size={14} style={{ marginRight: '6px', opacity: 0.7 }} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: '12px', background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
          />
        </div>
      </div>
      <div className="beneficiary-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
        {filtered.map((ben, index) => (
          <div className="ben-item" key={ben.id} style={{ display: 'flex', alignItems: 'center', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
            <div className="ben-avatar" style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--bank-primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {ben.name.charAt(0)}
            </div>
            <div className="flex flex-col flex-1" style={{ marginLeft: '12px', flex: 1, overflow: 'hidden' }}>
               <span style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', display: 'block' }}>{ben.name}</span>
               <span style={{ fontSize: '11px', opacity: 0.5, display: 'block' }}>{ben.account}</span>
            </div>
            {/* Bug 5: Changing beneficiary maps wrong index/id */}
            {/* Mapping over filtered array, but index refers to original array */}
            <button 
              onClick={() => onSelectBeneficiary(beneficiaries[index])}
              style={{ background: 'transparent', border: 'none', color: 'var(--bank-primary)', cursor: 'pointer', padding: '4px' }}
            >
              <ArrowUpRight size={16}/>
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', fontSize: '13px', opacity: 0.6, padding: '10px' }}>No matches</div>
        )}
      </div>
    </div>
  );
}
