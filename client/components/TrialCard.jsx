import { useState } from 'react';
import { useBookmarkContext } from '../context/BookmarkContext';
import { getSummary } from '../api/summaries';

/**
 * TrialCard
 *
 * Props (all come from the normalised trial object):
 *   trial.nctId        {string}   e.g. "NCT04321234"
 *   trial.title        {string}   brief official title
 *   trial.status       {string}   e.g. "RECRUITING", "COMPLETED"
 *   trial.phase        {string}   e.g. "PHASE2", "N/A"
 *   trial.conditions   {string[]} list of condition strings
 *   trial.eligibility  {string}   raw eligibility criteria text
 */
export default function TrialCard({ trial }) {
  const { nctId, title, status, phase, conditions = [], eligibility } = trial;

  const { isBookmarked, bookmark, unbookmark } = useBookmarkContext();
  const bookmarked = isBookmarked(nctId);

  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  const handleBookmark = async () => {
    if (bookmarked) {
      await unbookmark(nctId);
    } else {
      await bookmark(nctId, title);
    }
  };

  const handleSummaryToggle = async () => {
    if (summaryOpen) {
      setSummaryOpen(false);
      return;
    }
    setSummaryOpen(true);
    if (summary) return; // already fetched

    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const result = await getSummary(nctId, eligibility);
      setSummary(result.summary);
    } catch  {
      setSummaryError('Could not load summary. Try again.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const statusMeta = getStatusMeta(status);
  const phaseLabel = formatPhase(phase);

  return (
    <article className="trial-card">
      {/* ── Header row ── */}
      <div className="trial-card__header">
        <div className="trial-card__meta">
          <span className="trial-card__nct-id">{nctId}</span>
          <span className={`trial-card__status trial-card__status--${statusMeta.key}`}>
            <span className="trial-card__status-dot" aria-hidden="true" />
            {statusMeta.label}
          </span>
          {phaseLabel && (
            <span className="trial-card__phase">{phaseLabel}</span>
          )}
        </div>

        <button
          className={`trial-card__bookmark${bookmarked ? ' trial-card__bookmark--active' : ''}`}
          onClick={handleBookmark}
          aria-label={bookmarked ? `Remove ${nctId} from bookmarks` : `Bookmark ${nctId}`}
          title={bookmarked ? 'Remove bookmark' : 'Save trial'}
        >
          <BookmarkIcon filled={bookmarked} />
        </button>
      </div>

      {/* ── Title ── */}
      <h3 className="trial-card__title">{title}</h3>

      {/* ── Conditions ── */}
      {conditions.length > 0 && (
        <div className="trial-card__conditions" aria-label="Conditions">
          {conditions.slice(0, 4).map((c) => (
            <span key={c} className="trial-card__tag">{c}</span>
          ))}
          {conditions.length > 4 && (
            <span className="trial-card__tag trial-card__tag--overflow">
              +{conditions.length - 4}
            </span>
          )}
        </div>
      )}

      {/* ── Eligibility summary toggle ── */}
      {eligibility && (
        <div className="trial-card__summary-section">
          <button
            className="trial-card__summary-toggle"
            onClick={handleSummaryToggle}
            aria-expanded={summaryOpen}
          >
            <span>{summaryOpen ? 'Hide' : 'View'} eligibility summary</span>
            <ChevronIcon open={summaryOpen} />
          </button>

          {summaryOpen && (
            <div className="trial-card__summary-body" role="region" aria-live="polite">
              {summaryLoading && (
                <div className="trial-card__summary-loading">
                  <span className="trial-card__spinner" aria-hidden="true" />
                  Generating summary…
                </div>
              )}
              {summaryError && (
                <p className="trial-card__summary-error">{summaryError}</p>
              )}
              {summary && (
                <p className="trial-card__summary-text">{summary}</p>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function getStatusMeta(status = '') {
  const s = status.toUpperCase();
  if (s.includes('RECRUIT'))  return { key: 'recruiting',  label: 'Recruiting' };
  if (s.includes('COMPLET'))  return { key: 'completed',   label: 'Completed' };
  if (s.includes('ACTIVE'))   return { key: 'active',      label: 'Active' };
  if (s.includes('SUSPEND'))  return { key: 'suspended',   label: 'Suspended' };
  if (s.includes('TERMINAT')) return { key: 'terminated',  label: 'Terminated' };
  if (s.includes('WITHDRAWN'))return { key: 'withdrawn',   label: 'Withdrawn' };
  return { key: 'unknown', label: status || 'Unknown' };
}

function formatPhase(phase = '') {
  if (!phase || phase === 'N/A' || phase === 'NA') return null;
  return phase
    .replace('PHASE', 'Phase ')
    .replace('_', '/')
    .replace(/([A-Z])(\d)/g, '$1 $2')
    .trim();
}

// ── Icon sub-components ──────────────────────────────────────────────────────

function BookmarkIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
      aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}