import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Plus,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../utils/api';

const SUGGESTED_QUESTIONS = [
  'When are semester examinations?',
  'What is the minimum attendance required for exams?',
  'How can I pay my semester tuition fees?',
  'What is the eligibility criteria for campus placements?',
];

export default function ChatAssistant() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [historyList, setHistoryList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const initialQueryHandled = useRef(false);

  const loadHistory = async (populateChat = true) => {
    try {
      const res = await apiRequest('/chat/history');
      const items = res.data || [];
      setHistoryList(items);

      if (populateChat && items.length > 0) {
        const formatted = items
          .slice()
          .reverse()
          .flatMap((item) => [
            { id: `${item._id}-q`, sender: 'user', text: item.question },
            {
              id: `${item._id}-a`,
              sender: 'ai',
              text: item.answer,
              matchedFAQ: item.matchedFAQ || null,
            },
          ]);
        setMessages(formatted);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory(true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendQuestion = async (questionText) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    setError('');
    setInput('');
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      text: trimmed,
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await apiRequest('/chat/ask', {
        method: 'POST',
        body: JSON.stringify({ question: trimmed }),
      });

      const aiMsg = {
        id: res.data._id,
        sender: 'ai',
        text: res.data.answer,
        matchedFAQ: res.data.matchedFAQ || null,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setHistoryList((prev) => [res.data, ...prev]);
    } catch (err) {
      // Never generate fake AI responses when the backend returns an error
      setError(err.message || 'Failed to get a response from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !historyLoading && !initialQueryHandled.current) {
      initialQueryHandled.current = true;
      setSearchParams({}, { replace: true });
      sendQuestion(q);
    }
  }, [searchParams, historyLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendQuestion(input);
  };

  const handleNewChat = () => {
    setError('');
    setMessages([]);
  };

  const handleSelectHistoryItem = (item) => {
    setError('');
    setMessages([
      { id: `${item._id}-q`, sender: 'user', text: item.question },
      {
        id: `${item._id}-a`,
        sender: 'ai',
        text: item.answer,
        matchedFAQ: item.matchedFAQ || null,
      },
    ]);
  };

  return (
    <DashboardLayout title="Ask AI">
      <div className="chat-workspace">
        {/* Left Sidebar: Chat History */}
        <aside className="chat-history-panel">
          <div
            style={{
              padding: '14px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '13.5px', fontWeight: 700 }}>
              Conversations
            </span>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleNewChat}
            >
              <Plus size={14} /> New Chat
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {historyLoading ? (
              <>
                <div className="skeleton" style={{ height: '42px' }} />
                <div className="skeleton" style={{ height: '42px' }} />
              </>
            ) : historyList.length === 0 ? (
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                Your past questions will appear here.
              </p>
            ) : (
              historyList.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => handleSelectHistoryItem(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid transparent',
                    backgroundColor: '#FAFBFD',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.borderColor = 'var(--border)')
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.borderColor = 'transparent')
                  }
                >
                  <MessageSquare
                    size={15}
                    color="var(--primary-purple)"
                    style={{ marginTop: '3px', flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.question}
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <section className="chat-main-panel">
          <div className="chat-messages-scroll">
            <div className="chat-center-column">
              {error && <div className="alert-error">{error}</div>}

              {historyLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="skeleton" style={{ height: '64px', width: '70%' }} />
                  <div
                    className="skeleton"
                    style={{ height: '64px', width: '60%', alignSelf: 'flex-end' }}
                  />
                </div>
              ) : messages.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '36px 12px',
                  }}
                >
                  <div
                    className="brand-mark"
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '16px',
                      margin: '0 auto 16px',
                    }}
                  >
                    <Bot size={28} />
                  </div>
                  <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>
                    Hello! I&apos;m AskCampus AI.
                  </h2>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '15px',
                      marginBottom: '28px',
                    }}
                  >
                    Your personal college assistant. What would you like to know
                    today?
                  </p>

                  <div className="grid-2" style={{ textAlign: 'left' }}>
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        className="card card-hover"
                        style={{
                          padding: '14px 16px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                        onClick={() => sendQuestion(q)}
                      >
                        <Sparkles
                          size={16}
                          color="var(--primary-purple)"
                          style={{ flexShrink: 0 }}
                        />
                        <span style={{ fontSize: '13.5px', fontWeight: 500 }}>
                          {q}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`chat-row ${msg.sender}`}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background:
                          msg.sender === 'user'
                            ? 'var(--dark-sidebar)'
                            : 'var(--purple-tint)',
                        color:
                          msg.sender === 'user'
                            ? '#FFFFFF'
                            : 'var(--primary-purple)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {msg.sender === 'user' ? (
                        <User size={16} />
                      ) : (
                        <Bot size={17} />
                      )}
                    </div>

                    <div className={`chat-bubble ${msg.sender}`}>
                      {msg.sender === 'ai' && msg.matchedFAQ && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            flexWrap: 'wrap',
                            marginBottom: '8px',
                          }}
                        >
                          <span className="badge badge-success">
                            <CheckCircle2 size={12} /> Based on Campus FAQ
                          </span>
                          <span className="badge">
                            {msg.matchedFAQ.category}
                          </span>
                        </div>
                      )}
                      <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="chat-row ai">
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: 'var(--purple-tint)',
                      color: 'var(--primary-purple)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Bot size={17} />
                  </div>
                  <div className="chat-bubble ai">
                    <div className="typing-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="chat-composer">
            <div className="chat-composer-inner">
              <input
                type="text"
                placeholder="Ask a question about admissions, fees, exams, placements..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={loading || !input.trim()}
                style={{ borderRadius: '10px', padding: '9px 14px' }}
              >
                <Send size={15} />
                Send
              </button>
            </div>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}
