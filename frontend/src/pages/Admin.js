import { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import Dashboard from "../components/ui/Dashboard";
import NavbarContext from "../store/navbar-context";
import ModalContext from "../store/modal-context";
import requestAdminData from "../api/requestAdminData";

const Admin = () => {
  const navbarCtx = useContext(NavbarContext);
  const [data, setData] = useState(null);
  const { isOpen } = useContext(ModalContext);
  const history = useHistory();

  useEffect(() => {
    navbarCtx.setTitle("All Users");
    navbarCtx.setButtons({ logoutButton: true, createNewUser: true, createNewRelationship: true });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      requestAdminData().then((data) => {
        setData(data);
      });
    }
  }, [isOpen]);

  function cellClickedHandler(cell) {
    const userRole = cell.secondaryText.split(" ");
    switch (userRole[userRole.length - 1]) {
      case "employee":
        history.push(`/employee/${cell.id}`);
        return;
      case "employer":
        history.push(`/employer/${cell.id}`);
      default:
        return;
    }
  }

  return <Dashboard data={data} action={cellClickedHandler} />;
};

export default Admin;
