import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (values.body.length > 0) callback();
    else alert("Please enter some message");
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};
