import classes from './Card.module.css';

const Card = (props) => {
  return (
    <div className={classes.Card} style={props.style}>
      <div className={classes.content}>{props.children}</div>
      <img src={props.image} alt={props.image} />
    </div>
  );
};

export default Card;
