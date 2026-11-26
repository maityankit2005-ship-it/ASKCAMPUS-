import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { apiRequest } from '../utils/api';

const CATEGORIES = [
  'Admissions',
  'Fees and Scholarships',
  'Examinations',
  'Attendance',
  'Timetables',
  'Placements',
  'Campus Facilities',
  'Events',
];

export default function AdminFAQs() {
  const [searchParams] = useSearchParams();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filterCategory, setFilterCategory] = useState(
    searchParams.get('category') || 'All'
  );

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation Modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFAQs = async (searchTerm = search, cat = filterCategory) => {
    setLoading(true);
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
    fetchFAQs();
  }, [filterCategory]);

  const openAddModal = () => {
    setEditingId(null);
    setQuestion('');
    setAnswer('');
    setCategory(CATEGORIES[0]);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (faq) => {
    setEditingId(faq._id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (editingId) {
        await apiRequest(`/faqs/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({ question, answer, category }),
        });
        setSuccess('FAQ updated successfully.');
      } else {
        await apiRequest('/faqs', {
          method: 'POST',
          body: JSON.stringify({ question, answer, category }),
        });
        setSuccess('New FAQ added successfully.');
      }
      setModalOpen(false);
      await fetchFAQs();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError('');
    setSuccess('');
    try {
      await apiRequest(`/faqs/${deleteTarget._id}`, { method: 'DELETE' });
      setSuccess('FAQ deleted successfully.');
      setDeleteTarget(null);
      await fetchFAQs();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFAQs(search, filterCategory);
  };

  return (
    <DashboardLayout title="Manage FAQs">
      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <div className="card">
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              gap: '8px',
              flex: 1,
              minWidth: '240px',
              maxWidth: '460px',
            }}
          >
            <input
              type="text"
              className="input"
              placeholder="Search FAQs by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-outline">
              <Search size={16} />
              Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select
              className="select"
              style={{ width: 'auto', minWidth: '185px' }}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="btn btn-primary"
              onClick={openAddModal}
            >
              <Plus size={16} />
              Add FAQ
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="skeleton" style={{ height: '54px' }} />
            <div className="skeleton" style={{ height: '54px' }} />
            <div className="skeleton" style={{ height: '54px' }} />
          </div>
        ) : faqs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            No FAQs found for the selected filter.
          </p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Question &amp; Answer</th>
                  <th>Category</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq) => (
                  <tr key={faq._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{faq.question}</div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          marginTop: '4px',
                        }}
                      >
                        {faq.answer}
                      </div>
                    </td>
                    <td>
                      <span className="badge">{faq.category}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => openEditModal(faq)}
                          aria-label="Edit FAQ"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteTarget(faq)}
                          aria-label="Delete FAQ"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit FAQ Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px',
              }}
            >
              <h2 style={{ fontSize: '19px' }}>
                {editingId ? 'Edit FAQ' : 'Add New FAQ'}
              </h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="modal-question">Question</label>
                <input
                  id="modal-question"
                  type="text"
                  className="input"
                  placeholder="Enter college FAQ question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  minLength={5}
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-category">Category</label>
                <select
                  id="modal-category"
                  className="select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="modal-answer">Answer</label>
                <textarea
                  id="modal-answer"
                  className="textarea"
                  rows={4}
                  placeholder="Write a clear, helpful answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                  minLength={5}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '8px',
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? 'Saving...'
                    : editingId
                    ? 'Save Changes'
                    : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div
          className="modal-backdrop"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="modal-card"
            style={{ maxWidth: '420px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>
              Delete FAQ?
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginBottom: '20px',
              }}
            >
              Are you sure you want to delete{' '}
              <strong>&ldquo;{deleteTarget.question}&rdquo;</strong>? This
              action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-outline"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={deleting}
                onClick={handleConfirmDelete}
              >
                {deleting ? 'Deleting...' : 'Delete FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
