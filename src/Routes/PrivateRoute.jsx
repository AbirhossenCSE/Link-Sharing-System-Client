import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/Authcontext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div className='flex min-h-screen justify-center items-center'>
            <div className="flex justify-center items-center h-40">
                <div className="w-12 h-12 border-4 border-dashed border-orange-400 rounded-full animate-spin"></div>
            </div>
        </div>
    }

    if (user && user?.email) {
        return children;
    }

    return <Navigate state={location.pathname} to={'/signin'}></Navigate>
};

export default PrivateRoute;