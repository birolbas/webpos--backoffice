import { useState, useEffect, use } from 'react'
import styles from './MenuProducts.module.css'
import staticStyles from '../main/StaticStyle.module.css'
function MenuProducts() {
    const [products, setProducts] = useState([])
    const [staticProducts, setStaticProducts] = useState([])
    const [taxes, setTaxes] = useState([])
    const [categories, setCategories] = useState([])
    const [isNewProduct, setIsNewProduct] = useState(true)
    const [editIndex, setEditIndex] = useState(0)
    const [condimentGroups, setCondimentGroups] = useState([])
    const [recipes, setRecipes] = useState([])
    const [stockCategories, setStockCategories] = useState([])

    const [newInputBox, setNewInputBox] = useState(false)

    const [productId, setProductId] = useState(null)
    const [productName, setProductName] = useState("")
    const [productActiveness, setProductActiveness] = useState(true)
    const [productPrice, setProductPrice] = useState("")
    const [productTax, setProductTax] = useState("")
    const [productCategory, setProductCategory] = useState("")
    const [productCondiment, setProductCondiment] = useState(null)
    const [productRecipe, setProductRecipe] = useState(null)
    const [productStockCategory, setProductStockCategory] = useState(null)
    const [productPrint, setProductPrint] = useState(null)

    const [isNameFilterOn, setIsNameFilterOn] = useState(false)
    const [isPriceFilterOn, setIsPriceFilterOn] = useState(false)
    const [isPriceSortDesc, setIsPriceDesc] = useState(null)
    const clearProductFields = () => {
        setProductId(null)
        setProductName("")
        setProductActiveness(true)
        setProductPrice("")
        setProductTax("")
        setProductCategory("")
        setProductCondiment(null)
        setProductRecipe(null)
        setProductStockCategory(null)
        setProductPrint("");
    }

    const getProducts = async () => {
        const response = await fetch("http://localhost:5000/getProducts")
        const data = await response.json()
        console.log("asdfasdf", data)

        const tempCate = data.categories.filter(dc => dc.parent_id != null)
        data.categories.forEach((cat, index) => {
            if (cat.parent_id == null) {
                const existingIndex = data.categories.findIndex(dc => dc.parent_id == cat.id)
                console.log("existing index", existingIndex)
                if (existingIndex == -1) {
                    tempCate.push(cat)
                }
            }
        })
        console.log("tempcategoryies", tempCate)
        setCondimentGroups(data.condiments)
        setCategories(tempCate)
        console.log("asdasd", data.recipes)
        setTaxes(data.taxes)
        setRecipes(data.recipes)
        setProducts(data.products)
        setStaticProducts(data.products)
        setStockCategories(data.stockCategories)

    }
    useEffect(() => {
        getProducts()
    }, [])

    useEffect(() => {
        console.log("productprint", productPrint)
    }, [productPrint])
    const deleteProduct = async (dbIndex, uiIndex) => {
        const response = await fetch("http://localhost:5000/deleteProduct", {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: dbIndex
        })
        console.log(response)
        if (response.ok) {
            const newProducts = [...products]
            newProducts.splice(uiIndex, 1)
            setProducts(newProducts)
        }

    }
    useEffect(() => {
        console.log("productCondiment", productCondiment)
    }, [productCondiment])
    const setDataToDB = async () => {
        if (productName && productCategory && productTax && productPrice && productActiveness) {
            const newProduct = {
                name: productName,
                activeness: productActiveness,
                price: productPrice,
                tax_id: parseInt(productTax),
                tax_name: taxes.find(t => t.id == productTax).taxid,
                tax_percent: taxes.find(t => t.id == productTax).taxpercent,
                category_id: parseInt(productCategory),
                category_name: categories.find(c => c.id == productCategory).name,
                condiment_id: parseInt(productCondiment) || null,
                relatedrecipe_id: parseInt(productRecipe) || null,
                stockcategory_id: parseInt(productStockCategory) || null,
                printOption: productPrint || null,
            }
            console.log("3131", categories.find(c => c.id = productCategory))
            const response = await fetch("http://localhost:5000/saveProducts", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct)
            })
            if (response.ok) {
                const id = await response.json()
                console.log("id", id[0].id)
                newProduct.id = id[0].id
                const newProducts = [...products]
                newProducts.push(newProduct)
                setProducts(newProducts)
                setNewInputBox(false)
                clearProductFields()
            }
        }
    }
    const saveEditedProductToDB = async () => {

        if (productName && productCategory && productTax && productPrice) {
            console.log("asdasdfsadf")

            const obj = {
                name: productName,
                activeness: productActiveness,
                price: productPrice,
                tax_id: parseInt(productTax),
                tax_name: taxes.find(t => t.id == productTax).taxid,
                tax_percent: taxes.find(t => t.id == productTax).taxpercent,
                category_id: parseInt(productCategory),
                category_name: categories.find(c => c.id = productCategory).name,
                condiment_id: parseInt(productCondiment) || null,
                relatedrecipe_id: parseInt(productRecipe) || null,
                stockcategory_id: parseInt(productStockCategory) || null,
                printOption: productPrint || null,
            }
            const response = await fetch("http://localhost:5000/saveEditedProduct", {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj)
            })
            if (response.ok) {
                console.log("ok")
                const tempProducts = [...products]
                tempProducts[editIndex] = obj
                setProducts(tempProducts)
            }
        }
    }



    useEffect(() => {
        console.log("products", products)
    }, [products])

    useEffect(() => {
        console.log(productRecipe)
    }, [productRecipe])
    function editProduct(index) {
        setIsNewProduct(false)
        setNewInputBox(true)
        const productToEdit = products[index]
        console.log("prdocuttoedit", productToEdit)
        setProductId(productToEdit.id)
        setProductName(productToEdit.name)
        setProductActiveness(productToEdit.activeness)
        setProductPrice(productToEdit.price)
        setProductTax(productToEdit.tax_id)
        setProductCategory(productToEdit.category_id)
        setProductCondiment(productToEdit.condiment_id)
        setProductRecipe(productToEdit.related_recipe_id)
        setProductStockCategory(productToEdit.stock_category_id)
        setEditIndex(index)
    }
    function filterByPrice() {
        let tempSorted = []
        if (isNameFilterOn) {
            tempSorted = [...products]
        } else {
            tempSorted = [...staticProducts]
        }
        if (isPriceSortDesc) {
            tempSorted = [...tempSorted].sort((a, b) => a.price - b.price)
            setIsPriceDesc(false)
        } else {
            tempSorted = [...tempSorted].sort((a, b) => b.price - a.price)
            setIsPriceDesc(true)
        }
        setProducts(tempSorted)
        setIsPriceFilterOn(true)
    }

    function filterByName(nameinput) {
        let filtered = []
        if (isPriceFilterOn) {
            filtered = [...products]
        } else {
            filtered = [...staticProducts]
        }
        if (nameinput && nameinput.trim() !== "") {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(nameinput.toLowerCase())
            )
        }
        setProducts(filtered);
        if (nameinput.length > 0) {
            setIsNameFilterOn(true)
        } else {
            setIsNameFilterOn(false)
        }
    }


    return <div className={staticStyles["content-container"]}>
        <div className={styles["append-menu-item"]}>
            <h1>Ürün Listesi</h1>
            <div className={staticStyles["save-button"]}>
                <button onClick={() => { setNewInputBox(true); clearProductFields(); setIsNewProduct(true) }} >Yeni Ürün</button>
            </div>
        </div>
        <div className={staticStyles["filter-by-name"]}>
            <div className={staticStyles["filter-fake-input"]}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
                <input onChange={(e) => filterByName(e.target.value)} placeholder='İsime göre ara..' type="text" name="" id="" />
            </div>
        </div>
        <div className={staticStyles["table-container"]}>
            <div style={{ gridTemplateColumns: "1.3fr 1fr 1fr 1fr 0.75fr 0.75fr .5fr 0.5fr 0.5fr" }} className={staticStyles["table-header-style"]}>
                <p>Ürün Adı</p>
                <p>Kategori</p>
                <p>Reçete - Stok Kartı</p>
                <p>İlave Grupları</p>
                <p>Rapor Etiketleri</p>
                <p>Vergi Oranı</p>
                <p onClick={() => filterByPrice()}>Fiyat
                    {isPriceSortDesc == null ? (
                        ""
                    ) : (isPriceSortDesc ?
                        (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4" />
                        </svg>) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5" />
                            </svg>
                        )
                    )}
                </p>
                <p>Durum</p>
                <p>İşlemler</p>
            </div>
            {products?.map((product, index) => (
                (
                    <div key={index} style={{ gridTemplateColumns: "1.3fr 1fr 1fr 1fr 0.75fr 0.75fr .5fr 0.5fr 0.5fr" }} className={staticStyles["table-item-style"]}>
                        <p className={styles["product-name"]}>{product?.name}</p>
                        <p className={styles["product-category"]}>{product?.category_name}</p>
                        <p> {product.related_recipe_id ? recipes.find(r => r?.id == product?.related_recipe_id)?.name : "-"} </p>
                        <p className={styles["product-condiment-groups"]}>
                            {product.condiment_id ? condimentGroups.find(cG => cG?.id == product?.condiment_id)?.name : "-"}</p>
                        <p className={styles["product-print-group"]}>{product.printGroup}</p>
                        <p className={styles["product-tax-percent"]}>{product.tax_name} {product.tax_percent}% </p>
                        <p className={styles["price"]}>{product.price}₺</p>
                        <p className={product.activeness == true ? styles["status-active"] : styles["status-passive"]}> {product.activeness == true ? "AKTİF" : "Pasif"} </p>
                        <p className={styles["actions"]}>
                            <svg onClick={() => editProduct(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                            <svg onClick={() => deleteProduct(product.id, index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                        </p>
                    </div>
                )
            ))}

        </div>
        {newInputBox ? (
            <div className={staticStyles["input-container"]}>
                <h1>Yeni Ürün Ekle</h1>
                <p>Ürün Adı</p>
                <input value={productName} onChange={(e) => setProductName(e.target.value)} type="text" placeholder="ÜRÜN İSMİ" name="" id="ProductName" />
                <div className={staticStyles["two-form"]}>
                    <div value={productActiveness} className={staticStyles["form"]}  >
                        <p>Aktiflik</p>
                        <select value={productActiveness} onChange={(e) => setProductActiveness(e.target.value === "true")} id="Activeness" required defaultValue="">
                            <option value={true}>Aktif</option>
                            <option value={false}>Pasif</option>
                        </select>
                    </div>
                    <div className={staticStyles["form"]} >
                        <p>Fiyat</p>
                        <input value={productPrice} onChange={(e) => setProductPrice(parseFloat(e.target.value))} type="number" placeholder="ÜRÜN FİYATI" name="" id="ProductPrice" />
                    </div>
                </div>

                <div className={staticStyles["two-form"]}>
                    <div className={staticStyles["form"]}>
                        <p>Vergi Seçeneği</p>
                        <select value={productTax} onChange={(e) => setProductTax(e.target.value)} id="ProductTax" required defaultValue="">
                            <option value="" disabled defaultValue={null} hidden>VERGİ ORANI SEÇİNİZ</option>
                            {taxes?.map((tax, index) => {
                                return <>
                                    <option style={{ color: "white" }} value={tax.id}> {tax.taxpercent}% -{tax.taxid} </option>
                                </>
                            })}
                        </select>
                    </div>
                    <div className={staticStyles["form"]} >
                        <p>Kategori Seçeneği</p>
                        <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)} id="Category" required defaultValue="">
                            <option value="" disabled defaultValue={null} hidden>Kategori Seçiniz</option>
                            {categories?.map((cate, index) => (
                                <option value={cate.id}> {cate.name} </option>
                            ))}
                        </select>
                    </div>

                </div>
                <div className={staticStyles["two-form"]}>
                    <div className={staticStyles["form"]}>
                        <p>Stok Kategorisi</p>
                        <select value={productStockCategory} onChange={(e) => setProductStockCategory(e.target.value)} id="ProductRecipe" required defaultValue="">
                            <option value="" disabled defaultValue={null} hidden>Stok Kartı Seçiniz</option>
                            {stockCategories?.map((stock, index) => {
                                return <>
                                    <option style={{ color: "white" }} value={stock.id}> {stock.name}</option>
                                </>
                            })}
                        </select>
                    </div>
                    <div className={staticStyles["form"]}>
                        <p>Reçete Seçiniz</p>
                        <select value={productRecipe} onChange={(e) => setProductRecipe(e.target.value)} id="ProductRecipe" required defaultValue="">
                            <option value="" disabled defaultValue={null} hidden>Reçete Seçiniz</option>
                            {recipes?.map((recipe, index) => {
                                return <>
                                    <option style={{ color: "white" }} value={recipe.id}> {recipe.name}</option>
                                </>
                            })}
                        </select>
                    </div>

                </div>


                <div className={staticStyles["two-form"]}>
                    <div className={staticStyles["form"]} >
                        <p>Yazdırma Seçeneği</p>
                        <select onChange={(e) => setProductPrint(e.target.value)} id="Category" required defaultValue="">
                            <option value="" disabled defaultValue={null} hidden>YAZDIRMA SEÇENEĞİ SEÇİNİZ</option>
                            <option value="">Yok</option>
                            {categories?.map((cate, index) => (
                                <option value={index}> {cate.name} </option>
                            ))}
                        </select>
                    </div>
                    <div className={staticStyles["form"]}>
                        <p>İlave Grup Ekle</p>
                        <select value={productCondiment} onChange={(e) => setProductCondiment(e.target.value)} id="ProductCondiment" required defaultValue="">
                            <option value="" disabled defaultValue={null} hidden>YAZDIRMA SEÇENEĞİ SEÇİNİZ</option>
                            <option value="">BOŞ</option>
                            {condimentGroups?.map((cate, index) => (
                                <option value={cate.id}> {cate.name} </option>
                            ))}
                        </select>
                    </div>


                </div>
                <div className={staticStyles["action-buttons"]}>
                    <button onClick={() => setNewInputBox(false)} style={{ backgroundColor: "#374151" }}>İptal</button>
                    <button onClick={isNewProduct ? () => setDataToDB() : () => saveEditedProductToDB()} >Kaydet</button>
                </div>
            </div>
        ) : ""}
    </div>

}
export default MenuProducts