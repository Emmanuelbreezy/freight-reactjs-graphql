import React,{useState,useContext,useEffect} from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import Table from '../../components/Table/Table';
import Layout from '../../hoc/Layout';
import fetchApi from '../../utils/fetch';
import Loader from '../../components/Loader/Loader';


interface ListShipmentProps{}

interface ShipmentType{
    id:string;
    name: string;
    mode:string;
    status: string;
    origin: string;
    destination: string;
    total: string;
}

export default function ListShipment(props:ListShipmentProps) {
    const context = useContext(AuthContext);

    const [error, setError] = useState<String>('');
    const [loading, setLoading] = useState<Boolean>(false);
    const [findLoading, setFindLoading] = useState<Boolean>(false);
    const [findValue, setFindValue] = useState<string>('');
    
    const [shipmentData, setShipmentData] = useState<[ShipmentType] | [{}]>([{}]);

    const [currentPage, setcurrentPage] = useState(1);
    const [itemsPerPage, setitemsPerPage] = useState(20);
    const [totalShipments, setTotalShipments] = useState(null);
    

     
    useEffect(() => {
        setLoading(true);
        setError('');
        if(!context.isAuthenticated){
            return;
          }
        loadAllShipments(currentPage,itemsPerPage);
           
        
    }, [context,setLoading,setError]);


    // handle Input value change
    const handleChange =(e:any) => {
        const val = e.target.value;
        setFindValue(e.target.value);
        if(!val.trim()) {
            setError('');
            setFindLoading(false);
            return loadAllShipments(currentPage,itemsPerPage);
        }
        handleFindShipmentById(val);
    }



    const loadAllShipments = (currentPage:number,itemsPerPage:number) =>{
       
        const graphqlQuery = {
            query:`
            {
                shipments(page:${currentPage},perPage:${itemsPerPage}) {
                    shipments{
                        id
                        name
                        origin
                        destination
                        mode
                        total
                        status
                    }
                    totalShipments
                }
            }
            `
        }
        // fetchApi takes in the query and token
        fetchApi(graphqlQuery,context.token)
        .then((resData) => {
             console.log(resData,'shipment dasboard');
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
                        setTotalShipments(resData.data.shipments.totalShipments);
                        setLoading(false);
                    },1000);
                }
        });
    }


   

    const handleFindShipmentById = (value:String) => {

        if(!context.isAuthenticated){
            return null;
          }
        if(value){
            setFindLoading(true);
            setError('');
            const graphqlQuery = {
                query:`
                {
                    shipment(id: "${value}"){
                            id
                            name
                            origin
                            destination
                            mode
                            total
                            status
                    }
                }
                `
            }
            fetchApi(graphqlQuery,context.token)
            .then((resData) => {
                console.log(resData,'SEARCH')
                if(resData.errors && resData.errors[0].status === 422){
                setError(
                    "Validation failed"
                );
                setFindLoading(false);
                return null;
                }
                if(resData.errors){
                    setError('Shipment ID Invalid');
                    setShipmentData([{}]);
                    setFindLoading(false);
                    return null;
                }
                if(resData.data.shipment){
                    setTimeout(() => {
                        setShipmentData([
                            {
                                ...resData.data.shipment
                            }]);
                        setFindLoading(false);
                    },1000);
                }
            }); 

        }
    }

    const handlePaging = (num:any) => {
        const number = Number(num);
        console.log(number);
        setcurrentPage(number);
        loadAllShipments(number,itemsPerPage);
    }

    const handleNextButton = () => {
        if(totalShipments){
            if((currentPage * itemsPerPage)  != totalShipments){
                setcurrentPage(currentPage + 1);
            }
        }
    }

    const handlePrevButton = () => {
        if(currentPage > 1){
            setcurrentPage(currentPage - 1);
        }
    }


    const paginationRendering = () => {
        if(totalShipments){
            const listOfPages = [];
            for(var i = 1; i< Math.ceil(totalShipments/itemsPerPage); i++){
                listOfPages.push(i);
            }
            
            console.log(listOfPages);
            // const indexOfLastItem = currentPage * itemsPerPage;
            // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            
            const renderPagesNumbers = listOfPages.map((number:number) =>{
            return (
                <li key={number}  className={`page-item ${currentPage === number && "active"}`}>
                    <a className="page-link pointer"  style={{cursor:"pointer"}}
                      onClick={() =>handlePaging(number)}>
                        {number}
                    </a>
                </li>
            )
        }) 

        return renderPagesNumbers;
    
        }
    }

    console.log(currentPage,'cuuuu');
 
    return (
        <Layout showNavTab={true}>
             <div className="app-allshipment">
                {error && (<div className="alert alert-danger">{error}</div>)}


                {loading  ? (<Loader size="lg" />) : (
                <>
                <div className="allshipment-searchbar-wrapper">
                       <div className="col-5 col-md-6 col-lg-9">
                        <input type="text" value={findValue} name="search" className="form-control" placeholder="Search by shipment ID" aria-label="" aria-describedby="basic-addon2" 
                            onChange={(e) => handleChange(e)}
                        />
                     
                        </div>
                        <Link to="/create" className="btn new-shipment-btn btn-primary">New Shipment</Link>
                        <button className="btn  btn-sm btn-outline-secondary export-btn tooltips">
                            <svg version="1.1" id="Share" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px"
                                viewBox="0 0 20 20" enableBackground="new 0 0 20 20" >
                               <path  d="M9,13h2V4h2l-3-4L7,4h2V13z M17,7h-3v2h2v9H4V9h2V7H3C2.447,7,2,7.447,2,8v11c0,0.552,0.447,1,1,1h14
                                c0.553,0,1-0.448,1-1V8C18,7.448,17.553,7,17,7z"/>
                            </svg>
                            <span className="tooltiptext">Export Table</span>
                        </button>
                </div>
              
                <div className="allshipment-table">
                     <div className="d-flex mb-3 align-items-center justify-content-between">
                       <h4 className="display-4">Shipment history</h4>
                        <div>
                            <span className="display-span"></span>
                        </div>
                     </div>

                     {!error && (
                         <>
                      {/* Table components display the shipmentData */}
                      {findLoading ? <Loader size="sm" /> : (
                          <>
                        <Table shipments={shipmentData} />

                        <div className="pagination mt-2">
                            <div className="col-12">
                            <nav aria-label="Page navigation example">
                                <ul className="pagination justify-content-end">
                                    <li className="page-item">
                                    <a className="page-link pointer"  aria-disabled="true" style={{cursor:"pointer"}} onClick={handlePrevButton}>Previous</a>
                                    </li>
                                     {paginationRendering()}
                                    <li className="page-item">
                                    <a className="page-link pointer" style={{cursor:"pointer"}} onClick={handleNextButton}>Next</a>
                                    </li>
                                </ul>
                                </nav>
                            </div>
                        </div>
                            </>

                      )}
                            </>
                       )}
                    </div>
                    </>
                    )}

                
            </div>
        </Layout>

    )
}
