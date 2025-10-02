import { useState, useEffect } from 'react'
import styles from './MenuProducts.module.css'
import staticStyles from '../main/StaticStyle.module.css'
function MenuProducts() {
    const [products, setProducts] = useState([])
    const [taxes, setTaxes] = useState([])
    const [categories, setCategories] = useState([])
    const [isNewProduct, setIsNewProduct] = useState(true)
    const [editIndex, setEditIndex] = useState(0)
    const [condimentGroups, setCondimentGroups] = useState([])
    const [recipes, setRecipes] = useState([])
    const otherFetches = async () => {
        const response = await fetch("http://localhost:5000/getCategoryTax")
        const data = await response.json()
        console.log("data is ", data)
        const tempCate = data[0][0]
        const chosableCategories = []
        console.log("tempcate", tempCate)
        tempCate.forEach((cate, index) => {
            if (cate.subCategories.length == 0) {
                chosableCategories.push(cate.categoryName)
            } else {
                cate.subCategories.forEach((sub, _) => {
                    chosableCategories.push(sub)
                })
            }
        })
        const CondimentalsResponse = await fetch("http://localhost:5000/getCondimentGroups")
        const Condimentals = await CondimentalsResponse.json()
        console.log("Condimentals", Condimentals)
        setCondimentGroups(Condimentals)
        console.log("chosableCategories", chosableCategories)
        setCategories(chosableCategories)
        setTaxes(data[0][1])
        const RecipesResponse = await fetch("http://localhost:5000/getRecipes")
        const Recipes = await RecipesResponse.json()
        console.log("recieps", Recipes)
        setRecipes(Recipes)

    }
    const getProducts = async () => {
        const response = await fetch("http://localhost:5000/getProducts")
        const data = await response.json()
        console.log(data)
        if (data[0][0].length > 0) {
            setProducts(data[0][0])
        }
    }
    useEffect(() => {
        otherFetches()
        getProducts()
    }, [])

    useEffect(() => {
        console.log("isnew", isNewProduct)
    }, [isNewProduct])


    const setDataToDB = async (updatedProducts) => {
        const response = await fetch("http://localhost:5000/saveProducts", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProducts)
        })
        console.log(response)
    }


    function closeCreateProduct() {
        document.getElementsByClassName(staticStyles["input-container"])[0].style.display = "none"
    }

    function createTax(isEdit) {
        document.getElementsByClassName(staticStyles["input-container"])[0].style.display = "flex"
        if (isEdit) {
            setIsNewProduct(false)
        } else
            setIsNewProduct(true)
    }

    function saveProduct() {
        const tempProducts = [...products]
        const name = document.getElementById("ProductName").value
        const activeness = document.getElementById("Activeness").value
        const price = document.getElementById("ProductPrice").value
        const tax = taxes[document.getElementById("ProductTax").value]
        const category = categories[document.getElementById("Category").value]
        console.log("sad", document.getElementById("ProductCondiment"))
        const condiment = condimentGroups[document.getElementById("ProductCondiment").value]
        const relatedRecipe = recipes[document.getElementById("ProductRecipe").value]
        console.log("reltated recipe", relatedRecipe)
        const newProduct = {
            name: name,
            activeness: activeness,
            price: price,
            tax: tax,
            category: category,
            condiment: condiment,
            relatedRecipe: relatedRecipe
        }
        var isSpecMissing = false
        Object.keys(newProduct).forEach(key => {
            if (newProduct[key]?.length == 0) {
                isSpecMissing = true
            }
        })
        if (isSpecMissing) {
            console.log("raise error here")
        } else {
            tempProducts.push(newProduct)
            setProducts(tempProducts)
            closeCreateProduct()
            setDataToDB(tempProducts)

        }
    }
    function editProduct(index) {
        createTax(true)
        const categoryIndex = categories.findIndex(c => c === products[index].category) + 1
        const tax = products[index].tax.taxId
        const taxIndex = taxes.findIndex(t => t.taxId == tax) + 1
        document.getElementById("ProductName").value = products[index].name
        document.getElementById("Activeness").value = products[index].activeness
        document.getElementById("ProductPrice").value = products[index].price
        document.getElementById("Category").options.selectedIndex = categoryIndex
        document.getElementById("ProductTax").options.selectedIndex = taxIndex
        document.getElementById("ProductCondiment").value = products[index].condiment
        console.log(taxes)
        setEditIndex(index)
    }
    function deleteProduct(index) {
        const tempProducts = [...products]
        tempProducts.splice(index, 1)
        setDataToDB(tempProducts)
        setProducts(tempProducts)

    }
    function saveEditedProduct() {
        const name = document.getElementById("ProductName").value
        const activeness = document.getElementById("Activeness").value
        const price = document.getElementById("ProductPrice").value
        const tax = taxes[document.getElementById("ProductTax").value]
        const category = categories[document.getElementById("Category").value]
        const condiment = condimentGroups[document.getElementById("ProductCondiment").value]
        const relatedRecipe = recipes[document.getElementById("ProductRecipe").value]
        console.log("relatedrecipe",document.getElementById("ProductRecipe").value)
        const editedProduct = {
            name: name,
            activeness: activeness,
            price: price,
            tax: tax,
            category: category,
            condiment: condiment,
            relatedRecipe: relatedRecipe
        }
        const tempProducts = [...products]
        tempProducts[editIndex] = editedProduct
        console.log("tempCat", tempProducts)
        setProducts(tempProducts)
        setDataToDB(tempProducts)
        closeCreateProduct()

    }
    return <div className={staticStyles["content-container"]}>
        <div className={styles["append-menu-item"]}>
            <div className={staticStyles["info-box"]}>
                <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                </svg>Yeni ürün eklemek için sağ tarafta bulunan butonu kullanabilirsiniz. Düzenleme ve silme işlemleri için işlemler kategorisi altındaki butonları kullanabilirsiniz.</p>
            </div>
            <div className={staticStyles["save-button"]}>
                <button onClick={() => createTax(false)} >Yeni Ürün</button>
            </div>
        </div>
        <div className={staticStyles["table-banner"]}>
            <div className={staticStyles["title"]}> Ürün Listesi </div>
        </div>
        <div className={staticStyles["table-container"]}>
            <div style={{ gridTemplateColumns: "1.3fr 1fr 1fr 1fr 0.75fr 0.75fr .5fr 0.5fr 0.5fr" }} className={staticStyles["table-header-style"]}>
                <p>Ürün Adı</p>
                <p>Kategori</p>
                <p>Bağlı Reçete</p>
                <p>İlave Grupları</p>
                <p>Rapor Etiketleri</p>
                <p>Vergi Oranı</p>
                <p>Fiyat</p>
                <p>Durum</p>
                <p>İşlemler</p>
            </div>

            {products?.map((product, index) => (
                (
                    <div key={index} style={{ gridTemplateColumns: "1.3fr 1fr 1fr 1fr 0.75fr 0.75fr .5fr 0.5fr 0.5fr" }} className={staticStyles["table-item-style"]}>
                        <p className={styles["product-name"]}>{product?.name}</p>
                        <p className={styles["product-category"]}>{product.category}</p>
                        <p> {product.relatedRecipe?.recipename} </p>
                        <p className={styles["product-condiment-groups"]}>{product.condiment?.name}</p>
                        <p className={styles["product-print-group"]}>{product.printGroup}</p>
                        <p className={styles["product-tax-percent"]}>{product.tax?.taxId} {product.tax?.taxPercent}% </p>
                        <p className={styles["price"]}>{product.price}₺</p>
                        <p className={product.activeness == "Active" ? styles["status-active"] : styles["status-passive"]}> {product.activeness} </p>
                        <p className={styles["actions"]}>
                            <svg onClick={() => editProduct(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                            <svg onClick={() => deleteProduct(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                        </p>
                    </div>
                )
            ))}

        </div>
        <div className={staticStyles["input-container"]}>
            <h1>Yeni Ürün Ekle</h1>
            <p>Ürün Adı</p>
            <input type="text" placeholder="ÜRÜN İSMİ" name="" id="ProductName" />
            <div className={staticStyles["two-form"]}>
                <div className={staticStyles["form"]}  >
                    <p>Aktiflik</p>
                    <select id="Activeness" required defaultValue="">
                        <option value="Active">Aktif</option>
                        <option value="Passive">Pasif</option>
                    </select>
                </div>
                <div className={staticStyles["form"]} >
                    <p>Fiyat</p>
                    <input type="number" placeholder="ÜRÜN FİYATI" name="" id="ProductPrice" />
                </div>
            </div>

            <div className={staticStyles["two-form"]}>
                <div className={staticStyles["form"]}>
                    <p>Vergi Seçeneği</p>
                    <select id="ProductTax" required defaultValue="">
                        <option value="" disabled selected hidden>VERGİ ORANI SEÇİNİZ</option>
                        {taxes?.map((tax, index) => {
                            return <>
                                <option style={{ color: "white" }} value={index}> {tax.taxPercent}% -{tax.taxId} </option>
                            </>
                        })}
                    </select>
                </div>
                <div className={staticStyles["form"]} >
                    <p>Kategori Seçeneği</p>
                    <select id="Category" required defaultValue="">
                        <option value="" disabled selected hidden>Kategori Seçiniz</option>
                        {categories?.map((cate, index) => (
                            <option value={index}> {cate} </option>
                        ))}
                    </select>
                </div>

            </div>
            <div className={staticStyles["two-form"]}>
                <div className={staticStyles["form"]}>
                    <p>Reçete Bağla</p>
                    <select id="ProductRecipe" required defaultValue="">
                        <option value="" disabled selected hidden>Reçete Seçiniz</option>
                        {recipes?.map((recipe, index) => {
                            return <>
                                <option style={{ color: "white" }} value={index}> {recipe.recipename}</option>
                            </>
                        })}
                    </select>
                </div>

            </div>
            <div className={staticStyles["two-form"]}>
                <div className={staticStyles["form"]} >
                    <p>Yazdırma Seçeneği</p>
                    <select id="Category" required defaultValue="">
                        <option value="" disabled selected hidden>YAZDIRMA SEÇENEĞİ SEÇİNİZ</option>
                        {categories?.map((cate, index) => (
                            <option value={index}> {cate} </option>
                        ))}
                    </select>
                </div>
                <div className={staticStyles["form"]}>
                    <p>İlave Grup Ekle</p>
                    <select id="ProductCondiment" required defaultValue="">
                        <option value="" disabled selected hidden>YAZDIRMA SEÇENEĞİ SEÇİNİZ</option>
                        <option value={"BOŞ"}> BOŞ </option>
                        {condimentGroups?.map((cate, index) => (
                            <option value={index}> {cate.name} </option>
                        ))}
                    </select>
                </div>


            </div>
            <div className={staticStyles["action-buttons"]}>
                <button onClick={() => closeCreateProduct()} style={{ backgroundColor: "#374151" }}>İptal</button>
                <button onClick={isNewProduct ? () => saveProduct() : () => saveEditedProduct()} >Kaydet</button>
            </div>
        </div>
    </div>

}
export default MenuProducts