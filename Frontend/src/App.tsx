import { CustomProvider } from "rsuite";
import "./App.css";
import Home from "./page/Home/Home";
import BookContextProvider from "./context/BookContext";

function App() {
  return (
    <BookContextProvider>
      <CustomProvider theme="dark">
        <Home />
      </CustomProvider>
    </BookContextProvider>
  );
}

export default App;
