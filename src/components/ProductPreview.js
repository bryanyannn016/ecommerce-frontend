import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function ProductPreview({ _id, category, name, pictures, stocks }) {
  const isAvailable = stocks > 0;

  return (
    <LinkContainer
      to={`/product/${_id}`}
      style={{ cursor: 'pointer', width: '13rem', margin: '10px' , backgroundColor: 'black', color:'white'}}
    >
      <Card
        style={{ width: '20rem', margin: '10px'}}
        className={!isAvailable ? 'unavailable' : ''}
      >
        {pictures && pictures.length > 0 && (
          <Card.Img
            variant="top"
            className="product-preview-img"
            src={pictures[0].url}
            style={{ height: '150px', objectFit: 'cover' }}
          />
        )}
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Badge bg="warning" text="dark">
            {category}
          </Badge>
          {!isAvailable && (
            <Badge bg="danger" className="ms-2">
              Unavailable
            </Badge>
          )}
        </Card.Body>
      </Card>
    </LinkContainer>
  );
}

export default ProductPreview;