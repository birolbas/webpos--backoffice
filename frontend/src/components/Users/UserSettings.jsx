import styles from '../GeneralSettings/CancelReturnReasons.module.css'
import staticStyles from '../main/StaticStyle.module.css'
import { useEffect, useState } from 'react'

function UserSettings() {
    const [users, setUsers] = useState([])

    const [isInputBox, setIsInputBox] = useState(false)
    const [isNewUser, setIsNewUser] = useState(true)

    const [editIndex, setEditIndex] = useState(null)

    const [userId, setUserId] = useState(null)
    const [userName, setUserName] = useState("")
    const [userMail, setUserMail] = useState("")
    const [userRole, setUserRole] = useState("")
    const [userTel, setUserTel] = useState("")
    const [userPin, setUserPin] = useState(0)
    const [isActive, setIsActive] = useState(true)

    const saveEditedUser = async () => {
        if (userName) {
            console.log("asd")
            const obj = {
                id: userId,
                name: userName,
                e_mail: userMail,
                pin: userPin,
                role: userRole,
                activeness: isActive,
                phone: userTel,
            }
            try {
                const response = await fetch("http://localhost:5000/saveEditedUser", {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(obj)
                })
                console.log(response)
                if (response.ok) {
                    const tempDiscounts = [...users]
                    tempDiscounts[editIndex].name = userName
                    tempDiscounts[editIndex].e_mail = userMail
                    tempDiscounts[editIndex].pin = userPin
                    tempDiscounts[editIndex].role = userRole
                    tempDiscounts[editIndex].activeness = isActive
                    tempDiscounts[editIndex].phone = userTel
                    setUsers(tempDiscounts)
                    setUserId(null)
                    setUserName("")
                    setIsCancel(true)
                    setIsActive(null)
                    setIsInputBox(false)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    useEffect(() => {
        getFromDB()
    }, [])

    const getFromDB = async () => {
        try {
            const response = await fetch("http://localhost:5000/getUsers")
            const data = await response.json()
            console.log("data is ", data)
            setUsers(data)
        } catch (error) {
            console.log(error)
        }
    }
    const saveToDB = async () => {
        const obj = {
            name: userName,
            e_mail: userMail,
            pin: userPin,
            role: userRole,
            activeness: isActive,
            phone: userTel,
        }
        console.log("objhect", obj)
        const existingIndex = users.findIndex(u => u.name == userName)
        console.log("existingndex", existingIndex)
        if (existingIndex == -1) {
            try {
                const response = await fetch("http://localhost:5000/saveUser", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(obj)
                })
                console.log(response)
                if (response.ok) {
                    const tempReasons = [...users]
                    tempReasons.push(obj)
                    setUsers(prev => [...prev, obj])
                    setReasonName("");
                    setIsCancel(true);
                    setIsActive(false);
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const deleteUser = async (ui_index, db_index) => {
        try {
            const response = await fetch("http://localhost:5000/deleteUser", {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: db_index
            })
            console.log(response)
            if (response.ok) {
                const tempReasons = [...users]
                tempReasons.splice(ui_index, 1)
                setUsers(tempReasons)
            }
        } catch (error) {
            console.log(error)
        }
    }

    function editUser(index) {
        const reasonToEdit = users[index]
        setEditIndex(index)
        setIsInputBox(true)
        setIsNewUser(false)
        setUserId(reasonToEdit.id)
        setUserName(reasonToEdit.name)
        setUserMail(reasonToEdit.e_mail)
        setUserRole(reasonToEdit.role)
        setUserTel(reasonToEdit.phone)
        setIsActive(reasonToEdit.activeness)
        setUserPin(reasonToEdit.pin)
    }
    return <div className={staticStyles["content-container"]}>
        <div className={styles["append-menu-item"]} >
            <div className={staticStyles["info-box"]}>
                <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                </svg>İndirim tanımlamak için sağ taraftaki butonu kullanabilirsiniz. Yüzdesel veya sabit tutar indirimler tanımlayabilirsiniz.</p>
            </div>
            <div className={staticStyles["save-button"]}>
                <button onClick={() => { setIsInputBox(true); setIsNewDiscount(true) }} >Yeni Ürün</button>
            </div>
        </div>
        <div className={staticStyles["table-banner"]}>
            <div className={staticStyles["title"]}> Sebepler</div>
        </div>

        <div className={styles["reason-container"]}>
            <div style={{ gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr 1fr 1fr .5fr" }} className={staticStyles["table-header-style"]}>
                <p>Kullanıcı Adı</p>
                <p>E-mail</p>
                <p>Pin</p>
                <p>Rol</p>
                <p>Tel No</p>
                <p>Katılma Tarihi</p>
                <p>Durum</p>
                <p>İşlemler</p>
            </div>

            {users.map((user, index) => (
                <div style={{ gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr 1fr 1fr .5fr" }} className={staticStyles["table-item-style"]}>
                    <p> {user.name} </p>
                    <p> {user.e_mail}</p>
                    <p> **** </p>
                    <p> {user.role}</p>
                    <p> {user.phone} </p>
                    <p> {user.join_date} </p>
                    <p style={{ width: "10% !important" }} className={user.activeness == true ? staticStyles["status-active"] : staticStyles["status-passive"]}> {user.activeness == true ? "AKTİF" : "Pasif"} </p>
                    <p style={{ display: "flex" }} > <svg onClick={() => editUser(index)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                    </svg>
                        <svg onClick={() => deleteUser(index, user.id)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </p>
                </div>
            ))}
        </div>
        {isInputBox &&
            <div className={staticStyles["input-container"]}>
                <h1>Kullanıcı Ekle</h1>
                <div className={staticStyles["two-form"]}>

                    <div className={staticStyles["form"]} >
                        <p>Kullanıcı Adı</p>
                        <input value={userName} onChange={(e) => setUserName(e.target.value)} type="text" placeholder="KULLANICI ADI GİRİNİZ" name="" id="MethodName" />
                    </div>
                    <div className={staticStyles["form"]} >
                        <p>PIN</p>
                        <input value={userPin} onChange={(e) => setUserPin(e.target.value)} type="pin" maxlength="4" placeholder='4 BASAMAKLI PIN' />
                    </div>
                </div>

                <div className={staticStyles["two-form"]}>
                    <div className={staticStyles["form"]}  >
                        <p>Email</p>
                        <input value={userMail} onChange={(e) => setUserMail(e.target.value)} type="email" placeholder='E-mail' />
                    </div>
                    <div className={staticStyles["form"]} >
                        <p>Aktiflik</p>
                        <select value={isActive} onChange={(e) => setIsActive(e.target.value)}
                            id="ReasonActiveness" required defaultValue="">
                            <option value={true}>Aktif</option>
                            <option value={false}>Pasif</option>
                        </select>
                    </div>
                </div>

                <div className={staticStyles["two-form"]}>
                    <div className={staticStyles["form"]}  >
                        <p>Telefon Numarası</p>
                        <input value={userTel} onChange={(e) => setUserTel(e.target.value)} type="text" placeholder='Tel No' />
                    </div>
                    <div className={staticStyles["form"]} >
                        <p>Rol</p>
                        <select value={userRole} onChange={(e) => setUserRole(e.target.value)}
                            id="ReasonActiveness" required defaultValue="">
                            <option value={true}>Aktif</option>
                            <option value={false}>Pasif</option>
                        </select>
                    </div>
                </div>
                <div className={staticStyles["action-buttons"]}>
                    <button onClick={() => setIsInputBox(false)} style={{ backgroundColor: "#374151" }}>İptal</button>
                    <button onClick={() => { isNewUser ? saveToDB() : saveEditedUser() }} >Kaydet</button>
                </div>
            </div>
        }
    </div>

}
export default UserSettings