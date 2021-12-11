import React, { useState,useContext, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Layout from '../../../hoc/Layout';
import fetchApi from '../../../utils/fetch';


interface InitialValuesType{
  email: string;
  password:string;
 
}

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialValues,setInitialValues] = useState<InitialValuesType>({
    email: 'emma@gmail.com',
    password: '12345'
  });


  const handleLoginFunc = (email:String,password:String) => {
    setLoading(true);
    const graphqlQuery = {
      query:`
        {
          login(email:"${email}",password: "${password}"){
            token
            userId
          }
        }
      `
    }
    fetchApi(graphqlQuery,null)
    .then((resData) => {
      console.log(resData,'login');
      if(resData.errors && resData.errors[0].status === 422){
       setError(
          "Validation failed. Make sure the email address isn't used yet"
        );
        setLoading(false);
        return null;
      }
      if(resData.errors){
        setError('User login failed');
        setLoading(false);
        return null;
      }
      if(resData.data.login){
        localStorage.setItem('token',resData.data.login.token);
        localStorage.setItem('userId',resData.data.login.userId);
        setTimeout(() => {
          setLoading(false);
          navigate('/');
        },1000)

      }
    })
  }

    //form fields validation with yup package
    const createSchema = Yup.object().shape({
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
        handleLoginFunc(values.email,values.password)
      }
  });

    return (
      <Layout showNavTab={false}>
          <div className="app-auth">
            <div className="app-auth-wrapper">
                  <div className="row">
                <div className="col-12 col-md-6 mt-3">
               <div className="card shadow-sm">
                 <div className="card-body">
                  <h4 className=" display-3">Log in to Siopp</h4>
                    {error && (<div className="alert alert-danger">{error}</div>)}
                    <form  className="needs-validation formClass" onSubmit={(e) => formik.handleSubmit(e)}>
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
                          <button type="submit" className={`btn btn-primary w-100 display--subhead ${loading && "disabled" }`} >
                           {loading && (<span className="spinner-border me-2 spinner-border-sm" role="status" aria-hidden="true"></span>)}
                            Continue
                          </button>
                      </form>
                       <p className="display-span text-center mt-3">Don't have an account <Link to="/signup">Signup here</Link></p>
                  </div>
               </div>
               
            </div>
          </div>
          </div>
          </div>
      </Layout>
    )
}
