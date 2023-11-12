import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ItemCard(props) {
  return (
    <div className="itemCard">
    <Card style={{ width: '280px' }}>
      <Card.Img variant="top" src={props.src} height={210} width={280}/>
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Cras justo odio</ListGroup.Item>
        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Container>
        <Row>
        <Col><Card.Link href="#"><Button variant="success" style={{backgroundColor: "#192655"}}>View</Button></Card.Link></Col>
        <Col><h2>Price</h2></Col>
        </Row>
        </Container>
      </Card.Body>
    </Card>
    </div>
  );
}

export default ItemCard;