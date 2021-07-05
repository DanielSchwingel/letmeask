import { BrowserRouter, Switch ,Route } from 'react-router-dom';

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';

import { AuthContextProvider } from './contexts/authContext';
import { ModalContextProvider } from './contexts/modalContext';


function App() {
	return (
		<BrowserRouter>
			<AuthContextProvider>
				<Switch>
					<Route path='/' exact component={Home}/>
					<Route path='/rooms/new' component={NewRoom}/>
					<ModalContextProvider>
						<Route path='/rooms/:id' component={Room}/>
						<Route path='/admin/rooms/:id' component={AdminRoom} />
					</ModalContextProvider>
				</Switch>
			</AuthContextProvider>
		</BrowserRouter>
	);
}

export default App;
