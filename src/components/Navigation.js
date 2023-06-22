import axios from '../axios';
import React, { useRef, useState } from 'react';
import {
  Navbar,
  Button,
  Nav,
  NavDropdown,
  Container,
  Form,
  FormControl,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { logout, resetNotifications } from '../features/userSlice';
import { updateProducts } from '../features/productSlice'; // Import the updateProducts action
import './Navigation.css';
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const bellRef = useRef(null);
  const notificationRef = useRef(null);
  const [bellPos, setBellPos] = useState({});
  const [searchQuery, setSearchQuery] = useState(''); // Add searchQuery state

  function handleLogout() {
    dispatch(logout());
  }
  
  const unreadNotifications = user?.notifications?.reduce((acc, current) => {
    if (current.status === 'unread') return acc + 1;
    return acc;
  }, 0);

  function handleToggleNotifications() {
    const position = bellRef.current.getBoundingClientRect();
    setBellPos(position);
    notificationRef.current.style.display =
      notificationRef.current.style.display === 'block' ? 'none' : 'block';
    if (unreadNotifications > 0) {
      axios.post(`/users/${user._id}/updateNotifications`);
    }
    dispatch(resetNotifications());
  }
  
  
  function handleSearch(e) {
    e.preventDefault();
    axios
      .get(`http://localhost:8080/products/search/${searchQuery}`)
      .then(({ data }) => {
        dispatch(updateProducts(data));
        navigate(`/search?query=${searchQuery}`); // Navigate to search results page
      })
      .catch((error) => console.log(error));
  }
  
  function handleInputChange(e) {
    setSearchQuery(e.target.value);
  }

  return (
    <div className='navbar'>
    <Navbar bg="black" expand="lg" variant='dark' fixed="top">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Flipzone</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Search Bar */}
            <Form className="d-flex" onSubmit={handleSearch}>  
              {' '} 
              {/* Add onSubmit event handler */}
              <FormControl
                type="search"
                placeholder="Search"
                className="mr-2"
                value={searchQuery}
                onChange={handleInputChange} // Add onChange event handler
              />
              <Button className="search" variant="outline-success" type="submit">Search</Button> {/* Change to type="submit" */}
            </Form>

            {/* if no user */}
            {!user && (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
            {user && !user.isAdmin && (
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i>
                  {user?.cart.count > 0 && (
                    <span className="badge badge-warning" id="cartcount">
                      {user.cart.count}
                    </span>
                  )}
                </Nav.Link>
              </LinkContainer>
            )}

            {/* if user */}
            {user && (
              <>
                <Nav.Link
                  style={{ position: 'relative' }}
                  onClick={handleToggleNotifications}
                >
                  <i
                    className="fas fa-bell"
                    ref={bellRef}
                    data-count={unreadNotifications || null}
                  ></i>
                </Nav.Link>
                <NavDropdown title={`${user.name}`} id="basic-nav-dropdown">
                  {user.isAdmin && (
                    <>
                      <LinkContainer to="/admin">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}
                  {!user.isAdmin && (
                    <>
                      <LinkContainer to="/cart">
                        <NavDropdown.Item>Cart</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orders">
                        <NavDropdown.Item>My orders</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}

                  <NavDropdown.Divider />
                  <Button
                    variant="danger"
                    onClick={handleLogout}
                    className="logout-btn"
                  >
                    Logout
                  </Button>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      {/* notifications */}
      <div
        className="notifications-container"
        ref={notificationRef}
        style={{
          position: 'absolute',
          top: bellPos.top + 30,
          left: bellPos.left,
          display: 'none',
        }}
      >
        {user?.notifications.length > 0 ? (
          user?.notifications.map((notification) => (
            <p className={`notification-${notification.status}`}>
              {notification.message}
              <br />
              <span>
                {notification.time.split('T')[0] +
                  ' ' +
                  notification.time.split('T')[1]}
              </span>
            </p>
          ))
        ) : (
          <p>No notifcations yet</p>
        )}
      </div>
    </Navbar>
    </div>
  );
}

export default Navigation;
