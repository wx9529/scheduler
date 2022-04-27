export function getAppointmentsForDay(state, day) {
  const foundDay = state.days.find((item) => item.name === day);
  if (!foundDay) {
    return [];
  }
  return foundDay.appointments.map((id) => state.appointments[id]);
}

export function getInterviewersForDay(state, day) {
  const foundDay = state.days.find((item) => item.name === day);
  if (!foundDay) {
    return [];
  }
  return foundDay.interviewers.map((id) => state.interviewers[id]);
}

export function getInterview(state, interview) {
  if (interview) {
    const result = { ...interview };
    result.interviewer = state.interviewers[interview.interviewer];
    return result;
  }
  return null;
}
