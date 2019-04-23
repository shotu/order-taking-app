import React, { Component, Fragment } from "react";
import {
  Table,
  Row,
  Col,
  Button,
  Input,
  Navbar,
  NavbarBrand,
  Collapse,
  Label
} from "reactstrap";
import GetOrder from "./getorder";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      search: "",
      notes: "",
      addedItem: [],
      total_sum: 0,
      check: false,
      collapse: false
    };
    this.callData = this.callData.bind(this);
  }

  async componentDidMount() {
    const data = await fetch(
      "http://localhost:8090/pos/api/items/suggest_items?search_name="
    );
    const json = await data.json();
    this.setState({ data: json });
  }

  handleChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value }, () => {
      this.callData();
    });
  };
  handleNotes = evt => {
    this.setState({ [evt.target.name]: evt.target.value });
  };

  async callData() {
    const { search } = this.state;
    const data = await fetch(
      `http://localhost:8090/pos/api/items/suggest_items?search_name=${search}`
    );
    const json = await data.json();
    this.setState({ data: json });
  }
  toggle = () => {
    this.setState(state => ({ collapse: !state.collapse }));
  };

  addData = item => {
    var sum = 0;
    const { addedItem } = this.state;
    addedItem.push(item);
    addedItem.map((item, index) => {
      sum = sum + item.price;
    });
    this.setState({ addedItem, total_sum: sum });
  };
  removeData = index => {
    var sum = 0;
    const { addedItem } = this.state;
    addedItem.splice(index, 1);
    addedItem.map((item, index) => {
      sum = sum + item.price;
    });
    this.setState({ addedItem, total_sum: sum });
  };

  saveOrder = () => {
    fetch("http://localhost:8090/pos/api/orders", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },

      //make sure to serialize your JSON body
      body: JSON.stringify({
        amount: this.state.total_sum,
        price_currency: "INR",
        items: this.state.addedItem,
        notes: this.state.notes
      })
    }).then(response => {
      alert("Order Taken Successfully");
      this.setState({ check: !this.state.check, addedItem: [] });
    });
  };

  render() {
    const { data, addedItem, total_sum } = this.state;
    return (
      <div>
        <div>
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/">Atri's Cafe</NavbarBrand>
          </Navbar>
          <Row style={{ padding: "30px" }}>
            <Col md="6">
              <Input
                type="text"
                onChange={this.handleChange}
                name="search"
                placeholder="Search Items here..."
                style={{ marginBottom: "10px" }}
              />
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => {
                    return (
                      <tr>
                        <th>{item.name}</th>
                        <th>{item.description}</th>
                        <th>{item.price}</th>
                        <th>
                          <Button
                            outline
                            color="primary"
                            onClick={() => this.addData(item)}
                          >
                            ADD ITEM
                          </Button>{" "}
                        </th>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              {addedItem.length > 0 ? (
                <Table dark bordered>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {addedItem.map((item, index) => {
                      return (
                        <tr>
                          <th>{item.name}</th>
                          <th>{item.description}</th>
                          <th>{item.price}</th>
                          <th>
                            <Button
                              color="danger"
                              outline
                              onClick={() => this.removeData(index)}
                            >
                              Delete Item
                            </Button>{" "}
                          </th>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <div>ADD ITEMS FROM THE LIST</div>
              )}

              <hr />
              {addedItem.length > 0 && (
                <div>
                  <Label for="Sum">Total Amount</Label>:INR {total_sum}
                  <br />
                  Extra Notes:
                  <Input
                    type="textarea"
                    name="notes"
                    placeholder="Any Extra Notes"
                    onChange={this.handleNotes}
                    style={{ marginBottom: "10px" }}
                  />
                  <Button outline color="success" onClick={this.saveOrder}>
                    SAVE ORDER
                  </Button>{" "}
                </div>
              )}
            </Col>
          </Row>
        </div>
        <hr />
        <div style={{ padding: "40px" }}>
          <Button color="primary" size="lg" block onClick={this.toggle} style={{marginBottom:'20px'}}>
            Show Order History
          </Button>
          <Collapse isOpen={this.state.collapse}>
            <GetOrder check={this.state.check} />
          </Collapse>
        </div>
      </div>
    );
  }
}
export default Dashboard;
