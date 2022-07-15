import classes from './Input.module.css';

const Input = (props) => {
  let input;
  if (props.textarea) {
    input = (
      <textarea
        rows="6"
        defaultValue={props.defaultValue}
        value={props.value}
        name={props.name}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
    );
  } else if (props.select) {
    let options = props.select.map((option) => {
      return (
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </option>
      );
    });
    input = (
      <select
        value={props.value}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
      >
        <option value="">Select a {props.name}</option>
        {options}
      </select>
    );
  } else {
    input = (
      <input
        type={props.type}
        onChange={props.onChange}
        name={props.name}
        value={props.value}
        defaultValue={props.defaultValue}
        accept={props.accept}
        placeholder={props.placeholder}
        style={props.style}
      />
    );
  }
  return (
    <div className={classes.Input}>
      {!props.withoutLabel && (
        <label htmlFor={props.name}>
          {props.name.charAt(0).toUpperCase() + props.name.slice(1)}
        </label>
      )}
      {input}
    </div>
  );
};

export default Input;
