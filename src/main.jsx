import React, { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Global Error Boundary Caught]:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('mimibit_auth_token');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#06080D',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '480px',
            backgroundColor: '#121214',
            border: '1px solid rgba(228, 9, 43, 0.3)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 25px 70px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 16px',
              borderRadius: '16px',
              backgroundColor: 'rgba(228, 9, 43, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px'
            }}>
              🥕
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '8px' }}>
              미미빗 일시적 화면 안내
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px', lineHeight: '1.6' }}>
              페이지 로딩 중 일시적인 문제가 감지되었습니다.<br />
              새로고침을 통해 정상 화면으로 복구할 수 있습니다.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 24px',
                  borderRadius: '14px',
                  backgroundColor: '#E4092B',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                페이지 새로고침
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 20px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                초기화 후 재시작
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </StrictMode>
);
