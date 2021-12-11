import React,{useState,useEffect,useContext} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Layout from '../../hoc/Layout';
import AuthContext from '../../context/auth-context';

import ShipFreight from '../../assets/images/ship-64.png'; 
import AirFreight from '../../assets/images/airplane-64.png'; 
import TruckFreight from '../../assets/images/truck-64.png'; 
import fetchApi from '../../utils/fetch';

interface CreateShipmentProps{}

interface InitialValuesType{
    name: string;
    type: string;
    mode:string;
    destination: string;
    origin: string;
    total: string;
}

interface Cargo {
    type:String;
    description:String;
    volume:String;
}

interface Services {
    type:String;
    value:String;
}

interface ObjectType{
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


export default function CreateShipment(props:CreateShipmentProps) {
    const context = useContext(AuthContext);
    const navigate = useNavigate();

    const [searchParams, setSearchParms] = useSearchParams();
    const _mode:any = searchParams.get('mode');

   
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [initialValues,setInitialValues] = useState<InitialValuesType>({
                                                name: '',
                                                type: '',
                                                mode:'sea',
                                                destination: '',
                                                origin: '',
                                                total: '10000',
                                              });
    const [cargoInputList,setCargoInputList] = useState<Array<Cargo>>(
                            [{
                                type: '',
                                description: '',
                                volume: ''
                            }]);
    const [servicesInputList,setServicesInputList] = useState<Array<Services>>([{
                                    type: '',
                                    value: ''
                                }]);

    useEffect(() => {
        
        if(searchParams.get('mode')){
            const _mode:any = searchParams.get('mode');
            console.log(_mode,'inside');

            if(_mode === 'sea' || _mode === 'land' || _mode === 'air') {
                const _newValues = {
                    ...initialValues,
                    mode:_mode
                }
                setInitialValues(_newValues);

            }
        }
    }, [context,searchParams])



    const handleModeSelection = (e:any,mode:string) => {
        const iniVal = {...initialValues};
        const __newValues = {
            ...iniVal,
            mode:mode
        }
        setInitialValues(__newValues);
    }
    // handle to change input field for cargo
    const handleCargoInputChange = (e:any,index:number) => {
        const {name, value} = e.target;
        const list:any = [...cargoInputList];
        list[index][name] = value;
        setCargoInputList(list);
    }
    //handler that add extra new carge fields
    const addCargoField = () => {
        setCargoInputList([
             ...cargoInputList, 
             {
                type: '',
                description: '',
                volume: ''
              }
           ]);
    }
    // Remove cargo input field
    const removeCargoField = (index:number) => {
        if(index < 1) return null;
        const list = [...cargoInputList];
        list.splice(index, 1);
        console.log(list,'list');
       setCargoInputList(list);
    }

     // handle to change input field for services
     const handleServicesInputChange = (e:any,index:number) => {
        const {name, value} = e.target;
        const _list:any = [...servicesInputList];
        _list[index][name] = value;
        setServicesInputList(_list);
    }

    // handle to add input field for services
    const addServicesField = () => {
        setServicesInputList([
             ...servicesInputList, 
             {
                type: '',
                value: '',
              }
           ]);
    }
     // Remove service input field for services
     const removeServiceField = (index:number) => {
        if(index < 1) return null;
        const list = [...servicesInputList];
        list.splice(index, 1);
       setServicesInputList(list);
    }


    const handleSubmitFunc = (objData:ObjectType) => {
        if(context.isAuthenticated){
            setLoading(true);
            let cargoList = objData.cargo.length > 0 ? JSON.stringify(objData.cargo.map((res) =>(
                {
                    type:res.type,
                    description:res.description,
                    volume:res.volume
                }
            ))).replace(/"([^(")"]+)":/g,"$1:") : JSON.stringify([]);
            
            const serviceList = objData.services.length > 0 ? JSON.stringify(objData.services.map((item) =>(
                {...item}
            ))).replace(/"([^(")"]+)":/g,"$1:") : JSON.stringify([]);


            const graphqlQuery = {
            query:`
                mutation{
                    createShipment(shipmentInput: {
                        name:"${objData.name}",
                       cargo:${cargoList},
                       mode: "${objData.mode}",
                       type: "${objData.type}",
                       destination: "${objData.destination}",
                       origin: "${objData.origin}",
                       services: ${serviceList},
                       total: "${objData.total}",
                       status: "${objData.status}"
                     }){
                         id
                     }
                }
            `
            }
           
            fetchApi(graphqlQuery,context.token)
            .then((resData) => {
                if(resData.errors && resData.errors[0].status === 422){
                setError(
                "Validation failed. Make sure the email address"
                );
                setLoading(false);
                    return null;
                }
                if(resData.errors){
                    setError('User Signup failed');
                    setLoading(false);
                    return null;
                }
                if(resData.data.createShipment){
                    setTimeout(() => {
                        setLoading(false);
                       navigate(`/shipment/${resData.data.createShipment.id}/`);
                    },1000)
                }
        })

      }
    }


    //form fields validation with yup package
    const createSchema = Yup.object().shape({
        name: Yup.string()
          .required('Name Required'),
        mode: Yup.string()
          .required('Mode is Required'),
        type: Yup.string().required('Type is Required'),
        destination: Yup.string().required('Destination is Required'),
        origin: Yup.string().required('Origin is Required'),
        total: Yup.string().required('Total is Required'),
      });

    const formik = useFormik({
        enableReinitialize:true,
        initialValues:initialValues,
        validationSchema:createSchema,
        onSubmit:(values)  => {
            const obj:ObjectType = {
                name: values.name,
                cargo: cargoInputList,
                mode : values.mode,
                type: values.type,
                destination: values.destination,
                origin: values.origin,
                total: values.total,
                status: 'ACTIVE',
                services: servicesInputList
            }
            handleSubmitFunc(obj);
        }
    });

    let modeQuery = null;
    if(_mode === 'sea' || _mode === 'land' || _mode === 'air'){
          modeQuery= searchParams.get('mode');
    }

    return (
        <Layout showNavTab={false}>
            <div className="app-create">
                <div className="col-12 cd-section">
                   
                    <h2 className=" display-3">
                        {modeQuery ? `Great choice, create a shipment by ${modeQuery}`:`Let create a new shipment`}</h2>
                    <p className="display-span">To add more cargo and service using the Add Button </p>
                </div>

                <div className="col-12 col-lg-8 app-create-form">
               
                        <form  className="needs-validation formClass" onSubmit={(e) => formik.handleSubmit(e)}>
                           
                            <div className="mb-4">
                                <label htmlFor="exampleInputName" className="form-label">Name</label>
                                <input type="text"  placeholder="Product Name" name="name" 
                                    className={`form-control ${formik.errors.name && formik.touched.name && 'is-invalid'} `} id="exampleInputName" aria-describedby="nameHelp"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                   />
                                {formik.errors.name && formik.touched.name ? (
                                    <div className="invalid-feedback">{formik.errors.name}</div>
                                ) : null}
                            </div>

                            <div className="mb-4 form-mutiple-field">
                                <label htmlFor="exampleInputMode" className="form-label">Cargo</label>
                                <div className="multi-inputs">
                                    {cargoInputList.map((x:any,index) => {
                                      return(
                                          <div key={index} className="position-relative w-100">
                                             <div className="row  mt-2 ">
                                                <div className="col-12 col-lg-4">
                                                    <input type="text" value={x.type} placeholder="Type" name="type" className="form-control" id="exampleInputMode" aria-describedby="modeHelp" onChange={(e:any) => handleCargoInputChange(e,index)} />
                                                </div>
                                                <div className="col-12 col-lg-4">
                                                    <input type="text" value={x.description} name="description" placeholder="Description" className="form-control" id="exampleInputMode" aria-describedby="modeHelp" onChange={(e:any) => handleCargoInputChange(e,index)}/>
                                                </div>
                                                <div className="col-12 col-lg-4">
                                                    <input type="text" value={x.volume} name="volume" placeholder="Volume" className="form-control" id="exampleInputMode" aria-describedby="modeHelp" onChange={(e:any) => handleCargoInputChange(e,index)}/>
                                                </div>
                                              </div>
                                            <span className="input-remove-btn">
                                               <svg onClick={() => removeCargoField(index)} version="1.1" id="Circled_cross" xmlns="http://www.w3.org/2000/svg" x="0px"
                                                    y="0px" viewBox="0 0 20 20" enableBackground="new 0 0 20 20">
                                                    <path fill="#333" d="M10,1.6c-4.639,0-8.4,3.761-8.4,8.4s3.761,8.4,8.4,8.4s8.4-3.761,8.4-8.4S14.639,1.6,10,1.6z M14.789,13.061
                                                    L13.06,14.79L10,11.729l-3.061,3.06L5.21,13.06L8.272,10L5.211,6.939L6.94,5.211L10,8.271l3.061-3.061l1.729,1.729L11.728,10
                                                    L14.789,13.061z"/>
                                                </svg>
                                            </span>
                                        </div>);
                                    })}
                                    
                                </div>
                                <a className="btn btn-secondary mt-3" onClick={addCargoField}>Add field</a>
                            </div>
                            <br />
                            <div className="mb-3 mode-form">
                                <label htmlFor="exampleInputMode" className="form-label">Mode</label>
                                <div className="row">
                                    <div className="col-12 col-lg-4 col_mode">
                                        <a  className={`card ${formik.values.mode === 'sea' && 'card--active'}`} onClick={(e) => handleModeSelection(e,'sea')}>
                                            <div className="card-body">
                                                <div className="img-container">
                                                    <img src={ShipFreight}  alt="" />
                                                </div>
                                                <div className="card-title  ps-0 text-center">
                                                    <h5 className="display--subhead">By Sea</h5>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-12 col-lg-4 col_mode">
                                        <a  className={`card ${formik.values.mode === 'air' && 'card--active'}`}onClick={(e) => handleModeSelection(e,'air')}>
                                            <div className="card-body">
                                                <div className="img-container">
                                                    <img src={AirFreight}  alt="" />
                                                </div>
                                                <div className="card-title ps-0 text-center">
                                                    <h5 className="display--subhead ">By Air</h5>
                                                    {/* <span className="display-span">Reliable</span> */}
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-12 col-lg-4 col_mode">
                                        <a  className={`card ${formik.values.mode === 'land' && 'card--active'}`} onClick={(e) => handleModeSelection(e,'land')}>
                                            <div className="card-body">
                                                <div className="img-container">
                                                    <img src={TruckFreight}  alt="" />
                                                </div>
                                                <div className="card-title  ps-0 text-center">
                                                    <h5 className="display--subhead">By Land</h5>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                    <input type="hidden" name="mode" className="form-control" id="exampleInputMode" aria-describedby="modeHelp" 
                                    value={formik.values.mode}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="exampleInputType" className="form-label">Type</label>
                                    <input type="text" placeholder="Product Type" name="type" className={`form-control ${formik.errors.type && formik.touched.type && 'is-invalid'} `} id="exampleInputType" aria-describedby="typeHelp" 
                                    value={formik.values.type}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.type && formik.touched.type ? (
                                        <div className="invalid-feedback"> {formik.errors.type}</div>
                                    ) : null}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="exampleInputorigin" className="form-label">Origin</label>
                                    <input type="text" name="origin" placeholder="Product Origin" className={`form-control ${formik.errors.origin && formik.touched.origin && 'is-invalid'} `} id="exampleInputOrigin" aria-describedby="destinatedHelp" 
                                    value={formik.values.origin}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.origin && formik.touched.origin ? (
                                        <div className="invalid-feedback">{formik.errors.origin}</div>
                                    ) : null}
                                </div>
                                <div className="mb-4 form-mutiple-field">
                                    <label htmlFor="exampleInputMode" className="form-label">Services</label>
                                    <div className="multi-inputs">
                                        {servicesInputList.map((x:any,index) => {
                                        return(
                                            <div key="index" className="position-relative w-100">
                                                <div className="row  mt-2 ">
                                                    <div className="col-12 col-lg-6">
                                                        <input type="text" value={x.type} placeholder="Type" name="type" className="form-control" id="exampleInputMode" aria-describedby="modeHelp" onChange={(e:any) => handleServicesInputChange(e,index)} />
                                                    </div>
                                                    <div className="col-12 col-lg-6">
                                                        <input type="text" value={x.value} name="value" placeholder="Value" className="form-control" id="exampleInputMode" aria-describedby="modeHelp" onChange={(e:any) => handleServicesInputChange(e,index)}/>
                                                    </div>
                                                </div>
                                                <span className="input-remove-btn">
                                                <svg onClick={() => removeServiceField(index)} version="1.1" id="Circled_cross" xmlns="http://www.w3.org/2000/svg" x="0px"
                                                        y="0px" viewBox="0 0 20 20" enableBackground="new 0 0 20 20">
                                                        <path fill="#333" d="M10,1.6c-4.639,0-8.4,3.761-8.4,8.4s3.761,8.4,8.4,8.4s8.4-3.761,8.4-8.4S14.639,1.6,10,1.6z M14.789,13.061
                                                        L13.06,14.79L10,11.729l-3.061,3.06L5.21,13.06L8.272,10L5.211,6.939L6.94,5.211L10,8.271l3.061-3.061l1.729,1.729L11.728,10
                                                        L14.789,13.061z"/>
                                                    </svg>
                                                </span>
                                            </div>);
                                        })}
                                        
                                    </div>
                                    <a className="btn btn-secondary mt-3" onClick={addServicesField}>Add field</a>
                                </div>
                                <br />
                                <div className="mb-4">
                                    <label htmlFor="exampleInputDestination" className="form-label">Destination</label>
                                    <input type="text" placeholder="Product Destination" name="destination" 
                                        className={`form-control ${formik.errors.destination && formik.touched.destination && 'is-invalid'} `} id="exampleInputDestination" aria-describedby="destinatedHelp" 
                                        value={formik.values.destination}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.destination && formik.touched.destination ? (
                                        <div className="invalid-feedback">{formik.errors.destination}</div>
                                    ) : null}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="exampleInputTotal" className="form-label">Total</label>
                                    <input disabled type="text" placeholder="Total" name="total" 
                                        className={`form-control ${formik.errors.total && formik.touched.total && 'is-invalid'} `} id="exampleInputTotal" aria-describedby="totalHelp" 
                                        value={formik.values.total}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.destination && formik.touched.destination ? (
                                        <div className="invalid-feedback">{formik.errors.destination}</div>
                                    ) : null}
                                </div>
                            <button type="submit" className={`btn btn-lg btn-primary w-25 ${loading && "disabled" }`}>
                                {loading && (<span className="spinner-border me-2 spinner-border-sm" role="status" aria-hidden="true"></span>)}
                                    Submit</button>
                        </form>
                          
                </div>
            </div>
        </Layout>
    )
}
