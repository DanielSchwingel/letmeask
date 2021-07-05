import { BrowserRouter, Switch ,Route, RouteProps, Redirect } from 'react-router-dom';

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';

import { AuthContextProvider } from './contexts/authContext';
import { ModalContextProvider } from './contexts/modalContext';
import { useAuth } from './hooks/useAuth';

function PrivateRoute ({...rest}: RouteProps) {
	const { user, loading } = useAuth();

	if (loading) {
		return <h1>Carregando</h1>
	}
	console.log('chegou aqui')
	if (!user) {
		return <Redirect to='/'/>
	}

	return (
		<Route {...rest}/>
	)
}

export function Routes() {
   return( 
		<BrowserRouter>
			<AuthContextProvider>
				<ModalContextProvider>
					<Switch>
						<Route path='/' exact component={Home}/>
						<Route path='/rooms/new' component={NewRoom}/>
						<Route path='/rooms/:id' component={Room}/>
						<PrivateRoute path='/admin/rooms/:id' exact component={AdminRoom} />		
					</Switch>
				</ModalContextProvider>
			</AuthContextProvider>
		</BrowserRouter>
   );
};