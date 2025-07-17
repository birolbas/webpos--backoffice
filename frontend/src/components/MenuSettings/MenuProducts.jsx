import { useState } from 'react'
import styles from './MenuProducts.module.css'
function MenuProducts() {
    const [products, setProducts] = useState([])
    return <div className={styles["content-container"]}>
        <div className={styles["append-menu-item"]}>
            <p>Menü Kalemleri</p>
            <button ><i className="bi bi-plus-circle"></i><p>Değişiklikleri Kaydet</p></button>
        </div>

        <div className={styles["table-headers"]}>
            <p>Ürün Adı</p>
            <p>Kategori</p>
            <p>İlave Grupları</p>
            <p>Vergi Oranı</p>
            <p>Fiyat</p>
        </div>

        {products?.map((product, _) => (
            (
                <div className={styles["table-items"]}>
                    <p className={styles["product-name"]}>{product.productName}</p>
                    <p className={styles["product-category"]}>{product.productCategory}</p>
                    <p className={styles["product-condiment-groups"]}>{product.productCondimentGroups}</p>
                    <p className={styles["product-tax-percent"]}>{product.productTaxRate}</p>
                    <p className={styles["price"]}>{product.productPrice}</p>
                    <button><i className="bi bi-three-dots"></i></button>
                </div>
            )
        ))}
        <div className={styles["menu-input"]}>
            <div className={styles["table-input"]}><input type="text" name="" id="" placeholder="Ürün Adı Giriniz" /></div>
            <div className={styles["table-input"]}><input type="text" name="" id="" placeholder="Kategori Giriniz" /></div>
            <div className={styles["table-input"]}><input type="text" name="" id="" placeholder="İlave Grubu Giriniz" /></div>
            <div className={styles["table-input"]}><input type="number" name="" id="" placeholder="Vergi Oranı Giriniz" /></div>
            <div className={styles["table-input"]}><input type="number" name="" id="" placeholder="Fiyat Giriniz" /></div>
            <div className={styles["table-input-save"]}><button><i className="bi bi-check"></i></button> </div>
        </div>
    </div>
}
export default MenuProducts