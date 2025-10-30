import { Link } from 'react-router-dom'
import staticStyles from '../main/StaticStyle.module.css'
import styles from './CondimentProducts.module.css'
import { useEffect, useState } from 'react'

function CondimentGroups() {
    const [savedCondimentGroups, setSavedCondimentGroups] = useState([])
    
    const [condimentGroupId, setCondimentGroupId] = useState(null)
    const [condimentGroupName, setCondimentGroupName] = useState("")
    const [condimentCategories, setCondimentCategories] = useState([])
    
    const [condimentItems, setCondimentItems] = useState([])

    const [isEdit, setIsEdit] = useState(false)
    const [editIndex, setEditIndex] = useState(null)
     useEffect(() => {
        console.log("savedCondimentGroups", savedCondimentGroups)
    }, [savedCondimentGroups])

    const saveToDB = async () => {
        const obj = {
            groupName: condimentGroupName,
            condimentCategories: condimentCategories
        }
        const response = await fetch("http://localhost:5000/saveCondimentGroups", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        })
        console.log(response)
    }
    const saveEditedToDB = async () => {
        const obj = {
            id: condimentGroupId,
            groupName: condimentGroupName,
            condimentCategories: condimentCategories
        }
        const response = await fetch("http://localhost:5000/saveEditedCondimentGroups", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        })
        if(response.ok){
            setIsEdit(false)
            const tempCondiments = [...savedCondimentGroups]
            tempCondiments[editIndex].name = condimentGroupName
            tempCondiments[editIndex].items = condimentCategories
            setSavedCondimentGroups(tempCondiments)
            setEditIndex(null)
            setCondimentGroupId(null)
            setCondimentGroupName("")
            setCondimentCategories([])
        }
    }
    const getFromDB = async () => {
        const response = await fetch("http://localhost:5000/getCondimentGroups")
        const data = await response.json()
        console.log("data is", data)
        const groupedCondimentItems = data?.combo_items.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = []
            }
            acc[item.category].push(item)
            return acc
        }, {})
        setCondimentItems(groupedCondimentItems)
        setSavedCondimentGroups(data.combo_groups)
    }

    const deleteFromDb = async (dbID, index) => {
        const response = await fetch("http://localhost:5000/deleteCondimentGroups", {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: dbID
        })
        if(response.ok){
            const tempSavedGroups = [...savedCondimentGroups]
            tempSavedGroups.splice(index, 1)
            setSavedCondimentGroups(tempSavedGroups)
        }
    }

    useEffect(() => {
        getFromDB()
    }, [])

    function changeCondimentGroupName(name, categoryIndex) {
        const tempItems = [...condimentCategories]
        tempItems[categoryIndex].name = name
        setCondimentCategories(tempItems)
    }
    function appendNewCategory() {
        const tempCate = [...condimentCategories]
        const obj = {
            name: "",
            mustChoose: true,
            items: []
        }
        tempCate.push(obj)
        setCondimentCategories(tempCate)
    }
    useEffect(() => {
        console.log(condimentCategories)
    }, [condimentCategories])

    function clearChosenGroup(){
        setCondimentGroupName("")
        setCondimentCategories([])
        setIsEdit(false)
    }

    function editCondimentGroup(item, editIndx){
        setIsEdit(true)
        setEditIndex(editIndx)
        setCondimentGroupId(item.id)
        setCondimentCategories(item.items)
        setCondimentGroupName(item.name )
    }

    function deleteItemInGroup(categoryIndex, categoryItemIndex){
        const tempCondimentCategories = [...condimentCategories]
        tempCondimentCategories[categoryIndex].items.splice(categoryItemIndex, 1)
        setCondimentCategories(tempCondimentCategories)
    }

    function deleteCondimentCategory(categoryIndex) {
        console.log("Gerçek silinen index:", categoryIndex)
        console.log("Silinmeden önce:", condimentCategories)

        setCondimentCategories(prevCategories => {
            const newCategories = [...prevCategories]
            newCategories.splice(categoryIndex, 1)
            console.log("Silindikten sonra:", newCategories)
            return newCategories
        })
    }
    function handleDragStart(e) {
        const itemIndex = e.target.dataset
        e.dataTransfer.setData("itemIndex", JSON.stringify(itemIndex))

    }
    function handleDragOver(e) {
        e.preventDefault()
    }
    function handleDrop(e) {
        e.preventDefault()
        const data = JSON.parse(e.dataTransfer.getData("itemIndex"))
        const itemGroup = data.itemgroupindex
        const itemIndex = data.itemindex
        console.log(condimentItems)
        const item = condimentItems[itemGroup][itemIndex]
        console.log("item", item)
        const condimentCategory = (e.currentTarget.dataset.categoryindex)
        const tempCondiment = [...condimentCategories]
        const obj = {
            id: item.id,
            name: item.name,
            price: item.price
        }
        tempCondiment[condimentCategory].items.push(obj)
        setCondimentCategories(tempCondiment)
    }

    return <div className={staticStyles["content-container"]}>
        <div className={styles["append-menu-item"]}>
            <div className={staticStyles["info-box"]}>
                <h1>İlave Grup Ekleme</h1>
            </div>
            <div className={staticStyles["save-button"]}>
                <button onClick={() => {isEdit ? clearChosenGroup() : saveToDB()}} >Yeni İlave Grup</button>
                {isEdit ? (
                    <button style={{backgroundColor:"#4F46E5"}} onClick={() => saveEditedToDB()} >{isEdit ? "Düzenlenmiş İlave Grubu Kaydet":"Yeni İlave Grup"}</button>
                ):""}
            </div>
        </div>
        <div className={styles["page-split"]} >
            <div style={{width:"70%"}} className={staticStyles["table-container"]}>
                <h1>Yeni İlave Grup Oluştur</h1>
                <div className={styles["name-input"]}>
                    <label htmlFor="">İlave Grup Adı</label>
                    <input value={condimentGroupName} onChange={(e) => setCondimentGroupName(e.target.value)} type="text" />
                </div>
                <div>
                    <h1>Gruplar ve Ürünler</h1>
                    <div className={styles["choice-groups"]}>
                        {condimentCategories.map((category, categoryIndex) => (
                            <div key={`categoryIndex ${categoryIndex}`} className={styles["choice-group"]}>
                                <div className={styles["group-infos"]}>
                                    <div className={styles["name-input"]}>
                                        <label htmlFor="">Grup Adı</label>
                                        <input value={category.name} onChange={(e) => changeCondimentGroupName(e.target.value, categoryIndex)} style={{ width: "20%", height: "1rem" }} type="text" name="" id="" />
                                    </div>
                                    <div className={styles["must-choose"]}>
                                        <label htmlFor="">Zorunlu Seçim</label>
                                        <select  name="" id="">
                                            <option value="">Zorunlu</option>
                                            <option value="">Zorunlu Değil</option>
                                        </select>
                                    </div>
                                    <div onClick={() => deleteCondimentCategory(categoryIndex)} className={styles["delete-group"]}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                        </svg>
                                    </div>
                                </div>
                                <div id={`category ${categoryIndex}`} data-categoryIndex={categoryIndex} onDrop={handleDrop} onDragOver={handleDragOver} className={styles["items-in-group"]}>
                                    {category?.items.length > 0 ?
                                        category?.items.map((item, categoryItemIndex) => (
                                            <div className={styles["item-in-group"]}>
                                                <div className={styles["item-in-group-info"]}>
                                                    <p style={{ marginRight: "2rem" }}>{item.name} </p>
                                                    <p>{item.price}₺</p>
                                                </div>
                                                <div onClick={()=>deleteItemInGroup(categoryIndex, categoryItemIndex)} className={styles["delete-item-in-group"]}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                                    </svg>
                                                </div>

                                            </div>
                                        ))
                                        :
                                        <p>Ürünlerinizi sağ taraftan taşıyabilirsiniz.</p>}

                                </div>
                            </div>
                        ))}
                    </div>
                    <div onClick={() => appendNewCategory()} className={styles["category-inputs"]}>
                        <button className={styles["add-new-group-button"]}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                            </svg><p>Yeni Grup Ekle</p>
                        </button>
                    </div>
                </div>
            </div>

            <div  style={{width:"30%"}} className={staticStyles["table-container"]}>
                <h1>İlave Grup Ürünleri</h1>
                <Link style={{ display: "flex" }} to="/ilave-grupları/ilave-oluştur" className={staticStyles["purple-button"]}>Yeni Ürün Oluştur</Link>
                <div className={styles["condiment-items"]}>
                    {Object.entries(condimentItems)?.map((group, groupIndex) => (
                        <div className={styles["condiment-group"]}>
                            <p className={styles["condiment-group-header"]}>{group[0]}</p>
                            <div className={styles["group-items"]}>
                                {group[1].map((item, itemIndex) => (
                                    <div data-itemGroupIndex={group[0]} data-itemIndex={itemIndex} draggable="true" onDragStart={handleDragStart} className={styles["group-item"]}>
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
                                                <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className={styles["group-items-name"]}>{item.name}</p>
                                            <p className={styles["group-items-price"]}>{item.price} </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <div>
            </div>
        </div>
        <div className={styles["saved-condiment-groups-container"]}>
            {savedCondimentGroups.map((condiment, index) => (
                <div className={styles["saved-condiment-group"]}>
                    <div className={styles["saved-condiment-group-headers"]}>
                        <h1>{condiment.name}</h1>
                        <div className={styles["delete-edit-saved-condiment"]}>
                            <svg onClick={()=>editCondimentGroup(condiment, index)} style={{color:"aquamarine"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                            <svg onClick={()=>deleteFromDb(condiment.id, index)} style={{color:"red"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>

                        </div>
                    </div>
                    <div className={styles["saved-condiment-categories"]}>
                        {condiment.items.map((item, _)=>(
                            <div className={styles["saved-condiment-categorie"]}>
                                <div className={styles["saved-condiment-info"]}>
                                    <p>{item.name}</p>
                                    <p>{item.mustChoose ? "(Zorunlu Seçim)" : "(Zorunlu Değil)"}</p>

                                </div>
                                <div className={styles["item-length"]}>
                                    <p>{condiment.items.length} Ürün Seçeneği</p>
                                </div>
                            </div>
                            
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
}
export default CondimentGroups