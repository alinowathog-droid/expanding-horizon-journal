/**
 * Expanding Horizon Journal
 * Netlify Forms -> Google Apps Script -> Gmail notification bridge
 *
 * Deploy this file as a Google Apps Script Web App.
 * Before deployment, replace WEBHOOK_SECRET with a private random value.
 */

const RECIPIENT_EMAIL = 'editor@expandinghorizonjournal.org';
const WEBHOOK_SECRET = 'CHANGE_THIS_TO_A_PRIVATE_SECRET';
const JOURNAL_NAME = 'Expanding Horizon Journal';
const NETLIFY_FORMS_URL = 'https://app.netlify.com/projects/endearing-daifuku-de44d5/forms';

function doGet() {
  return ContentService
    .createTextOutput('Expanding Horizon Journal submission notification endpoint is active.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const suppliedSecret = e && e.parameter ? (e.parameter.key || '') : '';
    if (WEBHOOK_SECRET && WEBHOOK_SECRET !== 'CHANGE_THIS_TO_A_PRIVATE_SECRET' && suppliedSecret !== WEBHOOK_SECRET) {
      return jsonResponse_({ ok: false, error: 'Unauthorized' });
    }

    const raw = e && e.postData ? e.postData.contents : '';
    if (!raw) {
      return jsonResponse_({ ok: false, error: 'Empty request body' });
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch (parseError) {
      payload = { rawBody: raw };
    }

    const data = payload.data || payload;
    const author = value_(data, 'corresponding_author');
    const email = value_(data, 'email');
    const affiliation = value_(data, 'affiliation');
    const country = value_(data, 'country');
    const title = value_(data, 'title') || 'Untitled manuscript';
    const articleType = value_(data, 'article_type');
    const coauthors = value_(data, 'coauthors');
    const keywords = value_(data, 'keywords');
    const abstract = value_(data, 'abstract');
    const submissionId = value_(payload, 'submission_id') || value_(payload, 'id') || value_(data, 'submission_id');
    const manuscript = value_(data, 'manuscript');
    const titlePage = value_(data, 'title_page');

    const subject = 'New Manuscript Submission | ' + JOURNAL_NAME + ' | ' + title;
    const plainBody = buildPlainBody_({
      author, email, affiliation, country, title, articleType,
      coauthors, keywords, abstract, submissionId, manuscript, titlePage
    });
    const htmlBody = buildHtmlBody_({
      author, email, affiliation, country, title, articleType,
      coauthors, keywords, abstract, submissionId, manuscript, titlePage
    });

    const options = {
      htmlBody: htmlBody,
      name: JOURNAL_NAME
    };

    if (isEmail_(email)) {
      options.replyTo = email;
    }

    MailApp.sendEmail(RECIPIENT_EMAIL, subject, plainBody, options);

    return jsonResponse_({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, error: String(error) });
  }
}

function value_(obj, key) {
  if (!obj || obj[key] === undefined || obj[key] === null) return '';
  const value = obj[key];
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  try { return JSON.stringify(value); } catch (_) { return String(value); }
}

function isEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildPlainBody_(d) {
  return [
    JOURNAL_NAME,
    'NEW MANUSCRIPT SUBMISSION',
    '',
    'Corresponding author: ' + d.author,
    'Email: ' + d.email,
    'Affiliation: ' + d.affiliation,
    'Country: ' + d.country,
    'Manuscript title: ' + d.title,
    'Article type: ' + d.articleType,
    'Co authors: ' + d.coauthors,
    'Keywords: ' + d.keywords,
    'Submission ID: ' + d.submissionId,
    '',
    'Abstract:',
    d.abstract,
    '',
    'Manuscript file: ' + d.manuscript,
    'Title page file: ' + d.titlePage,
    '',
    'Open Netlify Forms:',
    NETLIFY_FORMS_URL
  ].join('\n');
}

function buildHtmlBody_(d) {
  const row = (label, value) => '<tr><td style="padding:7px 12px;font-weight:600;vertical-align:top;border-bottom:1px solid #e5e5e5;">' + escapeHtml_(label) + '</td><td style="padding:7px 12px;border-bottom:1px solid #e5e5e5;">' + escapeHtml_(value) + '</td></tr>';
  return '<div style="font-family:Arial,sans-serif;color:#18211f;line-height:1.5;max-width:760px">' +
    '<h2 style="margin-bottom:4px">New Manuscript Submission</h2>' +
    '<p style="margin-top:0;color:#68716d">' + escapeHtml_(JOURNAL_NAME) + '</p>' +
    '<table style="border-collapse:collapse;width:100%;font-size:14px">' +
    row('Corresponding author', d.author) +
    row('Email', d.email) +
    row('Affiliation', d.affiliation) +
    row('Country', d.country) +
    row('Manuscript title', d.title) +
    row('Article type', d.articleType) +
    row('Co authors', d.coauthors) +
    row('Keywords', d.keywords) +
    row('Submission ID', d.submissionId) +
    '</table>' +
    '<h3>Abstract</h3><p style="white-space:pre-wrap">' + escapeHtml_(d.abstract) + '</p>' +
    '<h3>Submitted files</h3>' +
    '<p><strong>Manuscript:</strong> ' + escapeHtml_(d.manuscript) + '<br>' +
    '<strong>Title page:</strong> ' + escapeHtml_(d.titlePage) + '</p>' +
    '<p><a href="' + NETLIFY_FORMS_URL + '">Open Expanding Horizon Journal submissions in Netlify</a></p>' +
    '</div>';
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
