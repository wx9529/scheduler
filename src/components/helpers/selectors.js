function selectUserByName(state, name) {
  const filteredNames = state.users.filter((user) => user.name === name);
  return filteredNames;
}

export function getAppointmentsForDay(state, day) {
  const foundDay = state.days.find((item) => item.name === day);
  if (!foundDay) {
    return [];
  }
  return foundDay.appointments.map((id) => state.appointments[id]);
}
