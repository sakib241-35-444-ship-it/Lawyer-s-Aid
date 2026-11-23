// One place for all server calls
const token = () => localStorage.getItem('token');

async function request(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  if (token()) headers.Authorization = `Bearer ${token()}`;
  if (body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: form || (body ? JSON.stringify(body) : undefined),
  });

  if (res.status === 401 && token()) {
    localStorage.removeItem('token');
    localStorage.removeItem('lawyer');
    window.location.href = '/login';
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// Opens a protected file (uses the login token, so we fetch it as a blob)
export async function openDocument(caseId, docId, download = false) {
  const res = await fetch(`/api/cases/${caseId}/documents/${docId}/file${download ? '?download=1' : ''}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  if (!res.ok) throw new Error('Could not open file');
  const url = URL.createObjectURL(await res.blob());
  if (download) {
    const a = document.createElement('a'); a.href = url; a.click();
  } else window.open(url, '_blank');
}

export const api = {
  get: (p) => request(p),
  post: (p, body) => request(p, { method: 'POST', body }),
  put: (p, body) => request(p, { method: 'PUT', body }),
  del: (p) => request(p, { method: 'DELETE' }),
  upload: (p, form) => request(p, { method: 'POST', form }),
};

export const PRACTICE_AREAS = ['Family', 'Criminal', 'Property', 'Labour', 'Consumer', 'Cyber', 'Contract', 'Inheritance'];
export const CASE_TYPES = ['Civil', 'Criminal', 'Family', 'Writ', 'Company', 'Labour', 'Cyber', 'Other'];
export const STATUSES = ['Pending', 'Ongoing', 'Hearing', 'Adjourned', 'Judgment Reserved', 'Disposed', 'Closed'];
export const FIELD_LABELS = {
  case_no: 'Case No.', case_title: 'Case Title', case_type: 'Type', current_status: 'Current Status',
  filing_date: 'Filing Date', next_hearing_date: 'Next Hearing Date', client_name: 'Client Name',
  court_name: 'Court Name', description: 'Description',
};
