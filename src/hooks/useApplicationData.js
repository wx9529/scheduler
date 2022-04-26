import { useState, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay, getSpotsForDay } from "components/helpers/selectors";
export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  const setDay = (day) => setState({ ...state, day });

  function updateSpots(addspot) {
    const dayOfWeek = state.days.findIndex(item => item.name === state.day)
    console.log('state', state);

    const day = {
      ...state.days[dayOfWeek],
      spots: state.days[dayOfWeek].spots + (addspot ? 1 : -1)
    }

    const days = [...state.days];
    days[dayOfWeek] = { ...day };
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

    const days = updateSpots(false)

    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => {
        setState((prev) => ({
          ...prev,
          appointments,
          days
        }));
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
    const days = updateSpots(true)
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => {
        setState((prev) => ({
          ...prev,
          appointments,
          days
        }));
      })
  }
  return { state, setDay, bookInterview, cancelInterview };
}
