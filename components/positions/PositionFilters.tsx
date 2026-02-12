'use client';

interface PositionFiltersProps {
  activeFilter: 'all' | 'active' | 'resolved';
  onFilterChange: (filter: 'all' | 'active' | 'resolved') => void;
}

export function PositionFilters({ activeFilter, onFilterChange }: PositionFiltersProps) {
  const filters: Array<{ value: 'all' | 'active' | 'resolved'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'resolved', label: 'Resolved' },
  ];
  
  return (
    <div className="flex items-center gap-2 mb-6">
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`tab ${activeFilter === filter.value ? 'tab-active' : ''}`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
