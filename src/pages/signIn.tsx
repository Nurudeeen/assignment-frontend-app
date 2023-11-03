import { useContext, useEffect, useRef } from "react";
import { Button, Col, Container, Form, Navbar } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";



function SignIn() {
    const navigate = useNavigate();
    const user = useContext(AuthContext);

const emailRef = useRef<HTMLInputElement>(null);
const passwordRef = useRef<HTMLInputElement>(null);

useEffect(() => {
    if(sessionStorage.getItem('token')){
        navigate('/dashboard');
    }
})

const signIn = async () => {
try {
  await auth.signInWithEmailAndPassword(
    emailRef.current!.value,
    passwordRef.current!.value
  )
  const user = auth.currentUser;
  if (user) {
    const idToken = await user.getIdToken();
    if(idToken){
        sessionStorage.setItem('token', idToken);
    }
  }
} catch (error) {
  console.error(error);
}
};

const signOut = async () => {
await auth.signOut();
};

return (
<>
    <SignContainer>
    <Navbar className="justify-content-between" bg="dark" variant="dark">
    <Navbar.Brand className="name">Firebase Authentication</Navbar.Brand>
    {user && <Button onClick={signOut}>Sign Out</Button>}
  </Navbar>
  {!user ? (
    <Container className="login" style={{ maxWidth: "500px" }} fluid>
      <Form className="mt-4">
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control ref={emailRef} type="email" placeholder="email" />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            ref={passwordRef}
            type="password"
            placeholder="password"
          />
        </Form.Group>
        <Row>
          <Col xs={6}>
            <Button
              onClick={signIn}
              type="button"
              variant="secondary"
            >
              Sign In
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  ) : (
    <h2 className="mt-4 text-center">Welcome {user.email}</h2>
  )}
    </SignContainer>

</>
);
}

const SignContainer = styled.div`
    margin: 0 auto;
    padding: 0 20px;
    max-width: 600px;
    width: 100%;
    Navbar{
        background-color: #4e0eff;
        padding: 1rem 0;
        border-radius: 0.4rem;
        margin-bottom: 2rem;
        align-items: center;
        justify-content: space-between;
        Button{
            background-color: #997af0;
            border: none;
            &:hover{
                background-color: #4e0eff;
            }
        }

    }
    .navbar-brand{
        text-transform: uppercase;
        text-align: center;
        padding: 7px;
        color: black;
        font-weight: bold;
        font-size: 1.2rem;
    }
    .login{
        align-items: center;
        justify-content: center;
        display: flex;
        form{
            gap: 2rem;
            background-color: #ddd;
            border-radius: 2rem;
            border: 0.1rem solid #997af0;
            padding: 3rem 5rem;
            label{
                color: #000;
                font-weight: bold;
                font-size: 1.2rem;
                margin-bottom: 1rem;
            }
            input{
                margin-bottom: 1rem;
                background-color: transparent;
                padding: 1rem;
                border: 0.1rem solid #4e0eff;
                border-radius: 0.4rem;
                color: white;
                width: 100%;
                font-size: 1rem;
                &:focus{
                    border: 0.1rem solid #997af0;
                    outline: none;
                }
            }
            button{
                background-color: #997af0;
                color: white;
                padding: 1rem 2rem;
                border: none;
                font-weight: bold;
                cursor: pointer;
                border-radius: 0.4rem;
                font-size: 1rem;
                text-transform: uppercase;
                transition: 0.5s ease-in-out;
                &:hover{
                    background-color: #4e0eff;
                }
            }
        }
    }
`;

export default SignIn;
