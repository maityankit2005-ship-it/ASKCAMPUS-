import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, CheckCircle2, Search } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../utils/api';

export default function ChatHistory() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await apiRequest('/chat/history');
        setHistory(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = history.filter(
    (item) =>
      item.question.toLowerCase().includes(filter.toLowerCase()) ||
      item.answer.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <DashboardLayout title="Chat History">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '7px 12px',
            width: '320px',
            maxWidth: '100%',
          }}
        >
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Filter your past conversations..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '14px',
            }}
          />
        </div>

        <Link to="/student/chat" className="btn btn-primary">
          <MessageSquare size={16} />
          Ask New Question
        </Link>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="card skeleton" style={{ height: '110px' }} />
          <div className="card skeleton" style={{ height: '110px' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '44px' }}>
          <p
            style={{
              color: 'var(--text-secondary)',
              marginBottom: '16px',
              fontSize: '15px',
            }}
          >
            {history.length === 0
              ? 'You have not asked any questions yet.'
              : 'No conversations match your filter.'}
          </p>
          <Link to="/student/chat" className="btn btn-primary">
            Open AI Assistant
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map((item) => (
            <div key={item._id} className="card card-hover">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <h3 style={{ fontSize: '16px' }}>{item.question}</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.matchedFAQ ? (
                    <>
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} /> Based on Campus FAQ
                      </span>
                      <span className="badge">{item.matchedFAQ.category}</span>
                    </>
                  ) : (
                    <span className="badge badge-warning">Unanswered</span>
                  )}
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Calendar size={13} />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  padding: '12px 14px',
                  borderRadius: '12px',
                }}
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
