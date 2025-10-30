import staticStyles from '../main/StaticStyle.module.css'
import styles from '../MenuSettings/Category.module.css'
import { useEffect, useState } from 'react'
function StockCategories() {

    const [upperCategories, setUpperCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])

    const [isNewCategoryInput, setIsNewCategoryInput] = useState(false)
    const [isNewSubCategoryInput, setIsNewSubCategoryInput] = useState(false)

    const [newSubCategoryIndex, setNewSubCategoryIndex] = useState(0)
    const [newSubCategoryName, setNewSubCategoryName] = useState("")

    const [newUpperCategoryName, setNewUpperCategoryName] = useState("")

    useEffect(() => {
        getCategoriesFromDB()
    }, [])
    const getCategoriesFromDB = async () => {
        const response = await fetch("http://localhost:5000/getStockCategory")
        const data = await response.json()
        console.log("data is ", data)
        const parents = data.filter(d => d.parent_id === null)
        const categories = []
        parents.map((parent, index) => {
            const child = data.filter(d => d.parent_id === parent.id)
            console.log("CHILD IS ", child)
            const obj = {
                id: parent.id,
                name: parent.name,
                subCategories: child.map(c => ({ id: c.id, name: c.name }))
            }
            categories.push(obj)
        })
        console.log("categories", categories)
        setUpperCategories(categories)
    }

    const saveCategoryToDB = async () => {
        var data = {}
        if (isNewCategoryInput) {
            data = {
                isUpperCategory: true,
                name: newUpperCategoryName,
            }
        } else {
            data = {
                isUpperCategory: false,
                name: newSubCategoryName,
                parent_id: newSubCategoryIndex
            }
        }
        const response = await fetch("http://localhost:5000/saveStockCategory", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            const new_id = await response.json()
            const id = new_id.id
            if (isNewCategoryInput) {
                saveUpperCategory(id)
            } else {
                console.log("save sub id ", id)
                saveSubCategory(id)
            }
        }
    }

    function saveUpperCategory(id) {
        const tempCat = [...upperCategories]
        const existingIndex = tempCat.findIndex(t => t.categoryName == newUpperCategoryName)
        console.log("saveUpperCategory", id)
        if (existingIndex == -1) {
            const obj = {
                id: id,
                name: newUpperCategoryName,
                subCategories: []
            }
            console.log("obj", obj)
            tempCat.push(obj)
            setIsNewCategoryInput(false)
            setUpperCategories(tempCat)
        }
    }

    function saveSubCategory(id) {
        const tempUpperCategories = [...upperCategories]
        console.log(tempUpperCategories[newSubCategoryIndex])
        const obj = {
            parent_id: id,
            name: newSubCategoryName,
        }
        console.log("obh", obj)
        tempUpperCategories[newSubCategoryIndex].subCategories.push(obj)
        console.log(tempUpperCategories)
        setUpperCategories(tempUpperCategories)
    }

    function deleteSubFromUpper(e, categoryName, upperIndex, subIndex) {
        const upperCat = [...upperCategories]
        const subCat = [...subCategories]
        const subToDelete = upperCat[upperIndex].subCategories[subIndex]
        subCat.push({ categoryName: subToDelete })
        console.log(subCat)
        upperCat[upperIndex].subCategories.splice(subIndex, 1)
        setSubCategories(subCat)
        setUpperCategories(upperCat)
    }
    function moveUp(upperIndex) {
        const tempList = [...upperCategories]
        if (upperIndex != 0) {
            const tempHolder = tempList[upperIndex - 1]
            tempList[upperIndex - 1] = tempList[upperIndex]
            tempList[upperIndex] = tempHolder
            setUpperCategories(tempList)
        }
    }
    function moveDown(upperIndex) {
        const tempList = [...upperCategories]
        const listLength = tempList.length
        if (upperIndex != listLength - 1) {
            console.log(upperIndex, listLength)
            const tempHolder = tempList[upperIndex + 1]
            tempList[upperIndex + 1] = tempList[upperIndex]
            tempList[upperIndex] = tempHolder
            setUpperCategories(tempList)
        }
    }
    function deleteUpperCategory(upperIndex) {
        const tempUpperList = [...upperCategories]
        const tempSubList = [...subCategories]
        console.log("tempUpperList", tempUpperList[upperIndex])
        tempUpperList[upperIndex].subCategories.forEach((sub, index) => {
            tempSubList.push({ categoryName: sub })
            tempUpperList.splice(index, 1)
            console.log(tempSubList)
            console.log(tempUpperList)
        })
        setUpperCategories(tempUpperList)
        setSubCategories(tempSubList)
    }



    return <div className={staticStyles["content-container"]}>
        <div className={staticStyles["info-container"]}>
            <div className={staticStyles["save-div"]}>
                <div className={staticStyles["info-box"]}>
                    <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>  </p>
                </div>
                <div className={staticStyles["save-button"]}>
                    <button onClick={() => saveCategoryToDB()} >DEĞİŞİKLİKLERİ KAYDET</button>
                    <button onClick={() => setIsNewCategoryInput(true)} className={staticStyles["purple-button"]}>Yeni Kategori</button>
                </div>

            </div>
        </div>
        <div className={staticStyles["table-container"]}>
            <h1>Malzeme Stok Kategorileri</h1>
            <div className={styles["category-container"]}>
                {upperCategories.map((category, upperIndex) => (
                    <div className={styles["category-species"]} >
                        <div className={styles["category"]} >
                            <p>{category.name}</p>
                            <div style={{ display: "flex" }}> <svg onClick={() => { setIsNewSubCategoryInput(true), setNewSubCategoryIndex(category.id) }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                            </svg>
                                <svg onClick={() => moveDown(upperIndex)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4" />
                                </svg>

                                <svg onClick={() => moveUp(upperIndex)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5" />
                                </svg>
                                <svg onClick={() => deleteUpperCategory(upperIndex)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
                            </div>
                        </div>
                        <div className={styles["sub-category-append"]} >
                            {category.subCategories.map((sub, subIndex) => (
                                <div key={subIndex} className={styles["sub-category-under-uppers"]}>
                                    <h4>
                                        {sub.name}
                                    </h4>
                                    <svg onClick={(e) => deleteSubFromUpper(e, category.categoryName, upperIndex, subIndex)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                    </svg>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        {isNewCategoryInput ? (
            <div className={staticStyles["input-container"]}>
                <p>Kategori Ekle</p>
                <input onChange={(e) => setNewUpperCategoryName(e.target.value)} type="text" placeholder="Kategori Adı" name="" />
                <div className={staticStyles["action-buttons"]}>
                    <button
                        style={{ backgroundColor: "#374151" }}
                        onClick={() => { setIsNewCategoryInput(false); setNewSubCategoryName("") }}
                    >
                        İptal
                    </button>
                    <button onClick={() => saveCategoryToDB()}>Kaydet</button>
                </div>
            </div>
        ) : ""
        }
        {isNewSubCategoryInput ? (
            <div className={staticStyles["input-container"]}>
                <p>Alt Kategori Ekle</p>
                <input onChange={(e) => setNewSubCategoryName(e.target.value)} type="text" placeholder="Alt Kategori Adı" name="" />
                <div className={staticStyles["action-buttons"]}>
                    <button
                        style={{ backgroundColor: "#374151" }}
                        onClick={() => { setIsNewSubCategoryInput(false); setNewSubCategoryName("") }}
                    >
                        İptal
                    </button>
                    <button onClick={() => saveCategoryToDB()}>Kaydet</button>
                </div>
            </div>
        ) : ""}
    </div>
}
export default StockCategories