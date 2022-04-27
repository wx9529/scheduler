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
        return { ...state, day: action.value }
      case SET_APPLICATION_DATA:
        return { ...state, days: action.value.days, appointments: action.value.appointments, interviewers: action.value.interviewers }
      case SET_INTERVIEW:
        return { ...state, appointments: action.value.appointments, days: action.value.days }
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
        type: SET_APPLICATION_DATA, value: {
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        }
      })
    });
  }, []);

  const setDay = (day) => dispatch({ type: SET_DAY, value: day });

  //helper function for updating spot
  function updateSpots(id, addspot) {
    const dayOfWeek = state.days.findIndex(item => item.name === state.day)
    let day = {
      ...state.days[dayOfWeek]
    }
    if (!addspot) {
      if (!state.appointments[id].interview) {
        //we're adding an appointment, so spots - 1 
        day = {
          ...state.days[dayOfWeek],
          spots: state.days[dayOfWeek].spots - 1
        }
      }
      //we're updating appointment, spots remain unchange
    } else {
      //we're removing appointments, spots + 1 
      day = {
        ...state.days[dayOfWeek],
        spots: state.days[dayOfWeek].spots + 1
      }
    }
    const days = [...state.days];
    days[dayOfWeek] = day;
    return days;
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpots(id, false)

    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({
          type: SET_INTERVIEW, value: {
            appointments,
            days
          }
        })
      })
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const days = updateSpots(id, true)
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => {
        dispatch({
          type: SET_INTERVIEW, value: {
            appointments,
            days
          }
        })
      })
  }
  return { state, setDay, bookInterview, cancelInterview };
}
