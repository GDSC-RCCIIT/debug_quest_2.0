import { useState } from 'react';

export function useTransactions(initialData) {
  const [data, setData] = useState(initialData.slice(0, 3));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('All Time');
  
  const fetchTransactions = async (pageToFetch, currentFilter) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      
      if (currentFilter === 'Error_Trigger') {
        throw new Error('Process interrupted');
      }
      
      const filtered = initialData.filter(() => true); // Simplistic filter just for demonstration
      const start = (pageToFetch - 1) * 3;
      setData(filtered.slice(start, start + 3));
      
      setLoading(false);
    } catch (err) {
      console.error('Data fetch error:', err);
    }
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(page, dateRange); 
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      fetchTransactions(page, dateRange);
    }
  };

  const handleFilterChange = (newRange) => {
    setDateRange(newRange);
    setPage(1);
    fetchTransactions(1, dateRange);
  };

  return {
    data,
    page,
    loading,
    dateRange,
    handleNextPage,
    handlePrevPage,
    handleFilterChange
  };
}
