import React, { useContext, useRef, useState } from "react";
import {
  Power,
  ArrowLeftCircleFill,
  ClipboardPlus,
} from "react-bootstrap-icons";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import NavElement from "./NavElement";
import NavButton from "./NavButton";
import NavbarContext from "../../store/navbar-context";

import Modal from "../../components/ui/Modal";
import TextAreaForm from "../../components/ui/TextAreaForm";
import Button from '../../components/ui/Button'

import classes from "./Navbar.module.css";

const Navbar = () => {
  const navbarCtx = useContext(NavbarContext);
  const title = navbarCtx.title;
  const buttons = navbarCtx.buttons;
  const history = useHistory();
  const location = useLocation();
  const [modalIsVisible, setModalIsVisible] = useState(false)

  // Api req
  function handleLogout() {
    axios
      .delete("http://localhost:5000/api/auth/login", { withCredentials: true })
      .then(() => {
        // TODO err handl
        localStorage.clear();
        history.push("/login");
      });
  }

  // Handlers
  function onMouseEnterHandler(e) {
    const elements = e.target.children;
    for (const element of elements) {
      if (element.tagName === "H2") {
        const length = element.textContent.length;
        element.style.width = `${length * 0.6}rem`;
        return;
      }
    }
  }

  function onMouseLeaveHandler(e) {
    const elements = e.target.children;
    for (const element of elements) {
      if (element.tagName === "H2") {
        element.style.width = "0";
        return;
      }
    }
  }

  // Buttons
  function logoutButton() {
    if (buttons.logoutButton) {
      return (
        <NavButton
          onClick={handleLogout}
          onMouseEnter={(e) => {
            onMouseEnterHandler(e);
          }}
          onMouseLeave={(e) => {
            onMouseLeaveHandler(e);
          }}
        >
          <Power style={{ color: "#fff", fontSize: "1.5rem" }} />
          <h2>Log out</h2>
        </NavButton>
      );
    }
  }

  function backButton() {
    if (buttons.backButton) {
      return (
        <NavButton
          onClick={() => history.goBack()}
          onMouseEnter={(e) => {
            onMouseEnterHandler(e);
          }}
          onMouseLeave={(e) => {
            onMouseLeaveHandler(e);
          }}
        >
          <ArrowLeftCircleFill style={{ color: "#fff", fontSize: "1.5rem" }} />
          <h2>Back</h2>
        </NavButton>
      );
    }
  }

  function createTaskButton(userId) {
    if (buttons.createTaskButton) {
      return (
        <NavButton
          onMouseEnter={(e) => {
            onMouseEnterHandler(e);
          }}
          onMouseLeave={(e) => {
            onMouseLeaveHandler(e);
          }}
          onClick={() => setModalIsVisible(true)}
        >
          <ClipboardPlus style={{ color: "#fff", fontSize: "1.5rem" }} />
          <h2>New Task</h2>
        </NavButton>
      );
    }
  }

  function createNewTaskModal() {
    return <Modal isVisible={modalIsVisible} onClose={() => setModalIsVisible(false)}>
      <form onSubmit={(e) => e.preventDefault()}>
        <TextAreaForm labelText='New Task:' inputId='taskTextArea'/>
        <Button isLong={true} text='Create' />
        <Button onClick={() => setModalIsVisible(false)} text='Cancel' />
      </form>
    </Modal>
  }

  // Component
  if (location.pathname === "/login") {
    return (
      <div className={classes["nav-bar"]}>
        <NavElement>
          <h2 style={{ padding: "0.5rem" }}>{"text"}</h2>
        </NavElement>
      </div>
    );
  }

  return (
    <div className={classes["nav-bar"]}>
      <NavElement>{backButton()}</NavElement>
      <NavElement>
        <h2>{title}</h2>
      </NavElement>
      <NavElement>
        {createTaskButton()}
        {logoutButton()}
      </NavElement>
      {createNewTaskModal()}
    </div>
  );
};

export default Navbar;
