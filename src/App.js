import { useCallback, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Alert from './components/Alert';

function App() {
    const [jwtToken, setJwtToken] = useState('');
    const [alertMessage, setAlertMessage] = useState();
    const [alertClassName, setAlertClassName] = useState('d-none');

    const [tickInterval, setTickInterval] = useState();

    const navigate = useNavigate();

    const logOut = () => {
        const requestOptions = {
            method: "GET",
            credentials: "include",
        }

        fetch(`${process.env.REACT_APP_BACKEND}/logout`, requestOptions)
        .catch(error => {
            console.log("error loging out", error);
        })
        .finally(() => {
            setJwtToken("");
            toggleRefresh(false);
        })

        navigate("/login");
    }

    const toggleRefresh = useCallback((status) => {
        console.log("clicked");

        if (status ) {
            console.log("turning on ticking");
            let i = setInterval(() => {
                const requestOptions = {
                    method: "GET",
                    credentials: "include",
                }
    
            fetch(`${process.env.REACT_APP_BACKEND}/refresh`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if(data.access_token) {
                        setJwtToken(data.access_token);
                    }
                })
                .catch(error => {
                    console.log("user is not logged in");
                })
            }, 600000);
            setTickInterval(i);
            console.log("setting tick interval to",  i);
        } else {
            console.log("turning off ticking");
            console.log("turning off tickinterval", tickInterval);
            setTickInterval(null);
            clearInterval(tickInterval);
        }
    }, [tickInterval])


    useEffect(() => {
        if (jwtToken ==="") {
            const requestOptions = {
                method: "GET",
                credentials: "include",
            }
            fetch(`${process.env.REACT_APP_BACKEND}/refresh`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if(data.access_token) {
                        setJwtToken(data.access_token);
                        toggleRefresh(true);
                    }
                })
                .catch(error => {
                    console.log("user is not logged in", error);
                })
        }
    }, [jwtToken, toggleRefresh])


    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1 className="mt-3">Server Authentication for All the Apps!</h1>
                </div>
                <div className="col text-end">
                    {jwtToken === '' 
                        ? ( <Link to='login'><span className="badge bg-success">Login</span></Link> )
                        : (<a href='#!' onClick={logOut}><span className='badge bg-danger'>Logout</span></a>)
                    }
                </div>
                <hr className="mb-3"></hr>
            </div>

            <div className="row">
                <div className="col-md-2">
                    <nav>
                        <div className='list-group'>
                            <Link to='/' className="list-group-item list-group-item-action">Home</Link>
                            {jwtToken !== '' && (
                                <>
                                    <Link to='/apps' className="list-group-item list-group-item-action">Apps</Link>
                                    <Link to='/databases' className="list-group-item list-group-item-action">Databases</Link>
                                    <Link to='/roles' className="list-group-item list-group-item-action">Roles</Link>
                                    <Link to='/users' className="list-group-item list-group-item-action">Users</Link>
                                    <Link to='/groups' className="list-group-item list-group-item-action">Groups</Link>
                                    <Link to='/profiles' className="list-group-item list-group-item-action">Profiles</Link>
                                    <Link to='/ips' className="list-group-item list-group-item-action">IPs</Link>
                                    <Link to='/regions' className="list-group-item list-group-item-action">Regions</Link>
                                    <Link to='/biometrics' className="list-group-item list-group-item-action">Biometrics</Link>
                                    {/* <Link to='/manage-catalogue' className="list-group-item list-group-item-action">Manage Catalogue</Link> */}
                                </> 
                            )}
                        </div>
                    </nav>
                </div>
                <div className="col-md-10 ">
                    <Alert
                        message={alertMessage}
                        className={alertClassName}
                    />
                    <Outlet context={{
                        jwtToken, 
                        setJwtToken,
                        setAlertClassName,
                        setAlertMessage,
                        toggleRefresh,
                    }} />
                </div>
            </div>
        </div>
    );
}

export default App;