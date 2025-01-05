const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Proxy middleware configuration
const proxy = createProxyMiddleware({
  target: 'https://app.zakya.com',
  changeOrigin: true,
  onProxyRes: function (proxyRes) {
    // Remove headers that prevent iframe embedding
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['X-Frame-Options'];
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
}
});


// Use the proxy for all routes
app.use('/', proxy);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
