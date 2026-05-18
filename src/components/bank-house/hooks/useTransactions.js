import { useState, useEffect } from 'react';

export function useTransactions(initialData) {
  const [searchTerm, setSearchTerm] = useState(''); 
  const [data, setData] = useState(initialData.slice(0, 3));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('All Time');
  
  const fetchTransactions = async (pageToFetch, currentFilter, currentSearch) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      
      if (currentFilter === 'Error_Trigger') {
        throw new Error('Process interrupted');
      }
      
      const filtered = initialData.filter(tx => {
        const matchesDate = true; 
        const searchLower = (currentSearch || '').toLowerCase();
        const matchesSearch = !currentSearch || 
          tx.id.toLowerCase().includes(searchLower) || 
          tx.recipient.toLowerCase().includes(searchLower);

        return matchesDate && matchesSearch;
      });

      const start = (pageToFetch - 1) * 3;
      setData(filtered.slice(start, start + 3));
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(nextPage, dateRange, searchTerm);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      fetchTransactions(prevPage, dateRange, searchTerm);
    }
  };

  const handleFilterChange = (newRange) => {
    setDateRange(newRange);
    setPage(1);
    fetchTransactions(1, newRange, searchTerm);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setPage(1); 
    fetchTransactions(1, dateRange, term); 
  };

  useEffect(() => {
    fetchTransactions(page, dateRange, searchTerm);
  }, [initialData]);

  return {
    data,
    page,
    loading,
    dateRange,
    searchTerm, 
    handleNextPage,
    handlePrevPage,
    handleFilterChange,
    handleSearchChange,
    totalPages: Math.ceil(initialData.length / 3) || 1
  };
}