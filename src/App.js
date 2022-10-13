import React from "react";
import axios from "axios";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { ToastContainer, toast } from "react-toastify";
import useDynamicRefs from "./utils/dynamic-refs";
import DeleteIcon from "./assets/delete.png";
import AddIcon from "./assets/add.png";
import Loading from "./assets/loading.gif";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [getRef, setRef] = useDynamicRefs();
  const [allDataLoading, setAllDataLoading] = React.useState(true);
  const [cardsData, setCardsData] = React.useState([]);
  const [newDataLoading, setNewDataLoading] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState("");

  const notify = (message, notifyType) => {
    toast(message, {
      type: notifyType,
      position: toast.POSITION.TOP_RIGHT,
      progress: undefined,
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      draggablePercent: 30,
      bodyClassName: "toast-msg",
    });
  };

  const getAllData = async () => {
    try {
      const { data } = await axios.get(
        "https://6346ea2f04a6d457579c39e6.mockapi.io/cards"
      );
      setCardsData(data);
      setAllDataLoading(false);
    } catch (error) {
      setAllDataLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          const { message } = error.response.data;
          notify(message, "error");
        } else {
          notify(error.message, "error");
        }
      } else {
        notify("Unknown Error", "error");
      }
    }
  };

  React.useEffect(() => {
    getAllData();
  }, [getAllData]);

  const handleAdd = async () => {
    try {
      setNewDataLoading(true);
      const { data } = await axios.post(
        "https://6346ea2f04a6d457579c39e6.mockapi.io/cards"
      );
      setCardsData([data, ...cardsData]);
      setNewDataLoading(false);
      notify("Added!", "success");
    } catch (error) {
      setNewDataLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          const { message } = error.response.data;
          notify(message || error.response.data, "error");
        } else {
          notify(error.message, "error");
        }
      } else {
        notify("Unknown Error", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    try {
      await axios.delete(
        `https://6346ea2f04a6d457579c39e6.mockapi.io/cards/${id}`
      );
      notify("Deleted!", "success");
      setCardsData((prev) => prev.filter((item) => item.id !== id));
      setDeleteId("");
    } catch (error) {
      console.log(error);
      setDeleteId("");
      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          const { message } = error.response.data;
          notify(message || error.response.data, "error");
        } else {
          notify(error.message, "error");
        }
      } else {
        notify("Unknown Error", "error");
      }
    }
  };

  return (
    <div className="App">
      <ToastContainer theme="dark" />
      <div className="add-btn-container">
        <button
          disabled={newDataLoading}
          onClick={handleAdd}
          className="add-btn"
        >
          {newDataLoading ? (
            <img width={18} height={18} src={Loading} alt="Adding" />
          ) : (
            <>
              Add New
              <img width={18} height={18} src={AddIcon} alt="Add" />
            </>
          )}
        </button>
      </div>
      <div className="view-wrapper">
        {allDataLoading ? (
          <div style={{ textAlign: "center" }}>Loading...</div>
        ) : (
          <TransitionGroup className="card-container">
            {cardsData.length ? (
              cardsData.map((item) => (
                <CSSTransition
                  timeout={500}
                  classNames="card-item"
                  ref={setRef(item.id)}
                  key={item.id}
                >
                  <div ref={getRef(item.id)} className="card">
                    <button
                      disabled={deleteId === item.id}
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      <img
                        width={18}
                        height={18}
                        src={deleteId === item.id ? Loading : DeleteIcon}
                        alt="Delete"
                      />
                    </button>
                    <h3 className="title">{item.title}</h3>
                    <p className="description">{item.description}</p>
                  </div>
                </CSSTransition>
              ))
            ) : (
              <div style={{ textAlign: "center" }}>No data found</div>
            )}
          </TransitionGroup>
        )}
      </div>
    </div>
  );
}

export default App;
