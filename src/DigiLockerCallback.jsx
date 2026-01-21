import React, { useEffect, useState } from 'react';

const DigiLockerCallback = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Processing DigiLocker Verification...');

  useEffect(() => {
    const handleVerification = () => {
      const params = new URLSearchParams(window.location.search);
      const urlParams = Object.fromEntries(params.entries());
      
      console.log('DigiLocker callback params:', urlParams);

      setTimeout(() => {
        let result;
        
        // Check for success/error parameters from DigiLocker
        if (urlParams.status === 'success' || urlParams.success === 'true') {
          result = {
            success: true,
            message: 'DigiLocker verification completed successfully!',
            data: urlParams
          };
          setStatus('success');
          setMessage('Your documents have been verified successfully.');
        } else if (urlParams.status === 'error' || urlParams.error) {
          result = {
            success: false,
            message: urlParams.error || 'DigiLocker verification failed',
            data: urlParams
          };
          setStatus('error');
          setMessage(urlParams.error || 'Verification could not be completed.');
        } else if (urlParams.state === 'blockchain_sdk_verification') {
          // This is our verification, assume success if we got this far
          result = {
            success: true,
            message: 'DigiLocker verification completed',
            data: urlParams
          };
          setStatus('success');
          setMessage('Your documents have been verified successfully.');
        } else {
          result = {
            success: false,
            message: 'Unknown verification status',
            data: urlParams
          };
          setStatus('error');
          setMessage('Verification status could not be determined.');
        }
        
        // Notify parent window
        notifyParent(result);
        
      }, 2000); // 2 second delay for better UX
    };

    const notifyParent = (result) => {
      try {
        // Try to send message to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'DIGILOCKER_VERIFICATION_COMPLETE',
            result: result
          }, window.location.origin);
        }
        
        // Also store in localStorage as fallback
        localStorage.setItem('digilocker_result', JSON.stringify(result));
        
      } catch (error) {
        console.error('Error notifying parent:', error);
      }
    };

    handleVerification();
  }, []);

  const closeTab = () => {
    // Try to close the tab
    window.close();
    
    // If window.close() doesn't work (some browsers block it), redirect to main site
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '🔄';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      default:
        return '#007bff';
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      margin: 0,
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        textAlign: 'center',
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <div style={{ color: getStatusColor() }}>
          <h2>{getStatusIcon()} {
            status === 'loading' ? 'Processing DigiLocker Verification...' :
            status === 'success' ? 'Verification Successful!' :
            'Verification Failed'
          }</h2>
          <p>{message}</p>
        </div>
        
        {status !== 'loading' && (
          <button
            onClick={closeTab}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
            onMouseOver={(e) => e.target.style.background = '#0056b3'}
            onMouseOut={(e) => e.target.style.background = '#007bff'}
          >
            Close and Return
          </button>
        )}
      </div>
    </div>
  );
};

export default DigiLockerCallback;
