import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

axios.defaults.baseURL = "https://interview-scheduler95.herokuapp.com";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        value: {
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        },
      });
    });

    const connection = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    connection.onmessage = function (e) {
      const obj = JSON.parse(e.data);
      if (obj.type === SET_INTERVIEW) {
        dispatch({
          type: SET_INTERVIEW,
          value: {
            id: obj.id,
            interview: obj.interview,
          },
        });
      }
    };
  }, []);

  const setDay = (day) => dispatch({ type: SET_DAY, value: day });

  function bookInterview(id, interview) {
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({
          type: SET_INTERVIEW,
          value: {
            id,
            interview,
          },
        });
      });
  }

  function cancelInterview(id) {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({
          type: SET_INTERVIEW,
          value: {
            id,
            interview: null,
          },
        });
      });
  }
  return { state, setDay, bookInterview, cancelInterview };
}
