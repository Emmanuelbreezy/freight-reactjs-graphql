import React,{useState,useEffect,useContext} from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../hoc/Layout';
import ShipFreight from '../../assets/images/ship-64.png'; 
import AirFreight from '../../assets/images/airplane-64.png'; 
import TruckFreight from '../../assets/images/truck-64.png'; 
import AuthContext from '../../context/auth-context';
import Loader from '../../components/Loader/Loader';
import Table from '../../components/Table/Table';
import fetchApi from '../../utils/fetch';

interface DashboardProps{}
//S514367

interface FindShipmentType{
    id:string;
    name: string;
    mode:string;
    destination: string;
    origin: string;
    total: string;
    status: string;
}

interface ShipmentType{
    id:string;
    name: string;
    mode:string;
    status: string;
}

export default function Dashboard(props:DashboardProps) {
    const [error, setError] = useState<String>('');
    const [loading, setLoading] = useState<Boolean>(false);
    const [findLoading, setFindLoading] = useState<Boolean>(false);
    const [findValue, setFindValue] = useState<string>('');
    const [findshipmentData, setFindShipmentData] = useState<FindShipmentType | null>(null);
    const [shipmentData, setShipmentData] = useState<[ShipmentType] | [{}]>([{}]);

    const context = useContext(AuthContext);


    useEffect(() => {
        setLoading(true);
        setError('');
        if(!context.isAuthenticated){
            return;
          }
            const page = 1;
            const limit = 5;
            const graphqlQuery = {

                query:`
                {
                    shipments(page:${page},perPage:${limit}) {
                        shipments{
                            id
                            name
                            mode
                            status
                        }
                    }
                }
                `
            }
            // fetchApi takes in the query and token
            fetchApi(graphqlQuery,context.token)
            .then((resData) => {
                  if(resData.errors && resData.errors[0].status === 422){
                    setError(
                        "Validation failed"
                    );
                    setLoading(false);
                    return null;
                    }
                    if(resData.errors){
                    setError('Shipment failed to load');
                    setLoading(false);
                    return null;
                    }
                    if(resData.data.shipments.shipments){
                        setTimeout(() => {
                            setShipmentData(resData.data.shipments.shipments);
                            setLoading(false);
                        },1000);
                    }
            });
        
    }, [context,setLoading,setError])

    const handleFindChange = (e:any) => setFindValue(e.target.value); 
    const handleFind = () => {
            if(!context.isAuthenticated){
                return null;
              }
            if(findValue){
                setFindLoading(true);
                setFindShipmentData(null);
                setError('');
                const graphqlQuery = {
                    query:`
                    {
                        shipment(id: "${findValue}"){
                                id
                                name
                                mode
                                destination
                                origin
                                status
                                total
                        }
                    }
                    `
                }
                fetchApi(graphqlQuery,context.token)
                .then((resData) => {
                    if(resData.errors && resData.errors[0].status === 422){
                    setError(
                        "Validation failed"
                    );
                    setFindLoading(false);
                    return null;
                    }
                    if(resData.errors){
                        setError('Shipment failed to load');
                        setFindLoading(false);
                        return null;
                    }
                    if(resData.data.shipment){
                        setTimeout(() => {
                            setFindShipmentData(resData.data.shipment)
                            setFindLoading(false);
                        },1000);
                    }
                }); 
            }
    }


    return (
        <Layout showNavTab={true}>
            <div className="app--home">
            
            {error && (<div className="alert alert-danger">{error}</div>)}
           {loading  ? (<Loader size="lg" />) : (<div className="row">
                <div className="col-12 col-lg-8">
                    <div className="top--section">
                        <div className="d-flex align-items-start justify-content-between">
                            <h4 className="mb-4 display-4">Quick access</h4>
                            <Link to="/create" className="btn create-action d-flex align-items-center">
                                <svg style={{width:"22px",height:"22px"}} version="1.1" id="Plus" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                    viewBox="0 0 20 20" enable-background="new 0 0 20 20">
                                   <path d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                    C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                    C15.952,9,16,9.447,16,10z"/>
                                </svg>
                                <span>Create Shipment</span>
                            </Link>
                        </div>
                        <div className="list--cards">
                            <div className="row">
                                <div className="col-12 col-lg-4 col_">
                                    <Link to="/create?mode=sea" className="card">
                                        <div className="card-body">
                                            <div className="img-container">
                                                <img src={ShipFreight}  alt="" />
                                            </div>
                                            <div className="card-title">
                                                <h5 className="display--subhead">Ship freight</h5>
                                                <span className="display-span">Reliable</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-12 col-lg-4 col_">
                                    <Link to="/create?mode=land" className="card">
                                        <div className="card-body">
                                            <div className="img-container">
                                                <img src={TruckFreight}  alt="" />
                                            </div>
                                            
                                            <div className="card-title">
                                                <h5 className="display--subhead">Truck freight</h5>
                                                <span className="display-span">Reliable</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div  className="col-12 col-lg-4 col_">
                                        <Link to="/create?mode=air" className="card">
                                            <div className="card-body">
                                                <div className="img-container">
                                                   <img src={AirFreight}  alt="" />
                                                 </div>
                                                <div className="card-title">
                                                    <h5 className="display--subhead">Plane freight</h5>
                                                    <span className="display-span">Reliable</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div className="bottom--section mt-2">
                        
                        {shipmentData.length > 0 ?
                           ( 
                           
                               <>
                       
                        <div className="d-flex align-items-center justify-content-between ">
                            <h4 className="display-4">Shipment history</h4>
                            <Link to="/dashboard/allshipment/" className="action--button  d-flex align-items-center">
                                <span className="display-span">See all</span>
                                <svg style={{width:"18px",height:"18px"}} className="ms-1" version="1.1" id="Chevron_thin_right" xmlns="http://www.w3.org/2000/svg"  x="0px"
                                    y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20">
                                   <path d="M13.25,10L6.109,2.58c-0.268-0.27-0.268-0.707,0-0.979c0.268-0.27,0.701-0.27,0.969,0l7.83,7.908
                                    c0.268,0.271,0.268,0.709,0,0.979l-7.83,7.908c-0.268,0.271-0.701,0.27-0.969,0c-0.268-0.269-0.268-0.707,0-0.979L13.25,10z"/>
                                </svg>
                            </Link>
                        </div>
                        <div className="shipment-history-table">
                            {/* Table components from utils */}
                          <Table shipments={shipmentData} />
                          <br/>
                          <br/>
                        </div>
                        </>)
                        
                        : (<div className="text-center mt-4">
                               <span>No Shipment</span> 
                         </div>)}
                    </div>

                  

                </div>
                <div className="col-12 col-lg-4">
                   <h4 className="mb-4 display-4">Tracking your shipment</h4>
                   <div className="app-rig--wrapper">
                       <div className="card">
                           <div className="card-body">
                               <div className="shipment--inp">
                                    <div className="input-gp mb-3">
                                            <input value={findValue} type="text" className="form-control" placeholder="Search by shipment ID" aria-label="" aria-describedby="basic-addon2" 
                                            onChange={handleFindChange}/>
                                            <button className={`btn btn-primary ${findLoading && "disabled" }`} onClick={handleFind}>
                                            {findLoading && (<span className="spinner-border me-2 spinner-border-sm" role="status" aria-hidden="true"></span>)}
                                              Find
                                            </button>

                                            </div>
                                    </div>
                                
                                

                                {findshipmentData ? (<div className="shipment--display">
                                    <div className="shipment--map">
                                        map cant display
                                    </div>

                                    <div className="_shiping-details">
                                       <div className="shipping--location">
                                           <span className="loc-place">{findshipmentData.origin} to {findshipmentData.destination}</span>
                                           <h5>{findshipmentData.id}</h5>
                                       </div>
                                       <p className="shipping--desc">
                                         {findshipmentData.name}
                                       </p>
                                        <div className="shipping--lis-div">
                                            <ul className="lis_ul">
                                                <li>
                                                    <span>Mode</span>
                                                    <h5>{findshipmentData.mode}</h5>
                                                </li>
                                                <li className="lis-divider" />
                                                <li>
                                                    <span>Status</span>
                                                    <h5>{findshipmentData.status}</h5>
                                                </li>
                                            </ul>
                                        </div>
                                    <div className="view-shipment-action">
                                        <Link to={`/shipment/${findshipmentData.id}`} className="btn"> See more</Link>
                                    </div>
                                    </div>

                                </div>): null}
                           </div>
                       </div>
                   </div>
                </div>
            </div>)
            }
            
            </div>
            <br />
            <br />
        </Layout>
    )
}
