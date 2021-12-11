

export default function fetchApi(queryData:any,token:String|null){
    const checkToken = token ? {Authorization: 'Bearer '+ token} : '';
    return fetch('https://freightapp.herokuapp.com/graphql',{
            method:'POST',
            headers:{
            ...checkToken,
            'Content-Type': 'application/json'
            },
            body:JSON.stringify(queryData)
            })
            .then((res) => {
                return res.json();
            });
}