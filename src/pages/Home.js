import axios from 'axios';
import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import categories from '../categories';
import './Home.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateProducts } from '../features/productSlice';
import ProductPreview from '../components/ProductPreview';

function Home() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const lastProducts = products.slice(0, 8);
  useEffect(() => {
    axios
      .get('http://localhost:8080/products')
      .then(({ data }) => dispatch(updateProducts(data)));
  }, [dispatch]);
  return (
    <div>
      <div className="banner" style={{backgroundColor: 'white'}}>
      <img src="https://res.cloudinary.com/dpvwyxhjo/image/upload/v1686822240/flipzonebannerv2_xkmzkl.svg" className="home-banner" alt=""/>
      </div>

      <div className='main'>
        <div className="featured-products-container container mt-4">
          <h1>NEW PRODUCTS</h1>
          <p>Browse through our newest products in catalogue</p>
          {/* last products here */}
          <div className="d-flex justify-content-center flex-wrap">
            {lastProducts.map((product) => (
              <ProductPreview {...product} />
            ))}
          </div>

          <div>
            <Link
              to="/category/all"
              style={{
                textAlign: 'right',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              See more {'>>'}
            </Link>
          </div>
        </div>

        
      </div>

    <div className='home-category'>
      <div className="recent-products-container container mt-4">
          <h2>CATEGORIES</h2>
          <p>Have a general look at the products we offer</p>
           <Row>
             {categories.map((category) => (
               <LinkContainer
                 to={`/category/${category.name.toLocaleLowerCase()}`}
               >
                 <Col md={3}>
                   <div
                     style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url(${category.img})`,
                       gap: '10px',
                       borderRadius: '15px',
                       boxShadow: 'rgba(255, 255, 255, 0.5) 0px 3px 8px',
                      
                     }}
                     className="category-tile"
                  >
                     {category.name}
                   </div>
                 </Col>
              </LinkContainer>
             ))}
           </Row>
        </div>
        </div>
    </div>
  );
}

export default Home;
