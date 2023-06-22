import React from 'react';
import { Container, Nav, Tab, Col, Row } from 'react-bootstrap';
import ClientsAdminPage from '../components/ClientsAdminPage';
import DashboardProducts from '../components/DashboardProducts';
import OrdersAdminPage from '../components/OrdersAdminPage';
import NewProduct from './NewProduct';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
    <Container>
      <Tab.Container defaultActiveKey="products">
        <Row>
          <Col sm={2} style={{marginRight: '25px'}}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="products">Products</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders">Orders</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="clients">Clients</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="create-products">Create Product</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="products">
                <DashboardProducts />
              </Tab.Pane>
              <Tab.Pane eventKey="orders">
                <OrdersAdminPage />
              </Tab.Pane>
              <Tab.Pane eventKey="clients">
                <ClientsAdminPage />
              </Tab.Pane>
              <Tab.Pane eventKey="create-products">
                <NewProduct />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
    </div>
  );
}

export default AdminDashboard;
