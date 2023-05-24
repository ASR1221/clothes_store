import "./button.css"

// eslint-disable-next-line react/prop-types
function Button({text, fn}) {
   return (  
      <button className="btn" onClick={fn}>
         {text}
      </button>
   );
}

export default Button;