import { useState } from 'react'
import styles from './StaticStyle.module.css'
import MenuProducts from '../MenuSettings/MenuSettings'
import Taxes from '../MenuSettings/Taxes'
import Category from '../MenuSettings/Category'
import PaymentMethods from '../GeneralSettings/PaymentMethods'
import TableSettings from '../GeneralSettings/TableLayout'
import TableLayout from '../GeneralSettings/TableLayout'
import AddRecipe from '../RecipeSettings/AddRecipe'
import Ingredients from '../RecipeSettings/Ingredients'

function App() {
	const [activeContent, setActiveContent] = useState("Recipes")
	const contentNames = {
		"MenuProducts": "Menü Ürünleri",
		"Taxes": "Vergiler",
		"Category": "Kategoriler",
		"PaymentMethods": "Ödeme Seçenekleri",
		"TableLayout":"Masa Düzeni",
		"Recipes":"Reçete Ekle",
		"Ingredients": "Malzemeler"
	}
	function openSubMenu(e) {
		const mainMenu = e.target.closest("li")
		const isOpen = mainMenu.getElementsByClassName(styles["sub-menu"])[0].style.display
		const arrow = mainMenu.querySelectorAll("svg")[1]

		if (isOpen == "" || isOpen == "none") {
			mainMenu.getElementsByClassName(styles["sub-menu"])[0].style.display = "flex"
			console.log(arrow.classList)
			arrow.classList.toggle(styles["rotate-down"])

		} else if (isOpen == "flex") {
			mainMenu.getElementsByClassName(styles["sub-menu"])[0].style.display = "none"
			arrow.classList.remove(styles["rotate-down"])

		}
	}

	return (
		<div className={styles["page-container"]}>
			<div className={styles["left-bar"]}>
				<h1 style={{ textAlign: "center" }}>RESTO</h1>
				<ul>
					<li>
						<div className={styles["main-menu"]}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
								<path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
							</svg>
							<p>Ana Ekran</p>
						</div>
					</li>
					<li>
						<div id='product-managing' className={styles["main-menu"]} onClick={(e) => openSubMenu(e)}>
							<div style={{display:"flex"}}>
								<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-menu-up" viewBox="0 0 16 16">
									<path d="M7.646 15.854a.5.5 0 0 0 .708 0L10.207 14H14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3.793zM1 9V6h14v3zm14 1v2a1 1 0 0 1-1 1h-3.793a1 1 0 0 0-.707.293l-1.5 1.5-1.5-1.5A1 1 0 0 0 5.793 13H2a1 1 0 0 1-1-1v-2zm0-5H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zM2 11.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 0-1h-8a.5.5 0 0 0-.5.5m0-4a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11a.5.5 0 0 0-.5.5m0-4a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1h-6a.5.5 0 0 0-.5.5" />
								</svg>
								<p>Ürün Yönetimi</p>
							</div>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
								<path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8" />
							</svg>
						</div>
						<div className={styles["sub-menu"]}>
							<ul>
								<li onClick={() => setActiveContent("MenuProducts")}>Menü Ürünleri</li>
								<li onClick={() => setActiveContent("Category")}>Kategoriler</li>
								<li onClick={() => setActiveContent("Taxes")}>Vergiler</li>
								<li>İlave Grupları</li>
							</ul>
						</div>
					</li>

					<li>
						<div id='general-settings' className={styles["main-menu"]} onClick={(e) => openSubMenu(e)}>
							<div style={{display:"flex"}}>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
									<path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
									<path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
								</svg><p>Genel Ayarlar</p>	
							</div>
												
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
								<path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8" />
							</svg>
						</div>
						<div className={styles["sub-menu"]}>
							<ul>
								<li onClick={() => setActiveContent("PaymentMethods")}>Ödeme Yöntemleri</li>
								<li onClick={() => setActiveContent("TableLayout")}>Masa Ayarları</li>
							</ul>
						</div>
					</li>

					<li>
						<div className={styles["main-menu"]}>
							<div style={{display:"flex"}}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-box" viewBox="0 0 16 16">
								<path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z" />
							</svg><p>Stok Takibi</p></div>
							</div>

					</li>


					<li>
						<div id='general-settings' className={styles["main-menu"]} onClick={(e) => openSubMenu(e)}>
							<div style={{ display: "flex" }}>
								<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-calculator" viewBox="0 0 16 16">
								<path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
								<path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
							</svg><p>Maliyet Ayarları</p>
							</div>

							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16">
								<path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8" />
							</svg>
						</div>
						<div className={styles["sub-menu"]}>
							<ul>
								<li onClick={() => setActiveContent("Recipes")}>Reçete Ekle</li>
								<li onClick={() => setActiveContent("Invoices")}>Faturalar</li>
								<li onClick={() => setActiveContent("Ingredients")}>Malzemeler</li>
							</ul>
						</div>
					</li>

					<li>
						<div className={styles["main-menu"]}>
							<div style={{display:"flex"}}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-newspaper" viewBox="0 0 16 16">
								<path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5z" />
								<path d="M2 3h10v2H2zm0 3h4v3H2zm0 4h4v1H2zm0 2h4v1H2zm5-6h2v1H7zm3 0h2v1h-2zM7 8h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2z" />
							</svg><p>Detaylı Raporlar</p></div>
							</div>
					</li>
				</ul>
			</div>
			<div className={styles["content"]}>
				<div className={styles["middle-top-bar"]}>
					<div className={styles["infos"]} >
						<h1>{contentNames[activeContent]}</h1>
						<p>TEST DÜKKAN</p>
					</div>

				</div>
				{activeContent === "TableLayout" && <TableLayout/>}
				{activeContent === "PaymentMethods" && <PaymentMethods/>}
				{activeContent === "MenuProducts" && <MenuProducts />}
				{activeContent === "Taxes" && <Taxes />}
				{activeContent === "Category" && <Category />}
				{activeContent === "Recipes" && <AddRecipe />}
				{activeContent === "Ingredients" && <Ingredients /> }
			</div>
		</div>
	)
}

export default App
