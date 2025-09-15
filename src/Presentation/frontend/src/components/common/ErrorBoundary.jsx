import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to the console
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div style={{ 
                    padding: '2rem', 
                    border: '1px solid #ff6b6b', 
                    borderRadius: '8px', 
                    backgroundColor: '#ffe0e0',
                    margin: '1rem'
                }}>
                    <h2 style={{ color: '#d63031', marginBottom: '1rem' }}>
                        Bir şeyler yanlış gitti! 😔
                    </h2>
                    <details style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                            Hata detaylarını göster
                        </summary>
                        <div style={{ 
                            marginTop: '1rem', 
                            padding: '1rem', 
                            backgroundColor: '#f8f9fa', 
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem'
                        }}>
                            <strong>Hata:</strong><br />
                            {this.state.error && this.state.error.toString()}
                            <br /><br />
                            <strong>Component Stack:</strong><br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack ? this.state.errorInfo.componentStack : 'Yığın bilgisi mevcut değil.'}
                        </div>
                    </details>
                    <button 
                        onClick={() => window.location.reload()} 
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#0984e3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Sayfayı Yenile
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
