import React, {useState,useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../../hoc/Layout';
import fetchApi from '../../../utils/fetch';

interface InitialValuesType{
  name: string;
  email: string;
  password:string;
 
}

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialValues,setInitialValues] = useState<InitialValuesType>({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const _token = localStorage.getItem('token');
    const _userId = localStorage.getItem('userId');
    if (_token && _userId) {
        return navigate('/');
    }
  }, [])


  const handleRegisterFunc = (name:String,email:String,password:String) => {
    setLoading(true);
    const graphqlQuery = {
      query:`
        mutation{
          createUser(userInput: {name:"${name}",email:"${email}",password: "${password}"}){
            _id
          }
        }
      `
    }
   
    fetchApi(graphqlQuery,null)
    .then((resData) => {
      console.log(resData,'res');
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
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      },1000)
    })
  }


    //form fields validation with yup package
    const createSchema = Yup.object().shape({
      name: Yup.string()
        .required('Username is Required'),
      email: Yup.string()
        .required('Email is Required'),
      password: Yup.string()
        .required('Password is Required')
    });

  const formik = useFormik({
      enableReinitialize:true,
      initialValues:initialValues,
      validationSchema:createSchema,
      onSubmit:(values)  => {
        handleRegisterFunc(values.name,values.email,values.password)
      }
  });

    return (
      <Layout showNavTab={false}>
          <div className="app-auth">
            <div className="app-auth-wrapper">
                  <div className="row">
                   <div className="col-12 col-md-7 me-0 mt-3">
                    <div className="card shadow-sm ">
                        <div className="card-body">
                        <h4 className=" display-3">Join the best Shipment Software</h4>

                        <form  className="needs-validation formClass" onSubmit={(e) => formik.handleSubmit(e)}>
                            <div className="mb-4">
                                <label htmlFor="exampleInputname" className="form-label display--subhead">Username</label>
                                <input type="text"  placeholder="Username" name="name" 
                                    className={`form-control ${formik.errors.name && formik.touched.name && 'is-invalid'} `} id="exampleInputname" aria-describedby="nameHelp"
                                  value={formik.values.name}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  />
                              {formik.errors.name && formik.touched.name ? (
                                  <div className="invalid-feedback">{formik.errors.name}</div>
                              ) : null}
                          </div>
                          <div className="mb-4">
                              <label htmlFor="exampleInputEmail" className="form-label display--subhead">Email</label>
                              <input type="email"  placeholder="Email" name="email" 
                                  className={`form-control ${formik.errors.email && formik.touched.email && 'is-invalid'} `} id="exampleInputEmail" aria-describedby="nameHelp"
                                  value={formik.values.email}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  />
                              {formik.errors.email && formik.touched.email ? (
                                  <div className="invalid-feedback">{formik.errors.email}</div>
                              ) : null}
                          </div>
                          <div className="mb-4">
                              <label htmlFor="exampleInputPassword" className="form-label display--subhead">Password</label>
                              <input type="password"  placeholder="Password" name="password" 
                                  className={`form-control ${formik.errors.password && formik.touched.password && 'is-invalid'} `} id="exampleInputEmail" aria-describedby="nameHelp"
                                  value={formik.values.password}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  />
                              {formik.errors.password && formik.touched.password ? (
                                  <div className="invalid-feedback">{formik.errors.password}</div>
                              ) : null}
                          </div>
                          <button type="submit" className={`btn btn-primary w-100 display--subhead ${loading && "disabled" }`}>
                           {loading && (<span className="spinner-border me-2 spinner-border-sm" role="status" aria-hidden="true"></span>)}
                            Signup</button>
                      </form>
                      <p className="display-span text-center mt-3">Already have an account <Link to="/login">Login here</Link></p>

                  </div>
               </div>
               
            </div>
          </div>
          </div>
          </div>
      </Layout>
    )
}
