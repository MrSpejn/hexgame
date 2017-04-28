import "./main.scss";
/*eslint-disable no-unused-vars*/
import React from "react";
/*eslint-enable no-unused-vars*/
import ReactDOM from "react-dom";

import MainComponent from "./javascript/components/main.component.js";



const mountPoint = document.querySelector(".mount-point");

ReactDOM.render(<MainComponent />, mountPoint);
