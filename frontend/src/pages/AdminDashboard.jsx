import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  MessageCircle,
  AlertCircle,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, repRes] = await Promise.all([
          apiRequest('/admin/dashboard'),
          apiRequest('/admin/reports'),
        ]);
        setStats(dashRes.data);
        setReports(repRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const maxCatCount = Math.max(
    1,
    ...(reports?.popularCategories || []).map((c) => c.totalQuestions)
  );

  return (
    <DashboardLayout title="Admin Dashboard">
      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="grid-4" style={{ marginBottom: '24px' }}>
          <div className="card skeleton" style={{ height: '100px' }} />
          <div className="card skeleton" style={{ height: '100px' }} />
          <div className="card skeleton" style={{ height: '100px' }} />
          <div className="card skeleton" style={{ height: '100px' }} />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid-4" style={{ marginBottom: '24px' }}>
            <div className="card stat-card card-hover">
              <div>
                <div className="stat-value">{stats?.totalStudents ?? 0}</div>
                <div className="stat-label">Total Students</div>
              </div>
              <div className="stat-icon">
                <Users size={22} />
              </div>
            </div>

            <div className="card stat-card card-hover">
              <div>
                <div className="stat-value">{stats?.totalFAQs ?? 0}</div>
                <div className="stat-label">Total FAQs</div>
              </div>
              <div className="stat-icon">
                <BookOpen size={22} />
              </div>
            </div>

            <div className="card stat-card card-hover">
              <div>
                <div className="stat-value">{stats?.totalQuestions ?? 0}</div>
                <div className="stat-label">Total Questions</div>
              </div>
              <div className="stat-icon">
                <MessageCircle size={22} />
              </div>
            </div>

            <div className="card stat-card card-hover">
              <div>
                <div className="stat-value">
                  {stats?.unansweredQuestions ?? 0}
                </div>
                <div className="stat-label">Unanswered Questions</div>
              </div>
              <div
                className="stat-icon"
                style={{
                  backgroundColor: 'var(--warning-soft)',
                  color: '#D97706',
                }}
              >
                <AlertCircle size={22} />
              </div>
            </div>
          </div>

          {/* Analytics Row: Popular Categories Chart + Most Asked Questions */}
          <div className="grid-2" style={{ marginBottom: '24px' }}>
            <div className="card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                }}
              >
                <h2 style={{ fontSize: '17px' }}>Popular Categories</h2>
                <BarChart3 size={18} color="var(--primary-purple)" />
              </div>

              {!reports?.popularCategories?.length ? (
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Category analytics will appear once students ask questions.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {reports.popularCategories.map((cat) => {
                    const widthPct = Math.round(
                      (cat.totalQuestions / maxCatCount) * 100
                    );
                    return (
                      <div key={cat.category}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '13.5px',
                            marginBottom: '6px',
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{cat.category}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>
                            {cat.totalQuestions} questions
                          </span>
                        </div>
                        <div
                          style={{
                            height: '9px',
                            borderRadius: '999px',
                            backgroundColor: '#EEF0F8',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${widthPct}%`,
                              height: '100%',
                              borderRadius: '999px',
                              background:
                                'linear-gradient(90deg, var(--primary-purple), var(--secondary-purple))',
                              transition: 'width 0.4s ease',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <h2 style={{ fontSize: '17px' }}>Most Asked Questions</h2>
                <Link
                  to="/admin/reports"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--primary-purple)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Full reports <ArrowRight size={14} />
                </Link>
              </div>

              {!reports?.mostAskedFAQs?.length ? (
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  No matched FAQ queries recorded yet.
                </p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>FAQ Question</th>
                        <th>Category</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.mostAskedFAQs.map((item) => (
                        <tr key={item.faqId}>
                          <td style={{ fontWeight: 500 }}>{item.question}</td>
                          <td>
                            <span className="badge">{item.category}</span>
                          </td>
                          <td>
                            <strong>{item.askCount}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Recent Student Activity */}
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
              <h2 style={{ fontSize: '17px' }}>Recent Student Activity</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/admin/faqs" className="btn btn-primary btn-sm">
                  Manage FAQs <ArrowRight size={14} />
                </Link>
                <Link to="/admin/questions" className="btn btn-outline btn-sm">
                  Student Questions
                </Link>
              </div>
            </div>

            {!stats?.recentQuestions?.length ? (
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                No student questions recorded yet.
              </p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Question</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentQuestions.map((item) => (
                      <tr key={item._id}>
                        <td style={{ fontWeight: 600 }}>
                          {item.userId?.name || 'Student'}
                        </td>
                        <td>{item.question}</td>
                        <td>
                          {item.matchedFAQ ? (
                            <span className="badge badge-success">
                              {item.matchedFAQ.category}
                            </span>
                          ) : (
                            <span className="badge badge-warning">
                              Unanswered
                            </span>
                          )}
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
