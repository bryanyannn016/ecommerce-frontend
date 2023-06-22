import React, { useState } from 'react';
import { Button, Col, Container, Form, Row, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLoginMutation } from '../services/appApi';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isError, isLoading, error }] = useLoginMutation();
  function handleLogin(e) {
    e.preventDefault();
    login({ email, password });
  }
  return ( 
    <div className="login-page">
    <Container>
      <Row>
        <Col md={6} className="login__form--container">
          <Form style={{ width: '80%', marginRight:'20vw' }} onSubmit={handleLogin}>
            <h1 style={{marginBottom:'50px'}}>Login to your account</h1>
            {isError && <Alert variant="danger">{error.data}</Alert>}
            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" style={{marginTop:'20px'}}>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Button type="submit" disabled={isLoading} style={{marginTop: '5px'}}>
                Login
              </Button>
            </Form.Group>

            <p className="pt-3 text-center">
              Don't have an account? <Link to="/signup">Create account</Link>{' '}
            </p>
          </Form>
        </Col>
        <Col md={6} className="login__image--container"></Col>
      </Row>
    </Container>
    </div>
  );
  
}

export default Login;
