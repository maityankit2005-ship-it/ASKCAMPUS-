import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../utils/api';

const CATEGORIES = [
  'All',
  'Admissions',
  'Fees and Scholarships',
  'Examinations',
  'Attendance',
  'Timetables',
  'Placements',
  'Campus Facilities',
  'Events',
];

export default function BrowseFAQs() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFAQs = async (searchTerm = search, cat = category) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (cat && cat !== 'All') params.set('category', cat);
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await apiRequest(`/faqs${query}`);
      setFaqs(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs(search, category);
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFAQs(search, category);
  };

  return (
    <DashboardLayout title="Browse FAQs">
      <div className="card" style={{ marginBottom: '20px' }}>
        <form
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '16px',
          }}
        >
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <input
              type="text"
              className="input"
              placeholder="Search official campus FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <Search size={16} />
            Search
          </button>
        </form>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${
                category === cat ? 'btn-primary' : 'btn-outline'
              }`}
              style={{ borderRadius: '999px' }}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="grid-2">
          <div className="card skeleton" style={{ height: '140px' }} />
          <div className="card skeleton" style={{ height: '140px' }} />
        </div>
      ) : faqs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '44px' }}>
          <h3 style={{ marginBottom: '8px' }}>No matching FAQs found</h3>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              marginBottom: '18px',
            }}
          >
            Try another keyword or ask our AI assistant directly.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              navigate(
                `/student/chat${
                  search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ''
                }`
              )
            }
          >
            <Sparkles size={16} />
            Ask AI Assistant
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {faqs.map((faq) => (
            <div key={faq._id} className="card card-hover">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <span className="badge">{faq.category}</span>
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>
                {faq.question}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
