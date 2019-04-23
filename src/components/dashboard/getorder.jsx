import React, { Component } from "react";
import { Row, Col, Table, ListGroup, ListGroupItem, Label } from "reactstrap";

class GetOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: [],
      selected: 0
    };
  }

  async componentDidMount() {
    const data = await fetch("http://localhost:8090/pos/api/orders");
    const json = await data.json();
    this.setState({ orderData: json });
  }
  
  async componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      const data = await fetch("http://localhost:8090/pos/api/orders");
      const json = await data.json();
      this.setState({ orderData: json });
    }
  }

  selectedIndex = index => {
    this.setState({ selected: index });
  };
  render() {
    const { orderData, selected } = this.state;
    return (
      <div>
        <Row>
          <Col md={4}>
            <ListGroup>
              {orderData.map((item, index) => {
                return (
                  <div onClick={() => this.selectedIndex(index)}>
                    <ListGroupItem
                      className={selected === index ? "active" : ""}
                      tag="a"
                      href="#"
                      action
                    >
                      Id: {item.id} {" "} Amount : {item.amount}
                    </ListGroupItem>
                  </div>
                );
              })}
            </ListGroup>
          </Col>
          <Col md={8}>
            {orderData.length > 0 ? (
              <div>
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData[selected].items.map((item, index) => {
                      return (
                        
                          <tr>
                          <th>{item.name}</th>
                          <th>{item.description}</th>
                          <th>{item.price}</th>
                        </tr>
                      );
                    })}
                    <tr>
                    <th> <Label for="Sum">Total Amount </Label></th>
                    <th> </th>
                    <th>{orderData[selected].amount} {} </th>
                    </tr>  
                  </tbody>
                </Table>
              </div>
            ) : null}
          </Col>
        </Row>
      </div>
    );
  }
}

export default GetOrder;
