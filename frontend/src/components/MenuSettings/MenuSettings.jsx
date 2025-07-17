import { useState } from 'react'
import staticStyles from '../main/StaticStyle.module.css'
import MenuProducts from './MenuProducts'
function MenuSettings() {
    const [products, setProducts] = useState([])
    const [activeContent, setActiveContent] = useState("MenuProducts")
    return <>
        <div className={staticStyles["content-container"]}>
            {activeContent === "MenuProducts" && <MenuProducts/>}
            {activeContent === "Taxes" && <Taxes/>}
        </div>
    </>
}
export default MenuSettings