import React,{useState,useEffect,useContext} from 'react';
import { useNavigate,Link,useParams } from 'react-router-dom';
import Layout from '../../hoc/Layout';
import AuthContext from '../../context/auth-context';
import fetchApi from '../../utils/fetch';



interface DetailProps{}

interface Cargo {
    type:String;
    description:String;
    volume:String;
}

interface Services {
    type:String;
    value:String;
}

interface ShipmentType{
    name: String;
    type: String;
    mode:String;
    destination: String;
    origin: String;
    total: String;
    status:String;
    cargo: Cargo[];
    services:Services[];
}


export default function Detail(props:DetailProps) {
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [error, setError] = useState('');
    const [shipment, setShipment] = useState<any>({});

    useEffect(() => {
        if(!params){
            return navigate('*');
        } 
        if(!context.isAuthenticated){
            return;
        };
        setLoading(true);
        const graphqlQuery = {
            query:`
            {
                shipment(id: "${params.id}"){
                        _id
                        id
                        name
                        mode
                        cargo{
                            type
                            description
                            volume
                        }
                        type
                        destination
                        origin
                        status
                        total
                        services{
                            type
                            value
                        }
                        createdAt
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
            setLoading(false);
            return navigate('/login');
            }
            if(resData.errors){
            setError('Shipment failed to load');
            setLoading(false);
            return navigate('*');
            }
            if(resData.data.shipment){
                setTimeout(() => {
                    setShipment(resData.data.shipment);
                    setLoading(false);
                },1000);
            }
        });
    },[context,setLoading,setShipment,setError]);


    const handleDelete = () => {
        if(!context.isAuthenticated) return;
        setLoadingBtn(true);
        const graphqlQuery = {
            query:`
              mutation{
                deleteShipment(id: "${shipment._id}")
               }
            `
        }
      
        fetchApi(graphqlQuery,context.token)
        .then((resData) => {
            if(resData.errors){
               setError('Shipment failed to delete');
                setLoadingBtn(false);
                return navigate('*');
            }
            if(resData.data.deleteShipment){
                setLoadingBtn(false);
                return navigate('/dashboard/allshipment/');
            }
        });
    }
    return (
        <Layout showNavTab={true}>
            <div className="app-shiphment-detail">
                <div className="row">
                    <div className="col-12 col-md-12">
                        <div className="top-level">
                            <span className="display-span">All Shipment</span>
                            <svg style={{width:"12px",height:"auto"}} className="ms-1" version="1.1" id="Chevron_thin_right" xmlns="http://www.w3.org/2000/svg"  x="0px"
                                    y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20">
                                   <path d="M13.25,10L6.109,2.58c-0.268-0.27-0.268-0.707,0-0.979c0.268-0.27,0.701-0.27,0.969,0l7.83,7.908
                                    c0.268,0.271,0.268,0.709,0,0.979l-7.83,7.908c-0.268,0.271-0.701,0.27-0.969,0c-0.268-0.269-0.268-0.707,0-0.979L13.25,10z"/>
                            </svg>
                            <span className="ms-2 display--subhead">Shipment Details</span>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                {loading && shipment ? (<div className="text-center mt-3">
                                <span className="spinner-border me-2 spinner-border-lg" role="status" aria-hidden="true"></span>
                                    </div>) : ( 
                                    
                                    <>
                                        <div className="col-12 cd-section">
                                        <div >
                                                <h2 className=" display-3 mb-0">{shipment.id}</h2>
                                                <p className="display-span">Created at: {shipment.createdAt}</p>
                                        </div>
                                        <div>
                                            <Link to={`/shipment/update?_sid=${shipment.id}`} className="btn btn-dark">Update Shipment</Link>
                                        </div>
                                        </div>
                                        <div className="cd-detail">
                                            <div className="cd-detail-head">
                                                <p>Please confirm your shipment provided, if changes is needed use the Update button above</p>
                                            </div>
                                            <div className="cd-detail-listing">
                                                <div className="row mb-1">
                                                    <div className="col-12 col-md-6">
                                                        <div>
                                                            <span className="display-span">PORT OF LOADING (ORIGIN)</span>
                                                            <h5>{shipment.origin}</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-3">
                                                        <div>
                                                            <span className="display-span">TYPE</span>
                                                            <h5>{shipment.type}</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-3">
                                                        <div>
                                                            <span className="display-span">CURRENT STATUS</span>
                                                            <h5 className={`${shipment.status === "COMPLETED" ? "status-completed":"status-active-color"}`}>{shipment.status}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mt-4">
                                                    <div className="col-12 col-md-6">
                                                        <div>
                                                            <span className="display-span">LOCATION OF DISCHARGE (DESTINATION)</span>
                                                            <h5>{shipment.destination}</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-3">
                                                        <div>
                                                            <span className="display-span">SHIPPING MODE</span>
                                                            <h5>{shipment.mode}</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-3"></div>
                                                </div>
                                                <div className="row mt-4">
                                                    <div className="col-12 col-md-6">
                                                        <div>
                                                            <span className="display-span">COMMODITY</span>
                                                            <h5>{shipment.name}</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-3">
                                                        <div>
                                                            <span className="display-span">TOTAL</span>
                                                            <h5>{shipment.total}</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-3"></div>
                                                </div>
                                                <br />
                                                <hr className="border-top" />
                                                <div className="cargo mt-4">
                                                    <h5>Cargo - </h5>
                                                    {shipment.cargo ? shipment.cargo.map((item:any) => {

                                                        return(
                                                            <div className="row mt-3">
                                                                <div className="col-12 col-md-6">
                                                                    <div>
                                                                        <span className="display-span">TYPE</span>
                                                                        <h5>{item.type}</h5>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 col-md-3">
                                                                    <div>
                                                                        <span className="display-span">DESCRIPTION</span>
                                                                        <h5>{item.description}</h5>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 col-md-3">
                                                                    <div>
                                                                        <span className="display-span">VOLUME</span>
                                                                        <h5>{item.volume}</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }) : null}
                                                    
                                                </div>
                                                <br />
                                                <div className="cargo mt-4">
                                                    <h5>Services - </h5>
                                                    {shipment.services ? shipment.services.map((item:any) => {

                                                        return(
                                                            <div className="row mt-3">
                                                                <div className="col-12 col-md-6">
                                                                    <div>
                                                                        <span className="display-span">TYPE</span>
                                                                        <h5>{item.type}</h5>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 col-md-3">
                                                                    <div>
                                                                        <span className="display-span">VALUE</span>
                                                                        <h5>{item.value}</h5>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 col-md-3">
                                                                </div>
                                                            </div>
                                                        )
                                                        }): null}
                                                </div>
                                            </div>
                                        </div>
                                        </>
                                )}
                            </div>
                            <br />
                            <br />
                        </div>
                    </div>
                </div>

                <div className="col-12 mt-4 pb-2">
                    <div className="card shadow-sm">
                        <div className="card-body">
                        {loading ? (<div className="text-center mt-3">
                           <span className="spinner-border me-2 spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading....</div>) :(
                           <>
                           <p>This is a danger zone, Be sure before you continue the 'delete' process.</p>
                            <div>
                              <button type="button" className={`btn btn-danger ${loadingBtn && "disabled" }`} onClick={handleDelete}>
                                {loadingBtn && (<span className="spinner-border me-2 spinner-border-sm" role="status" aria-hidden="true"></span>)}
                                Delete Shipment</button>
                            </div>
                            </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
