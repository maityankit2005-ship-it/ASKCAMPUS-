import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, ArrowRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../utils/api';

const ALL_CATEGORIES = [
  'Admissions',
  'Fees and Scholarships',
  'Examinations',
  'Attendance',
  'Timetables',
  'Placements',
  'Campus Facilities',
  'Events',
];

export default function AdminCategories() {
  const [faqsByCategory, setFaqsByCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await apiRequest('/admin/reports');
        setFaqsByCategory(res.data?.faqsByCategory || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const getCount = (cat) => {
    const found = faqsByCategory.find((item) => item.category === cat);
    return found ? found.count : 0;
  };

  return (
    <DashboardLayout title="Categories">
      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="grid-4">
          <div className="card skeleton" style={{ height: '120px' }} />
          <div className="card skeleton" style={{ height: '120px' }} />
          <div className="card skeleton" style={{ height: '120px' }} />
          <div className="card skeleton" style={{ height: '120px' }} />
        </div>
      ) : (
        <div className="grid-4">
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/admin/faqs?category=${encodeURIComponent(cat)}`}
              className="card card-hover"
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div className="stat-icon" style={{ width: '40px', height: '40px' }}>
                  <FolderKanban size={19} />
                </div>
                <span className="badge">{getCount(cat)} FAQs</span>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{cat}</h3>
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--primary-purple)',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Manage FAQs <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
