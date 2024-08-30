import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

const InvoiceModal = (props) => {
  const {
    showModal,
    closeModal,
    info,
    currency,
    total,
    items,
    subTotal,
    taxAmount,
    discountAmount,
  } = props;

  const createInvoice = async () => {
    const invoiceData = {
      logo: 'https://www.freepnglogos.com/uploads/company-logo-png/company-logo-transparent-png-19.png',
      from: `${info.billFrom}\n${info.billFromAddress}\n${
        info.billFromEmail 
      }\n${info.gstReg}\n${info.panNo}`,
      to: `${info.billTo }\n${info.billToAddress}\n${
        info.billToEmail 
      }`,
      ship_to: `${info.shipTo}\n${info.shipToAddress}\n${info.shipToEmail}`,
      number: info.invoiceNumber,
      date: info.dateOfIssue || new Date().toISOString().split("T")[0],
      payment_terms: "NET 30",
      due_date: info.currentDate,
      items: items.map((item) => ({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unit_cost: item.price,
      })),
      fields: { tax: "%", discounts: false, shipping: false },
      discounts: discountAmount,
      tax: taxAmount,
      shipping: 0,
      amount_paid: 0,
      notes: info.notes,
      terms: "Terms and conditions go will here...",
    };

    try {
      const response = await axios.post(
        "https://invoice-generator-qys7.onrender.com/api/create-invoice",
        invoiceData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  return (
    <Modal show={showModal} onHide={closeModal} size="lg" centered>
      <div id="invoiceCapture">
        <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
          <div className="w-100">
            <h4 className="fw-bold my-2">
              {info.billFrom || "John Uberbacher"}
            </h4>
            <h6 className="fw-bold text-secondary mb-1">
              Invoice #: {info.invoiceNumber || ""}
            </h6>
          </div>
          <div className="text-end ms-4">
            <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
            <h5 className="fw-bold text-secondary">
              {" "}
              {currency} {total}
            </h5>
          </div>
        </div>
        <div className="p-4">
          <Row className="mb-4">
            <Col md={4}>
              <div className="fw-bold">Billing Address:</div>
              <div>{info.billTo || ""}</div>
              <div>{info.billToAddress || ""}</div>
              <div>{info.billToEmail || ""}</div>
            </Col>
            <Col md={4}>
              <div className="fw-bold">Sold By:</div>
              <div>{info.billFrom || ""}</div>
              <div>{info.billFromAddress || ""}</div>
              <div>{info.billFromEmail || ""}</div>
            </Col>
            <Col md={4}>
              <div className="fw-bold mt-2">Date Of Issue:</div>
              <div>{info.dateOfIssue || ""}</div>
            </Col>
          </Row>
          <Table className="mb-0">
            <thead>
              <tr>
                <th>QTY</th>
                <th>DESCRIPTION</th>
                <th className="text-end">PRICE</th>
                <th className="text-end">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr id={i} key={i}>
                  <td style={{ width: "70px" }}>{item.quantity}</td>
                  <td>
                    {item.name} - {item.description}
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {currency} {item.price}
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {currency} {item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Table>
            <tbody>
              <tr>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr className="text-end">
                <td></td>
                <td className="fw-bold" style={{ width: "100px" }}>
                  SUBTOTAL
                </td>
                <td className="text-end" style={{ width: "100px" }}>
                  {currency} {subTotal}
                </td>
              </tr>
              {taxAmount !== 0.0 && (
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "100px" }}>
                    TAX
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {currency} {taxAmount}
                  </td>
                </tr>
              )}
              {discountAmount !== 0.0 && (
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "100px" }}>
                    DISCOUNT
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {currency} {discountAmount}
                  </td>
                </tr>
              )}
              <tr className="text-end">
                <td></td>
                <td className="fw-bold" style={{ width: "100px" }}>
                  TOTAL
                </td>
                <td className="text-end" style={{ width: "100px" }}>
                  {currency} {total}
                </td>
              </tr>
            </tbody>
          </Table>
          {info.notes && (
            <div className="bg-light py-3 px-4 rounded">{info.notes}</div>
          )}
        </div>
      </div>
      <div className="pb-4 px-4">
        <Row>
          <Col md={6}>
            <Button
              variant="primary"
              className="d-block w-100"
              onClick={createInvoice}
            >
              Send Invoice
            </Button>
          </Col>
          <Col md={6}>
            <Button
              variant="outline-primary"
              className="d-block w-100 mt-3 mt-md-0"
              onClick={createInvoice}
            >
              Download Copy
            </Button>
          </Col>
        </Row>
      </div>
      <hr className="mt-4 mb-3" />
    </Modal>
  );
};

export default InvoiceModal;
