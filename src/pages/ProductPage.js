import axios from '../axios';
import React, { useEffect, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import {
  Container,
  Row,
  Col,
  Badge,
  ButtonGroup,
  Form,
  Button,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import SimilarProduct from '../components/SimilarProduct';
import './ProductPage.css';
import { LinkContainer } from 'react-router-bootstrap';
import { useAddToCartMutation } from '../services/appApi';
import ToastMessage from '../components/ToastMessage';

function ProductPage() {
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState(null);
  const [addToCart, { isSuccess }] = useAddToCartMutation();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  let availableStocks = 0;

  const handleDragStart = (e) => e.preventDefault();
  useEffect(() => {
    axios.get(`/products/${id}`).then(({ data }) => {
      setProduct(data.product);
      setSimilar(data.similar);
    });
  }, [id]);

  if (!product) {
    return <Loading />;
  }
  const responsive = {
    0: { items: 1 },
     568: { items: 2 },
    1024: { items: 3 },
  };

  const images = product.pictures.map((picture) => (
    <img
      className="product__carousel--image"
      src={picture.url}
      alt=""
      onDragStart={handleDragStart}
    />
  ));

  let similarProducts = [];
  if (similar) {
    similarProducts = similar.map((product, idx) => (
      <div className="item" data-value={idx}>
        <SimilarProduct {...product} />
      </div>
    ));
  }

  if (product) {
    availableStocks = product.stocks;
  }

  const handleAddToCart = () => {
    if (availableStocks === 0) return; // Prevent adding an unavailable product
    addToCart({
      userId: user._id,
      productId: id,
      price: product.price,
      image: product.pictures[0].url,
      quantity: selectedQuantity,
    })
      .unwrap()
      .then(() => setSelectedQuantity(1));
  };

  return (
    <div className="product-detail">
      <Container className="pt-4" style={{ position: 'relative' }}>
        <Row>
          <Col lg={6}>
            <AliceCarousel
              mouseTracking
              items={images}
              controlsStrategy="alternate"
            />
          </Col>
          <Col lg={6} className="pt-4">
            <h1>{product.name}</h1>
            <p>
              <Badge bg="primary">{product.category}</Badge>
            </p>
            <p className="product__price">${product.price}</p>
            <p
              style={{
                textAlign: 'justify',
                marginLeft: ' 20px',
                marginRight: '20px',
              }}
              className="py-3"
            >
              <strong>Description:</strong> {product.description}
            </p>
            {user && !user.isAdmin && (
              <ButtonGroup style={{ width: '90%' }}>
                <Form.Select
                  size="lg"
                  style={{
                    width: '40%',
                    borderRadius: '10px',
                    marginRight: '10px',
                  }}
                  value={selectedQuantity}
                  onChange={(e) =>
                    setSelectedQuantity(parseInt(e.target.value))
                  }
                >
                  <option value={1} disabled={availableStocks <= 0}>
                    1
                  </option>
                  <option value={2} disabled={availableStocks <= 0}>
                    2
                  </option>
                  <option value={3} disabled={availableStocks <= 0}>
                    3
                  </option>
                  <option value={4} disabled={availableStocks <= 0}>
                    4
                  </option>
                  <option value={5} disabled={availableStocks <= 0}>
                    5
                  </option>
                </Form.Select>

                <Button
                  size="lg"
                  style={{ borderRadius: '10px' }}
                  onClick={handleAddToCart}
                  disabled={availableStocks === 0}
                >
                  {availableStocks === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </ButtonGroup>
            )}
            {user && user.isAdmin && (
              <LinkContainer to={`/product/${product._id}/edit`}>
                <Button size="lg">Edit Product</Button>
              </LinkContainer>
            )}
            {isSuccess && (
              <ToastMessage
                bg="info"
                title="Added to cart"
                body={`${product.name} is in your cart`}
              />
            )}
          </Col>
        </Row>
        <div className="my-4">
          <h2>Similar Products</h2>
          <div className="d-flex justify-content-center align-items-left flex-wrap">
            <AliceCarousel
              mouseTracking
              items={similarProducts}
              responsive={responsive}
              controlsStrategy="alternate"
              paddingLeft={150}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ProductPage;
