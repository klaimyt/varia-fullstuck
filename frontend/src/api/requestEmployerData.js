import axios from "axios";
import config from "../config.json";

export default async function requestEmployeeData(employerId) {
  return await axios.get(
    `${config.API_URL}employer/${employerId}`,
    {
      withCredentials: true,
    }
  ).then(res => {
    const employees = res.data.map(rel => {
      return {
        text: rel.employeeId.name,
        secondaryText: "Tasks: " + rel.tasks.length,
        id: rel.employeeId._id,
      }
    }); 

    return employees
  })
}