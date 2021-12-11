import React from 'react';
import {Link,useLocation} from "react-router-dom";





export default function NavTab() {
    const location = useLocation();
    
    return (
       <div className="nav--tab_">
           <div className="container">
                <ul className="nav nav-pills">
                    <li className={`nav-item ${location.pathname === "/dashboard" && "nav-active"}`}>
                        <Link className="nav-link" aria-current="page" to="/dashboard">
                            Overview
                        </Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/dashboard/allshipment/" && "nav-active"}`}>
                        <Link className="nav-link " to="/dashboard/allshipment/">All Shipment</Link>
                    </li>
                    {/* <li className="nav-item">
                        <a className="nav-link" href="#">Tracking</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Services</a>
                    </li> */}
                   
                    </ul>

           </div>
       </div>
    )
}
