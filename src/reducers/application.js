export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {
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
        appointments,
        days
      };

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}