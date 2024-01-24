const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/admin', createProxyMiddleware({
  target: 'http://localhost:5173', 
  changeOrigin: true
}));

app.use('/login', createProxyMiddleware({
  target: 'http://localhost:5174', 
  changeOrigin: true
}));

app.use('/', createProxyMiddleware({
  target: 'http://localhost:5175', 
  changeOrigin: true
}));

app.listen(80, '127.0.0.2'); 