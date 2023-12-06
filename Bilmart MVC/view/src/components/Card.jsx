import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import deleteIcon from "../img/bin.png";

function ItemCard(props) {
  return (
  <div className="itemCard">
  <Card style={{ width: '280px', height: "500px", border: "1px solid #DED0B6"}}>
    <Card.Img className="centered-and-cropped" variant="top" src={props.record.images[0]} height={"220px"} width={"auto"} style={{maxWidth: "280px", borderBottom: "1px solid #DED0B6"}}/>
    <Card.Body>
      <Card.Title>
      {props.record.title.toString().length < 20 && <div className="text" style={{fontWeight: "bold"}}>{props.record.title}</div>}
      {props.record.title.toString().length >= 20 && <div className="text" style={{fontWeight: "bold"}}>{props.record.title.toString().substring(0, 17) + "..." }</div>}
      </Card.Title>
      <Card.Text>
        {props.record.description.toString().length < 40 && <div className="text">{props.record.description}</div>}
        {props.record.description.toString().length >= 40 && <div className="text">{props.record.description.toString().substring(0, 37) + "..." }</div>}
      </Card.Text>
    </Card.Body>
    <ListGroup className="list-group-flush">
      <ListGroup.Item><div className="text">{props.record.availability}</div></ListGroup.Item>
      <ListGroup.Item><div className="text" style={{fontWeight: "bold"}}>{props.record.type}</div></ListGroup.Item>
    </ListGroup>
    <Card.Body>
      <div>
      <Row>
      {!props.record.availability.includes("Unavailable") && <Col><Link to={`/item/${props.record._id}`}><Button variant="secondary" style={{backgroundColor: "#192655"}}><div className="text">View</div></Button></Link></Col>}
      {props.onProfile !== true && (props.record.type === "Sale Item" || props.record.type === "Borrowal Item") && (props.record.price.toString().length < 6) && <Col><div className="text" style={{backgroundColor: "#192655", border: "2px solid grey", borderRadius: "5px", height: "36px",padding: "3px"}}><h4 style={{color: "white"}}>{props.record.price + "₺"}</h4></div></Col>}
      {props.onProfile !== true && (props.record.type === "Sale Item" || props.record.type === "Borrowal Item") && (props.record.price.toString().length >= 6) && <Col><div className="text" style={{backgroundColor: "#192655", border: "2px solid grey", borderRadius: "5px", height: "36px",padding: "3px"}}><h4 style={{color: "white"}}>{props.record.price.substring(0,5) + "...₺"}</h4></div></Col>}
      {props.onProfile === true && <Col><Link to={`/edit/${props.record._id}`}><Button variant="secondary" style={{backgroundColor: "#192655"}}><div className="text">Edit</div></Button></Link></Col>}
      {props.onProfile === true && <Col><Button variant="danger" style={{backgroundColor: "#192655"}} onClick={() => {props.deleteRecord(props.record._id);}}><img width={23} height={23} src={deleteIcon}/></Button></Col>}
      </Row>
      </div>
    </Card.Body>
  </Card>
  </div>
  );
}

export default ItemCard;