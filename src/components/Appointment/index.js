import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE"

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition("SAVING");
    props.bookInterview(props.id, interview)
      .then(() => { transition("SHOW") })
      .catch(error => transition(ERROR_SAVE, true));
  }
  function destroy() {
    transition("DELETING");
    props.cancelInterview(props.id)
      .then(() => { transition("EMPTY") })
      .catch(error => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && (
        <Empty
          onAdd={() => {
            transition("CREATE");
          }}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message="Could not save appointment."
          onClose={back}
        />

      )}
      {mode === ERROR_DELETE && (
        <Error message="Could not cancel appointment."
          onClose={back}
        />
      )}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => {
            transition("CONFIRM")
          }}
          onEdit={() => {
            transition("EDIT");
          }}
        />
      )}
      {mode === CONFIRM && (
        <Confirm onConfirm={destroy} onCancel={back} />
      )}

      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save} />
      )}
      {mode === SAVING && (
        <Status message="Saving" />
      )}
      {mode === DELETING && (
        <Status message="Deleting" />
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save} />
      )}

    </article>
  );
}
