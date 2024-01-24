const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({
  target: 'http://127.0.0.1:8080', 
  cookieDomainRewrite: 'dev-gamexop.com', 
  changeOrigin: true,
  logLevel: 'debug'
}));

app.use('/admin', createProxyMiddleware({
  target: 'http://localhost:5173', 
  changeOrigin: true,
  cookieDomainRewrite: 'dev-gamexop.com', 
  logLevel: 'debug'
}));

app.use('/login', createProxyMiddleware({
  target: 'http://localhost:5174', 
  cookieDomainRewrite: 'dev-gamexop.com', 
  changeOrigin: true,
  logLevel: 'debug'
}));

app.use('/', createProxyMiddleware({
  target: 'http://localhost:5175', 
  cookieDomainRewrite: 'dev-gamexop.com', 
  changeOrigin: true,
  logLevel: 'debug'
}));

app.listen(80, '127.0.0.1'); 