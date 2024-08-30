import "./App.css";
import InvoiceFrom from "./components/InvoiceFrom";
import Container from "react-bootstrap/Container";

function App() {
  return (
    <div className="App d-flex flex-column align-items-center justify-content-center w-100">
      <Container>
        <InvoiceFrom />
      </Container>
    </div>
  );
}

export default App;
