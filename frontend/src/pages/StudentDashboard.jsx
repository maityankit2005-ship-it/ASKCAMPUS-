import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  MessageSquare,
  BookOpen,
  MessagesSquare,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';

const SUGGESTED_PROMPTS = [
  'When are semester examinations?',
  'What is the attendance requirement?',
  'How do I apply for scholarships?',
  'What are the placement eligibility criteria?',
];

const POPULAR_CATEGORIES = [
  'Admissions',
  'Fees and Scholarships',
  'Examinations',
  'Attendance',
  'Timetables',
  'Placements',
  'Campus Facilities',
  'Events',
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [historyRes, faqsRes] = await Promise.all([
          apiRequest('/chat/history'),
          apiRequest('/faqs'),
        ]);
        setHistory(historyRes.data || []);
        setFaqs(faqsRes.data || []);
      } catch {
        // Keep empty arrays if request fails
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleAskSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    navigate(`/student/chat?q=${encodeURIComponent(prompt.trim())}`);
  };

  return (
    <DashboardLayout title="Overview">
      {/* Welcome & Large AI Search Card */}
      <div
        className="card"
        style={{
          marginBottom: '22px',
          background:
            'linear-gradient(135deg, #FFFFFF 0%, #F5F4FF 100%)',
          borderColor: '#E2E0FA',
        }}
      >
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>
            {getGreeting()}, {user?.name || 'Student'} 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            How can we help you today?
          </p>
        </div>

        <form
          onSubmit={handleAskSubmit}
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: '240px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '4px 14px',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <Search size={18} color="var(--primary-purple)" />
            <input
              type="text"
              placeholder="Ask anything about your campus..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                padding: '10px 0',
                fontSize: '14.5px',
                background: 'transparent',
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg">
            <Sparkles size={17} />
            Ask AI
          </button>
        </form>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {SUGGESTED_PROMPTS.map((item) => (
            <button
              key={item}
              type="button"
              className="btn btn-outline btn-sm"
              style={{ borderRadius: '999px' }}
              onClick={() =>
                navigate(`/student/chat?q=${encodeURIComponent(item)}`)
              }
            >
              <Sparkles size={13} color="var(--primary-purple)" />
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid-3" style={{ marginBottom: '22px' }}>
        <div className="card stat-card card-hover">
          <div>
            <div className="stat-value">
              {loading ? '—' : history.length}
            </div>
            <div className="stat-label">Questions Asked</div>
          </div>
          <div className="stat-icon">
            <MessageSquare size={22} />
          </div>
        </div>

        <div className="card stat-card card-hover">
          <div>
            <div className="stat-value">
              {loading ? '—' : faqs.length}
            </div>
            <div className="stat-label">FAQs Available</div>
          </div>
          <div className="stat-icon">
            <BookOpen size={22} />
          </div>
        </div>

        <div className="card stat-card card-hover">
          <div>
            <div className="stat-value">
              {loading
                ? '—'
                : history.filter((h) => h.matchedFAQ !== null).length}
            </div>
            <div className="stat-label">Conversations Answered</div>
          </div>
          <div className="stat-icon">
            <MessagesSquare size={22} />
          </div>
        </div>
      </div>

      {/* Popular Categories & Recent Conversations */}
      <div className="grid-2" style={{ marginBottom: '22px' }}>
        <div className="card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h3 style={{ fontSize: '17px' }}>Popular Categories</h3>
            <Link
              to="/student/faqs"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--primary-purple)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Browse all <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {POPULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/student/faqs?category=${encodeURIComponent(cat)}`}
                className="btn btn-outline btn-sm"
              >
                {cat}
              </Link>
            ))}
          </div>
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
            <h3 style={{ fontSize: '17px' }}>Recent Conversations</h3>
            <Link
              to="/student/history"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--primary-purple)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              View history <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="skeleton" style={{ height: '46px' }} />
              <div className="skeleton" style={{ height: '46px' }} />
            </div>
          ) : history.length === 0 ? (
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              No conversations yet. Start asking questions in the AI Assistant!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {history.slice(0, 3).map((item) => (
                <Link
                  key={item._id}
                  to="/student/history"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.question}
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      {item.matchedFAQ ? (
                        <span className="badge badge-success">
                          {item.matchedFAQ.category}
                        </span>
                      ) : (
                        <span className="badge badge-warning">Unanswered</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-secondary)" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions Preview */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <h3 style={{ fontSize: '17px' }}>Frequently Asked Questions</h3>
          <Link
            to="/student/faqs"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--primary-purple)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            See all FAQs <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="skeleton" style={{ height: '90px' }} />
        ) : (
          <div className="grid-2">
            {faqs.slice(0, 4).map((faq) => (
              <div
                key={faq._id}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  backgroundColor: '#FAFBFD',
                }}
              >
                <span className="badge" style={{ marginBottom: '8px' }}>
                  {faq.category}
                </span>
                <div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '6px' }}>
                  {faq.question}
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
