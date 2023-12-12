import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import deleteIcon from "../img/bin.png";
import "../CSS/card.css"
import "../CSS/general.css"

function ItemCard(props) {
  const [backgroundType, setBackgroundType] = useState('');

  useEffect(() => {
    let type = props.record.type;
    let typeToBackground = {
      'Sale Item': 'sale-background',
      'Borrowal Item': 'borrowal-background',
      'Donation Item': 'donation-background',
      'Found Item': 'lostFound-background',
      'Other Item': 'other-background',
    };

    setBackgroundType(typeToBackground[type] || 'other-background');
  }, [props.record.type]);
  return (
      <div className={`itemCard `} >
        <div className={`circleBackground ${backgroundType}`}></div>
        <Card>
          <Card.Img className="centered-and-cropped rounded-container img_c" variant="top" src={props.record.images[0]} height={"220px"} width={"auto"}/>
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
          {!props.record.availability.includes("Unavailable") && <Col><Link to={`/item/${props.record._id}`}><Button className="primary-accent" variant="secondary"><div className="text">View</div></Button></Link></Col>}
          {props.onProfile !== true && (props.record.type === "Sale Item" || props.record.type === "Borrowal Item") && (props.record.price.toString().length < 6) && <Col><div className="text primary-accent" style={{border: "2px solid grey", borderRadius: "5px", height: "36px",padding: "3px"}}><h4 style={{color: "white"}}>{props.record.price + "₺"}</h4></div></Col>}
          {props.onProfile !== true && (props.record.type === "Sale Item" || props.record.type === "Borrowal Item") && (props.record.price.toString().length >= 6) && <Col><div className="text primary-accent" style={{border: "2px solid grey", borderRadius: "5px", height: "36px",padding: "3px"}}><h4 style={{color: "white"}}>{props.record.price.substring(0,5) + "...₺"}</h4></div></Col>}
          {props.onProfile === true && <Col><Link to={`/edit/${props.record._id}`}><Button className="primary-accent" variant="secondary"><div className="text">Edit</div></Button></Link></Col>}
          {props.onProfile === true && <Col><Button className="primary-accent" variant="danger" onClick={() => {props.deleteRecord(props.record._id);}}><img width={23} height={23} src={deleteIcon}/></Button></Col>}
            </Row>
            </div>
            </Card.Body>
        </Card>
      </div>
  );
}

export default ItemCard;