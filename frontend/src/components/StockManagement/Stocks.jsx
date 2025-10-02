import staticStyles from '../main/StaticStyle.module.css'
import styles from './Stocks.module.css'
import topBarStyle from '../MenuSettings/CondimentProducts.module.css'
function Stocks() {
    return <div className={staticStyles["content-container"]}>
        <div className={topBarStyle["append-menu-item"]} >
            <div className={staticStyles["info-box"]}>
                <h1>Stok Ürünleri</h1>
            </div>
            <div className={staticStyles["save-button"]}>
                <button onClick={() => saveToDB()}>Değişiklikleri Kaydet</button>
                <button onClick={() => setIsInput(!isInput)} className={staticStyles["purple-button"]}>Yeni Ürün Ekle</button>
            </div>
        </div>
        <div className={staticStyles["table-container"]} >
            <div>
            <input className={staticStyles["table-filter-input"]} placeholder='Ürün Arayınız' type="text" />

            </div>
            <h1>Ürün Kataloğu</h1>
            <div style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr 0.5fr 0.5fr 0.5fr" }} className={staticStyles["table-header-style"]}>
                <p>Ürün Adı</p>
                <p>Kategori</p>
                <p>Stoktaki Miktar</p>
                <p>Kritik Stok Kontrolü</p>
                <p>Birim</p>
                <p>Durum</p>
                <p>İşlemler</p>
            </div>
                <div style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr 0.5fr 0.5fr 0.5fr" }} className={staticStyles["table-item-style"]}>
                    <p>recipe.name</p>
                    <p>recipe.category</p>
                    <p>recipe.stock</p>
                    <p>recipe.stockcgheck</p>
                    <p>recipe.unit</p>
                    <p>recipe.status</p>
                    <p className={styles["actions"]}>
                        <svg onClick={() => editRecipe(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                        <svg onClick={() => deleteRecipe(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </p>
                </div>
        </div>
    </div>
}
export default Stocks