import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING"
  const CONFIRM = "CONFIRM"
  const DELETING = "DELETING"
  const EDIT = "EDIT"

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition("SAVING");
    props.bookInterview(props.id, interview).then(() => { transition("SHOW") });
  }
  function confirm() {
    transition("DELETING");
    props.cancelInterview(props.id).then(() => { transition("EMPTY") });
  }

  return (
    <article className="appointment">
      {mode === EMPTY && (
        <Empty
          onAdd={() => {
            transition("CREATE");
          }}
        />
      )}
      <Header time={props.time} />

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
        <Confirm onConfirm={confirm} onCancel={back} />
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
