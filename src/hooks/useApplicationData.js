import { useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.value };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.value.days,
          appointments: action.value.appointments,
          interviewers: action.value.interviewers,
        };
      case SET_INTERVIEW:
        const appointment = {
          ...state.appointments[action.value.id],
        };

        if (!action.value.interview) {
          appointment.interview = null;
        } else {
          appointment.interview = { ...action.value.interview };
        }

        const appointments = {
          ...state.appointments,
          [action.value.id]: { ...appointment },
        };

        const days = state.days.map((day) => {
          day.spots = day.appointments.reduce((total, appointmentId) => {
            const appointment = appointments[appointmentId];
            if (!appointment.interview) {
              total += 1;
            }
            return total;
          }, 0);
          return { ...day };
        });

        return {
          ...state,
          appointments: appointments,
          days: days,
        };

      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers"),
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
      .put(`http://localhost:8001/api/appointments/${id}`, { interview })
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
      .delete(`http://localhost:8001/api/appointments/${id}`)
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
