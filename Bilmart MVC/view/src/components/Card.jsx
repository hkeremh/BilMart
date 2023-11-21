import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";

function ItemCard(props) {
  return (
  <div className="itemCard">
  <Card style={{ width: '280px' }}>
    <Card.Img variant="top" src="https://picsum.photos/400" height={210} width={280}/>
    <Card.Body>
      <Card.Title>{props.record.title}</Card.Title>
      <Card.Text>
        {props.record.description}
      </Card.Text>
    </Card.Body>
    <ListGroup className="list-group-flush">
      <ListGroup.Item>{props.record.availability}</ListGroup.Item>
      <ListGroup.Item>{props.record.type}</ListGroup.Item>
    </ListGroup>
    <Card.Body>
      <Container>
      <Row>
      <Col><Link to={`/item/${props.record._id}`}><Button variant="success" style={{backgroundColor: "#192655"}}>View</Button></Link></Col>
      <Col><Link to={`/edit/${props.record._id}`}><Button variant="success" style={{backgroundColor: "#192655"}}>Edit</Button></Link></Col>
      <Col><Button variant="danger" style={{backgroundColor: "#192655"}} onClick={() => {props.deleteRecord(props.record._id);}}>Delete</Button></Col>
      </Row>
      </Container>
    </Card.Body>
  </Card>
  </div>
  );
}

export default ItemCard;