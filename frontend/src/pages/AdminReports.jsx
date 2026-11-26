import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../utils/api';

export default function AdminReports() {
  const [reports, setReports] = useState(null);
  const [unanswered, setUnanswered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [reportsRes, unansweredRes] = await Promise.all([
          apiRequest('/admin/reports'),
          apiRequest('/admin/unanswered'),
        ]);
        setReports(reportsRes.data);
        setUnanswered(unansweredRes.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const maxCatCount = Math.max(
    1,
    ...(reports?.popularCategories || []).map((c) => c.totalQuestions)
  );

  return (
    <DashboardLayout title="Reports">
      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="grid-2">
          <div className="card skeleton" style={{ height: '220px' }} />
          <div className="card skeleton" style={{ height: '220px' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="grid-2">
            {/* Most Frequently Asked Questions */}
            <div className="card">
              <h2 style={{ fontSize: '17px', marginBottom: '14px' }}>
                Most Frequently Asked FAQs
              </h2>
              {!reports?.mostAskedFAQs?.length ? (
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  No matched FAQ questions recorded yet.
                </p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>FAQ Question</th>
                        <th>Category</th>
                        <th>Asked</th>
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

            {/* Popular Categories Chart */}
            <div className="card">
              <h2 style={{ fontSize: '17px', marginBottom: '16px' }}>
                Popular FAQ Categories
              </h2>
              {!reports?.popularCategories?.length ? (
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  No category activity recorded yet.
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
                            {cat.totalQuestions}
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
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="grid-2">
            {/* Total Questions Asked by Students */}
            <div className="card">
              <h2 style={{ fontSize: '17px', marginBottom: '14px' }}>
                Total Questions Asked by Students
              </h2>
              {!reports?.questionsByStudent?.length ? (
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  No student questions recorded yet.
                </p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Email</th>
                        <th>Total Asked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.questionsByStudent.map((s) => (
                        <tr key={s.studentId}>
                          <td style={{ fontWeight: 600 }}>{s.name}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>
                            {s.email}
                          </td>
                          <td>
                            <strong>{s.questionCount}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Unanswered Questions */}
            <div className="card">
              <h2 style={{ fontSize: '17px', marginBottom: '14px' }}>
                Unanswered Questions ({unanswered.length})
              </h2>
              {unanswered.length === 0 ? (
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Great! Every student question matched an FAQ.
                </p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Question</th>
                        <th>Asked By</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unanswered.map((item) => (
                        <tr key={item._id}>
                          <td>{item.question}</td>
                          <td>{item.userId?.name || 'Student'}</td>
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
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
