import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import deleteIcon from "../img/bin.png";
import "../CSS/card.css"

function ItemCard(props) {
  const [backgroundType, setBackgroundType] = useState('');

  useEffect(() => {
    let type = props.record.type;
    let typeToBackground = {
      'Sale Item': 'sale-background',
      'Borrowal Item': 'borrowal-background',
      'Donation': 'donation-background',
      'Lost Item': 'lostFound-background',
      'Found Item': 'lostFound-background',
      'Other Item': 'other-background',
    };

    setBackgroundType(typeToBackground[type] || 'other-background');
  }, [props.record.type]);

  return (
  <div className="itemCard" style={{borderRadius: "5px"}}>
  <Card style={{ backgroundColor: "var(--primary-color)", width: '280px', height: "500px", border: "none", borderRadius: "10px"}}>
    <div className={['circleBackground', backgroundType].join(' ')}/>
    <Card.Img className="centered-and-cropped" variant="top" src={props.record.image} height={"220px"} width={"undefined"} style={{width: '100%',
    height: undefined,
    objectFit: 'contain', maxWidth: "280px", borderBottom: "none", borderTopRightRadius: "5px", borderTopLeftRadius: "5px", backgroundColor: "var(--text-color2)"}}/>
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
      <div className="textback">
      {props.record.type === "Sale Item" && <div>
        <div className="text-in-card">{props.record.typeSpecific.available === true ? "Available" : "Unavailable"}</div>
      </div>}
      {props.record.type === "Borrowal Item" && <div>
        <div className="text-in-card">{props.record.typeSpecific.available === true ? "Available" : "Unavailable"}</div>
      </div>}
      {(props.record.type === "Lost Item" || props.record.type === "Found Item") && <div>
        <div className="text-in-card">{props.record.typeSpecific.status === true ? "Found" : "Still Lost"}</div>
      </div>}
      {props.record.type === "Donation" && <div>
        <div className="text-in-card">{props.record.typeSpecific.organizationName}</div>
      </div>}
      </div>
        <div className="text textback" style={{fontWeight: "bold"}}>{props.record.type}</div>
    <Card.Body>
      <div>
      <Row>
      <Col><Link to={`/item/${props.record.realID}`}><Button variant="secondary" style={{backgroundColor: "var(--text-color3)"}}><div className="text">View</div></Button></Link></Col>
      {props.onProfile !== true && (props.record.type === "Sale Item" || props.record.type === "Borrowal Item") && (props.record.typeSpecific.price.toString().length < 6) && <Col><div className="text" style={{backgroundColor: "var(--text-color3)", border: "2px solid grey", borderRadius: "5px", height: "36px",padding: "3px"}}><h4 style={{color: "var(--text-color)"}}>{props.record.typeSpecific.price + "₺"}</h4></div></Col>}
      {props.onProfile !== true && (props.record.type === "Sale Item" || props.record.type === "Borrowal Item") && (props.record.typeSpecific.price.toString().length >= 6) && <Col><div className="text" style={{backgroundColor: "var(--text-color3)", border: "2px solid grey", borderRadius: "5px", height: "36px",padding: "3px"}}><h4 style={{color: "var(--text-color)"}}>{props.record.typeSpecific.price.substring(0,5) + "...₺"}</h4></div></Col>}
      {props.onProfile === true && <Col><Link to={`/edit/${props.record.realID}`}><Button variant="secondary" style={{backgroundColor: "var(--text-color3)"}}><div className="text">Edit</div></Button></Link></Col>}
      {props.onProfile === true && <Col><Button variant="danger" style={{backgroundColor: "var(--text-color3)"}} onClick={() => {props.deleteRecord(props.record.realID);}}><img width={23} height={23} src={deleteIcon}/></Button></Col>}
      </Row>
      </div>
    </Card.Body>
  </Card>
  </div>
  );
}

export default ItemCard;