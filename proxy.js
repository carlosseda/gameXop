const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const options = {
  target: 'http://127.0.0.1:8080', 
  cookieDomainRewrite: 'dev-gamexop.com', 
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: function(proxyReq, req, res) {
    proxyReq.setHeader('Accept-Language', req.headers['accept-language']);
  }
};

app.use('/api', createProxyMiddleware(options));

options.target = 'http://localhost:5173';
app.use('/admin', createProxyMiddleware(options));

options.target = 'http://localhost:5174';
app.use('/login', createProxyMiddleware(options));

options.target = 'http://localhost:5175';
app.use('/', createProxyMiddleware(options));

app.listen(80, '127.0.0.1');