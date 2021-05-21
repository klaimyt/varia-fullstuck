import React from "react";
import Content from "../components/Content";
import Cell from "../components/Cell";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Button from "../components/ui/Button";

const Dashboard = () => {
  const apiUrl = "http://localhost:5000/api/";
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("id");
  const [data, setData] = useState([]);
  const history = useHistory();

  useEffect(requestData, []);

  function requestData() {
    switch (role) {
      case "admin":
        requestAdminData();
        break;
      case "employee":
        requestEmployeeData(userId);
        break;
      case "employer":
        requserEmployerData();
        break;
      default:
        throwUser();
      //TODO Handle error
    }
  }

  function throwUser() {
    localStorage.clear();
    history.push("/login");
  }

  function requestEmployeeData(id) {
    axios
      .get(`${apiUrl}employee/${id}`, { withCredentials: true })
      .then((res) => {
        const task = res.data.map((rel) => {
          return rel.tasks.map((task) => {
            return {
              text: task.text,
              state: task.state,
              date: task.updatedDate || task.creatingDate,
              id: task._id,
            };
          });
        });
        setData(task.flat());
      })
      .catch((err) => {
        // TODO: Alert error
        if (err.response.status === 401) {
          localStorage.clear();
          history.push("/login");
        }
      });
  }

  function requserEmployerData() {
    axios.get(`${apiUrl}employer/`, { withCredentials: true }).then((res) => {
      const employees = res.data.map((userData) => {
        return {
          text: userData.employeeId.name,
          secondaryText: userData.tasks.length,
          id: userData.employeeId._id,
        };
      });
      setData(employees);
    });
  }

  function requestAdminData() {}

  function cellAction(task) {
    switch (role) {
      case "admin":
        break;
      case "employee":
        break;
      case "employer":
        requestEmployeeData(task.id);
    }
  }

  function styleToState(state) {
    switch (state) {
      case "To do":
        return "#e74c3c";
      case "In progress":
        return "#f39c12";
      case "Done":
        return "##1abc9c";
      case "Finished":
        return "#2ecc71";
    }
  }

  if (data.length < 1) {
    return (
      <Content
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "30vh",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "3rem",
            color: "#2f2f2f",
            fontWeight: "300",
          }}
        >
          You have no tasks.
        </h1>
      </Content>
    );
  }

  return (
    <>
      <Content>
        <ul style={{ listStyle: "none", maxWidth: "70%", flexGrow: "1" }}>
          {data.map((task) => {
            return (
              <Cell onClick={() => cellAction(task)}>
                <h3 key={task.id + "text"}>{task.text}</h3>
                {task.state ? (
                  <Button
                    text={task.state}
                    style={{
                      backgroundColor: styleToState(task.state),
                      color: "white",
                    }}
                  />
                ) : (
                  <p key={task._id + "state"}>State: {task.secondaryText}</p>
                )}
              </Cell>
            );
          })}
        </ul>
        <div style={{ margin: "0 30px" }}>
          <div>
            <h3 style={{ margin: "20px 0 10px 0" }}>Sorted by:</h3>
            <ul style={{ paddingLeft: "40px" }}>
              <li>First name</li>
              <li>Second name</li>
            </ul>
          </div>
        </div>
      </Content>
    </>
  );
};

export default Dashboard;
