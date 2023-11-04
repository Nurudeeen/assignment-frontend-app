import React, { useContext, useRef, useState } from 'react';
import { Button, Container, TextField, Modal } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../firebase';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const SignContainer = styled('div')`
  // Your container styling here
`;

const FormContainer = styled(Container)`
  max-width: 500px;
  margin: 0 auto;
  padding: 16px;
`;

const FormWrapper = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ErrorModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorModalContent = styled('div')`
  background-color: white;
  border: 2px solid #000;
  box-shadow: 5px 10px #888888;
  padding: 16px;
`;

function SignIn() {
  const navigate = useNavigate();
  const user = useContext(AuthContext);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const signIn = async () => {
    try {
      setError(null);
      await auth.signInWithEmailAndPassword(
        emailRef.current!.value,
        passwordRef.current!.value
      );
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();
        if (idToken) {
          sessionStorage.setItem('token', idToken);

          // Check the user's email here and conditionally redirect
          if (user.email === 'admin@gmail.com') {
            navigate('/admin-dashboard'); // Redirect to the admin dashboard
          } else {
            navigate('/dashboard'); // Redirect to the regular dashboard
          }
        }
      }
    } catch (error) {
      setError('Invalid credentials. Please try again.');
      setShowErrorModal(true);
      console.error(error);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <SignContainer>
        <FormContainer>
          {user ? (
            <h2>Welcome {user.email}</h2>
          ) : (
            <FormWrapper>
              {error && <p>{error}</p>}
              <TextField
                label="Email"
                inputRef={emailRef}
                type="email"
                placeholder="email"
                variant="outlined"
              />
              <TextField
                label="Password"
                inputRef={passwordRef}
                type="password"
                placeholder="password"
                variant="outlined"
              />
              <Button variant="contained" onClick={signIn}>
                Sign In
              </Button>
            </FormWrapper>
          )}
        </FormContainer>
      </SignContainer>

      <ErrorModal open={showErrorModal} onClose={handleCloseErrorModal}>
        <ErrorModalContent>
          <h2>Error</h2>
          {error && <p>{error}</p>}
          <Button variant="contained" onClick={handleCloseErrorModal}>
            Close
          </Button>
        </ErrorModalContent>
      </ErrorModal>
    </>
  );
}

export default SignIn;
