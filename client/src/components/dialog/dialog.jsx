import { forwardRef } from "react";
import "./dialog.css";

const Dialog = forwardRef(({ text }, ref) => {
   return <div role="dialog" className="dialog transition-1" ref={ref}>
      <p>{text}</p>
   </div>
});

export default Dialog;