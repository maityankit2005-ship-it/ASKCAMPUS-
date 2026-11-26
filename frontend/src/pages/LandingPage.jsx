import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  Search,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Calendar,
  Award,
  Building2,
  ClipboardCheck,
  CreditCard,
  PartyPopper,
  Bot,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { name: 'Admissions', icon: GraduationCap },
  { name: 'Fees & Scholarships', icon: CreditCard },
  { name: 'Examinations', icon: ClipboardCheck },
  { name: 'Attendance', icon: CheckCircle2 },
  { name: 'Timetables', icon: Calendar },
  { name: 'Placements', icon: Award },
  { name: 'Campus Facilities', icon: Building2 },
  { name: 'Events', icon: PartyPopper },
];

export default function LandingPage() {
  const { user } = useAuth();
  const dashboardPath =
    user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';

  return (
    <div className="landing-wrapper" id="home">
      {/* Navbar */}
      <header className="landing-header">
        <nav className="landing-nav">
          <Link to="/" className="brand-logo">
            <span className="brand-mark">
              <Sparkles size={18} />
            </span>
            <span>AskCampus</span>
          </Link>

          <div className="landing-nav-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user ? (
              <Link to={dashboardPath} className="btn btn-primary">
                Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow" />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge">
            <Sparkles size={13} /> Intelligent Campus Companion
          </span>

          <h1 className="hero-title">
            Your Campus Questions, <span>Answered.</span>
          </h1>

          <p className="hero-subtitle">
            Meet your intelligent campus companion. Get instant answers about
            admissions, examinations, placements, fees and everything
            campus-related.
          </p>

          <div
            className="hero-actions"
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
          >
            <Link
              to={user ? dashboardPath : '/register'}
              className="btn btn-primary btn-lg"
            >
              Start Asking <ArrowRight size={17} />
            </Link>
            <a href="#features" className="btn btn-outline btn-lg">
              Explore Features
            </a>
          </div>
        </div>

        {/* AI Assistant Visual */}
        <div className="hero-visual">
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '12px',
            }}
          >
            <div className="floating-pill">
              <CheckCircle2 size={15} color="var(--success)" />
              <span>Based on Campus FAQ &middot; Attendance</span>
            </div>
          </div>

          <div className="hero-ai-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingBottom: '14px',
                borderBottom: '1px solid var(--border)',
                marginBottom: '16px',
              }}
            >
              <div className="brand-mark" style={{ width: '32px', height: '32px' }}>
                <Bot size={17} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>
                  AskCampus AI
                </div>
                <div style={{ fontSize: '12px', color: 'var(--success)' }}>
                  ● Online &amp; Ready
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  alignSelf: 'flex-end',
                  background: 'linear-gradient(135deg, var(--primary-purple), #756DFF)',
                  color: '#FFFFFF',
                  padding: '10px 14px',
                  borderRadius: '14px 14px 4px 14px',
                  fontSize: '13.5px',
                  maxWidth: '85%',
                }}
              >
                What is the minimum attendance required for semester exams?
              </div>

              <div
                style={{
                  alignSelf: 'flex-start',
                  background: '#F4F5FA',
                  border: '1px solid var(--border)',
                  padding: '12px 14px',
                  borderRadius: '14px 14px 14px 4px',
                  fontSize: '13.5px',
                  maxWidth: '92%',
                }}
              >
                <div style={{ marginBottom: '6px' }}>
                  <span className="badge">Based on Campus FAQ</span>
                </div>
                A minimum of <strong>75% attendance</strong> in each subject
                (lectures &amp; labs combined) is mandatory to sit for
                end-semester exams.
              </div>
            </div>
          </div>

          <div style={{ marginTop: '14px' }}>
            <div className="floating-pill" style={{ animationDelay: '1.2s' }}>
              <Sparkles size={15} color="var(--primary-purple)" />
              <span>&ldquo;How do I apply for scholarships?&rdquo;</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-section" id="features">
        <div className="section-header">
          <span className="badge">Features</span>
          <h2>Designed for Modern Campus Support</h2>
          <p>
            Fast, accurate, and organized answers for students — powerful
            analytics and control for college administrators.
          </p>
        </div>

        <div className="grid-3">
          <div className="card card-hover">
            <div className="stat-icon" style={{ marginBottom: '16px' }}>
              <Sparkles size={22} />
            </div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
              Instant AI Answers
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Ask questions in natural language. Our backend matches verified
              campus FAQs and formats clear, concise responses.
            </p>
          </div>

          <div className="card card-hover">
            <div className="stat-icon" style={{ marginBottom: '16px' }}>
              <BookOpen size={22} />
            </div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
              Verified FAQ Knowledge Base
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Every answer is grounded in official college FAQs maintained by
              your campus administration, with full conversation history.
            </p>
          </div>

          <div className="card card-hover">
            <div className="stat-icon" style={{ marginBottom: '16px' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
              Admin Analytics &amp; Insights
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Track most asked questions, popular categories, and unanswered
              student queries using MongoDB aggregation reports.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-section" id="about">
        <div className="section-header">
          <span className="badge">How It Works</span>
          <h2>From Question to Clarity in Seconds</h2>
          <p>Three simple steps built around your daily student workflow.</p>
        </div>

        <div className="grid-3">
          <div className="card">
            <span className="badge" style={{ marginBottom: '12px' }}>
              01 &middot; Ask
            </span>
            <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>
              Type Your Campus Question
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Open the AI Chat Assistant and ask about exams, fees, hostels,
              timetables, or placements.
            </p>
          </div>

          <div className="card">
            <span className="badge" style={{ marginBottom: '12px' }}>
              02 &middot; Match
            </span>
            <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>
              Smart MongoDB FAQ Search
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              AskCampus searches indexed FAQ entries to find the exact official
              policy or guideline.
            </p>
          </div>

          <div className="card">
            <span className="badge" style={{ marginBottom: '12px' }}>
              03 &middot; Save
            </span>
            <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>
              Clear Answer &amp; History
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Get a readable answer with a &ldquo;Based on Campus FAQ&rdquo;
              badge, saved automatically to your chat history.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="landing-section">
        <div className="section-header">
          <span className="badge">Categories</span>
          <h2>Explore Campus Topics</h2>
          <p>Everything students need across 8 core college categories.</p>
        </div>

        <div className="grid-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={user ? '/student/faqs' : '/login'}
                className="card card-hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 18px',
                }}
              >
                <div
                  className="stat-icon"
                  style={{ width: '40px', height: '40px' }}
                >
                  <Icon size={19} />
                </div>
                <span style={{ fontWeight: 600, fontSize: '14.5px' }}>
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-section">
        <div className="cta-banner">
          <h2 style={{ fontSize: '30px', marginBottom: '10px' }}>
            Ready to Get Instant Campus Answers?
          </h2>
          <p
            style={{
              color: '#B8B9CE',
              maxWidth: '520px',
              margin: '0 auto 24px',
              fontSize: '15px',
            }}
          >
            Create your free student account in seconds or sign in to access
            your AI FAQ assistant.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to={user ? dashboardPath : '/register'}
              className="btn btn-primary btn-lg"
            >
              Get Started Free <ArrowRight size={17} />
            </Link>
            <Link
              to="/login"
              className="btn btn-outline btn-lg"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#FFFFFF',
                borderColor: 'rgba(255,255,255,0.2)',
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          backgroundColor: '#FFFFFF',
          padding: '28px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
          }}
        >
          <div className="brand-logo" style={{ fontSize: '16px' }}>
            <span className="brand-mark" style={{ width: '28px', height: '28px' }}>
              <Sparkles size={14} />
            </span>
            <span>AskCampus</span>
          </div>
          <span>AskCampus &mdash; AI FAQ Assistant &middot; MERN Stack</span>
        </div>
      </footer>
    </div>
  );
}
