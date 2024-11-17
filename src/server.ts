import app from "./app";
import { startSoapServer } from "./soap/soapServer";

const PORT = process.env.PORT || 8000;
const SOAP_PORT = process.env.SOAP_PORT || 8001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startSoapServer(Number(SOAP_PORT));
