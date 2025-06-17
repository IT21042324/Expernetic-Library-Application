import { CustomProvider } from "rsuite";
import "./App.css";
import Home from "./page/Home/Home";
import BookContextProvider from "./context/BookContext";

function App() {
  return (
    <CustomProvider theme="dark">
      <BookContextProvider>
        <Home />
      </BookContextProvider>
    </CustomProvider>
  );
}

export default App;
