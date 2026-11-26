import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../utils/api';

export default function AdminQuestions() {
  const [unanswered, setUnanswered] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const [unansRes, dashRes] = await Promise.all([
          apiRequest('/admin/unanswered'),
          apiRequest('/admin/dashboard'),
        ]);
        setUnanswered(unansRes.data || []);
        setRecent(dashRes.data?.recentQuestions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <DashboardLayout title="Student Questions">
      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="card skeleton" style={{ height: '220px' }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div className="card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={19} color="var(--warning)" />
                <h2 style={{ fontSize: '17px' }}>
                  Unanswered Questions ({unanswered.length})
                </h2>
              </div>
              <Link to="/admin/faqs" className="btn btn-primary btn-sm">
                <Plus size={14} /> Add Missing FAQ
              </Link>
            </div>

            {unanswered.length === 0 ? (
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                All student questions have been matched with existing FAQs.
              </p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Student</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unanswered.map((q) => (
                      <tr key={q._id}>
                        <td style={{ fontWeight: 500 }}>{q.question}</td>
                        <td>
                          {q.userId?.name || 'Student'}{' '}
                          <span style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>
                            ({q.userId?.email})
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>
                          {new Date(q.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card">
            <h2 style={{ fontSize: '17px', marginBottom: '16px' }}>
              Recent Student Queries
            </h2>
            {recent.length === 0 ? (
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                No recent student queries yet.
              </p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Question</th>
                      <th>Matched Category</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((q) => (
                      <tr key={q._id}>
                        <td style={{ fontWeight: 600 }}>
                          {q.userId?.name || 'Student'}
                        </td>
                        <td>{q.question}</td>
                        <td>
                          {q.matchedFAQ ? (
                            <span className="badge badge-success">
                              {q.matchedFAQ.category}
                            </span>
                          ) : (
                            <span className="badge badge-warning">
                              Unanswered
                            </span>
                          )}
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>
                          {new Date(q.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
