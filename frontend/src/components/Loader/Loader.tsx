import React from 'react';
import {Link,useLocation} from "react-router-dom";


interface LoaderProps{
    size: String;
}

export default function Loader(props:LoaderProps) {

    return (
        <div className="text-center mt-3">
           <span className={`spinner-border me-2 spinner-border-${props.size}`} role="status" aria-hidden="true"></span>
        </div>
    )
}


