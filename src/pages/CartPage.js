import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import { Alert, Col, Container, Row, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CheckoutForm from '../components/CheckoutForm';
import {
  useIncreaseCartProductMutation,
  useDecreaseCartProductMutation,
  useRemoveFromCartMutation,
} from '../services/appApi';
import './CartPage.css';

const stripePromise = loadStripe(
  'pk_test_51NJ7MPJnBsLyYEwfYhxYAZYN1aOZkyyixlHlEUBxELQ8JVH38o5cWqiJ9B4VPgBETtOaw2iTTL0pGBPaGYYFX2yB00HrqGWDUw'
);

function CartPage() {
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
  const userCartObj = user ? user.cart : null;
  let cart = products.filter((product) => userCartObj[product._id] > 0);
  const [increaseCart] = useIncreaseCartProductMutation();
  const [decreaseCart] = useDecreaseCartProductMutation();
  const [removeFromCart, { isLoading }] = useRemoveFromCartMutation();

  const handleDecrease = (product) => {
    const quantity = userCartObj ? userCartObj[product._id] : 0;
    if (quantity <= 0) {
      removeFromCart({
        productId: product._id,
        price: product.price,
        userId: user._id,
      });
    } else {
      decreaseCart({
        productId: product._id,
        price: product.price,
        userId: user._id,
      });
    }
  };

  const handleRemove = (product) => {
    removeFromCart({
      productId: product._id,
      price: product.price,
      userId: user._id,
    });
  };

  // Calculate the total price of the cart
  const calculateTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * userCartObj[item._id];
    });
    return total;
  };

  return (
    <Container style={{ minHeight: '95vh' }} className="cart-container">
      <Row>
        <Col>
          <div className="cart-name">
            <h1 className="pt-2">Shopping cart</h1>
            {cart.length === 0 ? (
              <Alert variant="info">
                Shopping cart is empty. Add products to your cart
              </Alert>
            ) : (
              <div className="order-details">
                <Elements stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              </div>
            )}
          </div>
        </Col>
        {cart.length > 0 && (
          <Col md={5}>
            <>
              <Table responsive="sm" variant="dark" borderless>
                <thead>
                  <tr>
                    <th>&nbsp;</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {/* loop through cart products */}
                  {cart.map((item) => (
                    <tr key={item._id}>
                      <td>&nbsp;</td>
                      <td>
                        {!isLoading && user && (
                          <i
                            className="fa fa-times"
                            style={{ marginRight: 10, cursor: 'pointer' }}
                            onClick={() => handleRemove(item)}
                          ></i>
                        )}

                        <img
                          src={item.pictures[0].url}
                          alt=""
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                          }}
                        />
                      </td>
                      <td>${item.price}</td>
                      <td>
                        <span className="quantity-indicator">
                          <i
                            className="fa fa-minus-circle"
                            onClick={() => handleDecrease(item)}
                            style={{
                              cursor: 'pointer',
                            }}
                          ></i>

                          <span>{userCartObj[item._id]}</span>
                          <i
                            className="fa fa-plus-circle"
                            onClick={() =>
                              increaseCart({
                                productId: item._id,
                                price: item.price,
                                userId: user._id,
                              })
                            }
                            style={{
                              cursor:
                                userCartObj[item._id] >= item.stocks
                                  ? 'not-allowed'
                                  : 'pointer',
                            }}
                          ></i>
                        </span>
                      </td>
                      <td>${item.price * userCartObj[item._id]}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div>
                <h3 className="h4 pt-4">Total: ${calculateTotal()}</h3>
              </div>
            </>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default CartPage;
