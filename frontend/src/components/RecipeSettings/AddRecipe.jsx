import { useEffect, useState } from 'react'
import ProductStyle from '../MenuSettings/MenuProducts.module.css'
import staticStyles from '../main/StaticStyle.module.css'
import styles from './AddRecipe.module.css'
import RecipeInput from './RecipeInput'
function AddRecipe() {
    const [recipeType, setRecipeType] = useState()
    const [goInputScreen, setGoInputScreen] = useState(false)
    function newRecipe() {
        document.getElementsByClassName(staticStyles["input-container"])[0].style.display = "flex"
    }
    function chooseRecipeType(recipe) {
        if(recipe == "prep-recipe"){
            setRecipeType("prep")
        }else{
            setRecipeType("product")
        }
    }

    return <>
        {goInputScreen ? (<RecipeInput></RecipeInput>) : (<>
        <div className={ProductStyle["content-container"]}>
            <div className={ProductStyle["append-menu-item"]}>
                <div className={staticStyles["info-box"]}>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>Yeni ürün eklemek için sağ tarafta bulunan butonu kullanabilirsiniz. Düzenleme ve silme işlemleri için işlemler kategorisi altındaki butonları kullanabilirsiniz.</p>
                </div>
                <div className={staticStyles["save-button"]}>
                    <button onClick={() => newRecipe()} >Yeni Reçete</button>
                </div>
            </div>
            <div className={staticStyles["table-banner"]}>
                <div className={staticStyles["title"]}> Ürün Listesi </div>
            </div>
            <div className={ProductStyle["product-container"]}>
                <div className={ProductStyle["table-headers"]}>
                    <p>Ürün Adı</p>
                    <p>Kategori</p>
                    <p>İlave Grupları</p>
                    <p>Rapor Etiketleri</p>
                    <p>Vergi Oranı</p>
                    <p>Fiyat</p>
                    <p>Durum</p>
                    <p>İşlemler</p>
                </div>
            </div>
        </div>
        <div className={staticStyles["input-container"]}>
            <h1>Reçete Türü Seçiniz</h1>
            <div id='prep-recipe' onClick={() => chooseRecipeType('prep-recipe')} className={styles["recipe-option"]}>
                <h1>Hazırlık Reçetesi</h1>
                <p>Ürünler içerisinde kullanılan soslar vs için reçete</p>
                <p>Örnek: Pizza Sosu</p>
            </div>

            <div id='product-recipe' onClick={() => chooseRecipeType('product-recipe')} className={styles["recipe-option"]}>
                    <h1>Ürün Reçetesi</h1>
                    <p>Ürünler içerisinde kullanılan soslar vs için reçete</p>
                    <p>Örnek: Pizza</p>
            </div>
            <div className={staticStyles["action-buttons"]}>
                <button onClick={() => closeCreateProduct()} style={{ backgroundColor: "#374151" }}>İptal</button>
                <button onClick={() => setGoInputScreen(true)} >Devam Et</button>
            </div>
        </div></>)}

    </>

}
export default AddRecipe