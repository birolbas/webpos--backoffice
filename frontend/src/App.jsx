// App.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Ingredients from './components/RecipeSettings/Ingredients';
import PaymentMethods from './components/GeneralSettings/PaymentMethods';
import TableLayout from './components/GeneralSettings/TableLayout';
import Category from './components/MenuSettings/Category';
import MenuProducts from './components/MenuSettings/MenuProducts';
import Taxes from './components/MenuSettings/Taxes';
import AddRecipe from './components/RecipeSettings/AddRecipe';
import RecipeInput from './components/RecipeSettings/RecipeInput';
import Discount from "./components/GeneralSettings/Discount";
import ServiceCharge from "./components/GeneralSettings/ServiceCharge";
import CondimentGroups from './components/MenuSettings/CondimentGroups'
import CondimentProducts from './components/MenuSettings/CondimentProducts'
import Stocks from "./components/StockManagement/Stocks";
import StockCategories from './components/StockManagement/StockCategories'
const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{ path: "/malzemeler", element: <Ingredients /> },
			{ path: "/ödeme-seçenekleri", element: <PaymentMethods /> },
			{ path: "/masa-düzeni", element: <TableLayout /> },
			{ path: "/kategoriler", element: <Category /> },
			{ path: "/menü-ürünleri", element: <MenuProducts /> },
			{ path: "/vergiler", element: <Taxes /> },
			{ path: "/reçeteler", element: <AddRecipe /> },
			{ path: "/reçeteler/reçete-girişi/:recipe-type/:is-edit", element: <RecipeInput /> },
			{ path: "/indirim", element: <Discount/>},
			{ path: "/servis-ücreti", element: <ServiceCharge/>},
			{ path: "/ilave-grupları", element: <CondimentGroups/>},
			{ path: "/ilave-grupları/ilave-oluştur", element: <CondimentProducts/>},
			{ path: "/stok-durumu", element:<Stocks/>},
			{ path: "/stok-kategorileri", element:<StockCategories/>}
		]
	}
]);

export default function App() {
	return <RouterProvider router={router} />;
}
