import { useState } from 'react'
import staticStyles from '../main/StaticStyle.module.css'
import styles from './Category.module.css'
function Category() {

    const [upperCategories, setUpperCategories] = useState([{
        categoryName: "üst",
        subCategories: []
    }])
    const [subCategories, setSubCategories] = useState([{
        categoryName: "alt"
    }])
    const [isDragOpen, setIsDragOpen] = useState(false)

    function chooseCategory() {
        const list = document.getElementsByClassName(styles["category-list"])[0].style.display
        if (list == "" || list == "none") {
            document.getElementsByClassName(styles["category-list"])[0].style.display = "block"
        } else {
            document.getElementsByClassName(styles["category-list"])[0].style.display = "none"

        }
    }
    function setNewCategory(e) {
        const category = e.target.innerHTML
        document.getElementsByClassName(styles["category-button"])[0].innerHTML = category
        document.getElementsByClassName(styles["category-list"])[0].style.display = "none"
    }
    function saveCategory() {
        const categoryOption = document.getElementsByClassName(styles["category-button"])[0].innerHTML
        const categoryName = document.getElementById("category-input-name").value
        const errorBox = document.getElementsByClassName(styles["notification-error"])[0]
        if (categoryOption == "Alt ya da üst kategori seçiniz") {
            errorBox.style.backgroundColor = "red"
            errorBox.style.display = "flex"
            errorBox.innerHTML = "Lütfen kategori seçiniz!"
            setTimeout(() => {
                errorBox.style.display = "none"
            }, 2000)
        } else if (categoryName == "") {
            errorBox.style.backgroundColor = "red"
            errorBox.style.display = "flex"
            errorBox.innerHTML = "Lütfen kategori adı giriniz!"
            setTimeout(() => {
                errorBox.style.display = "none"
            }, 2000)
        }

        else if (categoryOption == "Üst Kategori" && categoryName) {
            const object = {
                categoryName: categoryName,
                subCategories: []
            }
            setUpperCategories([...upperCategories, object])
            document.getElementById("category-input-name").value = ""
            errorBox.style.display = "flex"
            errorBox.innerHTML = "Başarıyla eklendi!"
            errorBox.style.backgroundColor = "green"

            setTimeout(() => {
                errorBox.style.display = "none"
            }, 2000)

        } else if (categoryOption == "Alt Kategori" && categoryName) {
            const object = {
                categoryName: categoryName
            }
            setSubCategories([...subCategories, object])
            document.getElementById("category-input-name").value = ""
            errorBox.style.display = "flex"
            errorBox.innerHTML = "Başarıyla eklendi!"
            errorBox.style.backgroundColor = "green"
            setTimeout(() => {
                errorBox.style.display = "none"
            }, 2000)
        }

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
    function handleDragStart(e, index) {
        e.dataTransfer.setData("subcategory", e.target.textContent)
        e.dataTransfer.setData("index", index)

    }
    function handleDragOver(e) {
        e.preventDefault()

    }
    function handleDragDrop(e, index) {
        e.preventDefault()
        console.log(e)
        const dataName = e.dataTransfer.getData("subcategory")
        if (dataName) {
            const dataIndex = e.dataTransfer.getData("index")
            const upperCate = [...upperCategories]
            upperCate[index].subCategories.push(dataName)
            console.log(upperCate)
            setUpperCategories(upperCate)
            const subCate = [...subCategories]
            subCate.splice(dataIndex, 1)
            setSubCategories(subCate)
        }
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
    function deleteUpperCategory(upperIndex){
        const tempUpperList = [...upperCategories]
        const tempSubList = [...subCategories]
        tempUpperList[upperIndex].subCategories.forEach((sub, index)=>{
            tempSubList.push({categoryName: sub})
            tempUpperList.splice(index, 1)
            console.log(tempSubList)
            console.log(tempUpperList)
        })
        setUpperCategories(tempUpperList)
        setSubCategories(tempSubList)
    }


    return <><div className={staticStyles["content-container"]}>
        <div className={staticStyles["info-container"]}>
            <div className={staticStyles["save-div"]}>
                <div className={staticStyles["info-box"]}>
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                        </svg>Yeni kategori ekleyebilir, alt kategoriler ekleyerek daha spesifik gruplandırma yapabilirisiniz. </p>
                </div>
                <div className={staticStyles["save-button"]}>
                    <button>DEĞİŞİKLİKLERİ KAYDET</button>
                </div>
            </div>
            <div className={styles["category-input-container"]}>
                <div className={styles["category-input-option"]} >
                    <p>Kategori Seçeneği</p>
                    <button className={styles["category-button"]} onClick={() => chooseCategory()}>Alt ya da üst kategori seçiniz</button>
                    <ul className={styles["category-list"]}>
                        <li onClick={(e) => setNewCategory(e)}>Alt Kategori</li>
                        <li onClick={(e) => setNewCategory(e)}>Üst Kategori</li>
                    </ul>
                </div>
                <div className={styles["category-input-name"]}>
                    <p>Kategori ismi</p>
                    <input type="text" name="" id="category-input-name" />
                    <button onClick={() => saveCategory()} className={styles["add-category"]} >Kategoriyi Ekle</button>
                </div>
            </div>
            <div className={styles["category-container"]}>
                <div className={styles["upper-category-container"]}>
                    <h1>Üst Kategoriler</h1>
                    <div className={styles["categories"]}>
                        {upperCategories.map((category, upperIndex) => (
                            <div onDrop={(e) => handleDragDrop(e, upperIndex)} onDragOver={handleDragOver} className={styles["category-species"]} >
                                <div className={styles["category"]} >
                                    <p>{category.categoryName}</p>
                                    <div style={{ display: "flex" }}><svg onClick={() => moveDown(upperIndex)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
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
                                                {sub}
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
                <div className={styles["sub-category-container"]}>
                    <h1>Eşleştirilmemiş Alt Kategoriler</h1>
                    <div className={styles["categories"]}>
                        {subCategories.map((category, index) => (
                            <div draggable="true" onDragStart={(e) => handleDragStart(e, index)} className={styles["category"]}>
                                <p>{category.categoryName}</p>
                                <svg onClick={(e) => deleteSubFromUpper(e)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                </svg>
                            </div>
                        ))}

                    </div>

                </div>

            </div>
        </div>
    </div>
        <div className={styles["notification-error"]} >Lütfen kategori adını giriniz!</div></>
}
export default Category