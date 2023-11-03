import React, { useContext, useRef } from "react";
import { Button, Col, Container, Form, Navbar } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import { AuthContext } from "./context/AuthContext";
import { auth } from "./firebase";

function App() {
  const user = useContext(AuthContext);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);


const signIn = async () => {
  try {
    await auth.signInWithEmailAndPassword(
      emailRef.current!.value,
      passwordRef.current!.value
    )
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken();
      console.log('idToken:', idToken);
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
    <Navbar className="justify-content-between" bg="dark" variant="dark">
      <Navbar.Brand>Firebase Authentication</Navbar.Brand>
      {user && <Button onClick={signOut}>Sign Out</Button>}
    </Navbar>
    {!user ? (
      <Container style={{ maxWidth: "500px" }} fluid>
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
  </>
);
}

export default App;