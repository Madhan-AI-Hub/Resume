const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api/resume'
  : 'https://resume-wgdf.onrender.com/api/resume';

export default API_URL;

