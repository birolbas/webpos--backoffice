import staticStyles from "../main/StaticStyle.module.css";
import styles from "./TableLayout.module.css";
import { use, useEffect, useState } from "react";
function TableLayout() {
    const [totalTables, setTotalTables] = useState([]);
    const [isNewTable, setIsNewTable] = useState(false);
    const [newTableCol, setNewTableCol] = useState(0);
    const [newTableRow, setNewTableRow] = useState(0);
    const [row, setRow] = useState(5);
    const [col, setCol] = useState(5);
    const [matrix, setMatrix] = useState(25);
    const [layout, setLayout] = useState([]);
    const [isFloor, setIsFloor] = useState(false);
    const [floors, setFloors] = useState([
        {
            Name: "İlk Kat",
            gridRow: 5,
            gridCol: 5,
            tables: [],
        },
    ]);
    const [floorData, setFloorData] = useState(floors[0]);

    const saveToDb = async () => {
        try {
            const response = await fetch("http://localhost:5000/table_grid_save", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(floors),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("ok", data);
            } else {
                console.log("error ac", response.statusText);
            }
        } catch (error) {
            console.log("error happened", error);
        }
    }

    const getDataFromDB = async () =>{
        try{
            const response = await fetch("http://localhost:5000/getTableData")
            if(response.ok){
                const data = await response.json()
                console.log(data[0])
                const tempFloors = []
                data[0].forEach((floor, index)=>{
                    tempFloors.push(floor[0])
                })
                setFloors(tempFloors)
                setFloorData(tempFloors[0])
            }
        } catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        getDataFromDB()
    },[])
    useEffect(()=>{
        console.log(floors)
    },[floors])
    function changeMatrix() {
        setFloorData((prev) => ({
            ...prev,
            tables: [...prev.tables, []],
        }));
        const index = floors.findIndex(f=>f.Name == floorData.Name)
        const tempFloors = [...floors]
        tempFloors[index].tables = []
        setFloors(tempFloors)
        const gridCol = document.getElementById("grid-col").value;
        const gridRow = document.getElementById("grid-row").value;
        console.log(gridCol, gridRow);
        setCol(gridCol);
        setRow(gridRow);
        const gridLay = document.getElementsByClassName(styles["grid-layout"])[0];
        gridLay.style.gridTemplateColumns = `repeat(${gridCol},1fr)`;
        gridLay.style.gridTemplateRows = `repeat(${gridRow},1fr)`;
        console.log(gridLay);
        changeGridLayout(gridCol, gridRow);
    }

    function changeFloor(floorName) {
        const index = floors.findIndex((f) => f.Name == floorName);
        console.log("floors total", floors, "chosed floor", floors[index]);
        setFloorData(floors[index]);
        setCol(floors[index].gridCol);
        setRow(floors[index].gridRow);
        changeGridLayout(floors[index].gridCol, floors[index].gridRow);
        console.log(floors);
    }
    function newFloorInputBox() {
        document.getElementById("NewFloorInput").style.display = "flex";
    }
    function newFloorInputBoxClose() {
        document.getElementById("NewFloorInput").style.display = "none";
    }

    function newTableAppendToGrid(gridColumnStart, gridRowStart) {
        setNewTableCol(gridColumnStart);
        setNewTableRow(gridRowStart);
        document.getElementById("NewTableInput").style.display = "flex";
    }
    function closeInputBox() {
        document.getElementsByClassName(
            staticStyles["input-container"]
        )[0].style.display = "none";
    }
    function saveNewTable() {
        const tableName = document.getElementById("TableName").value;
        const newTable = {
            tableName: tableName,
            tableGridCol: newTableCol,
            tableGridRow: newTableRow,
        };
        const tempFloorData = floorData
        tempFloorData.tables.push(newTable)
        setFloorData(tempFloorData)

        const tempFloors = [...floors]
        const index = tempFloors.findIndex(f=>f.Name == floorData.Name)
        tempFloors[index].tables.push(newTable)
        setFloors(tempFloors)

        closeInputBox();
    }
    function saveNewFloor() {
        const floorName = document.getElementById("FloorName").value;
        console.log(floorName);
        const newFloor = {
            Name: floorName,
            gridCol: 4,
            gridRow: 4,
            tables: [],
        };
        setFloors((prev) => [...prev, newFloor]);
        console.log("floorsare", floors);
    }
    useEffect(() => {
        setMatrix(row * col);
        const gridLay = document.getElementsByClassName(styles["grid-layout"])[0];
        gridLay.style.gridTemplateColumns = `repeat(${col},1fr)`;
        gridLay.style.gridTemplateRows = `repeat(${row},1fr)`;
        floorData.gridCol = col;
        floorData.gridRow = row;
    }, [row, col]);

    function changeGridLayout(col, row) {
        setLayout();
        const tablesArray = Array.isArray(floorData?.tables)
            ? floorData.tables
            : Object.values(floorData?.tables || {});

        const buttons = [];

        for (let i = 1; i <= col; i++) {
            for (let j = 1; j <= row; j++) {
                const table = tablesArray.find(
                    (table) => table.tableGridCol === i && table.tableGridRow === j
                );

                const item = (
                    <>
                        <div
                            onClick={() => newTableAppendToGrid(i, j)}
                            className={styles["grid-items"]}
                            style={{ gridColumnStart: i, gridRowStart: j }}
                        >
                            <div className={styles["buttons-container"]}>
                                <div className={styles["plus-button"]}>
                                    <button
                                        className=""
                                        style={{ backgroundColor: table ? "#4361ee" : "" }}
                                    >
                                        {table ? table.tableName : "+"}
                                    </button>
                                </div>
                                <div
                                    className={styles["trash-button"]}
                                    style={{ display: table ? "flex" : "none" }}
                                >
                                    <button onClick={(e) => deleteTable(e, table)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                );

                buttons.push(item);
            }
        }

        setLayout(buttons);
    }

    function deleteTable(e) {
        const trashButton = e.target.closest(`.${styles["trash-button"]}`);
        let plusButton = trashButton.parentElement;
        plusButton = plusButton.querySelector("button");
        const tableName = plusButton.innerHTML;
        const floorName = floorData.Name;

        const updatedFloors = floors.map((floor) => {
            if (floor.Name === floorName) {
                const newTables = floor.tables.filter(
                    (table) => table.tableName !== tableName
                );
                return { ...floor, tables: newTables };
            }
            return floor;
        });

        setFloors(updatedFloors);
        setPlaceableTables([...placeableTables, tableName]);
        const updatedFloorData = updatedFloors.find(
            (f) => f.Name === floorData.Name
        );
        setFloorData(updatedFloorData);
        changeGridLayout(col, row);
    }

    useEffect(() => {
        const current = floors.find((f) => f.Name === floorData.Name);
        if (current) {
            setFloorData(current);
        }
        changeGridLayout(col, row);
    }, [floors]);

    function floorOptions() {
        document.getElementsByClassName(
            styles["choose-create-floor"]
        )[0].style.display = "flex";
    }

    //to update the layout after adding new table
    useEffect(() => {
        if (floorData) {
            changeGridLayout(col, row);
        }
    }, [floorData?.tables, matrix]);

    return (
        <>
            <div className={staticStyles["content-container"]}>
                <div className={styles["content-container"]}>
                    <div className={staticStyles["save-div"]}>
                        <div className={staticStyles["table-banner"]}>
                            <div className={staticStyles["title"]}>Masa Düzeni</div>
                        </div>
                        <div className={staticStyles["info-box"]}>
                            <p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-info-circle"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                </svg>
                                Ödeme yöntemlerini yönetin ve komisyon oranlarını belirleyin.
                                Yeni ödeme yöntemi eklemek için yeşil butona basın. Mevcut
                                yöntemleri düzenlemek veya silmek için kart üzerindeki düğmeleri
                                kullanın.
                            </p>
                        </div>
                            <div className={staticStyles["save-button"]}>
                                <button onClick={()=>saveToDb()} >Değişiklikleri Kaydet</button>
                            </div>
                    </div>

                    <div>
                        <div className={styles["table-options"]}>
                            <div className={styles["table-grid-options-container"]}>
                                <div className={styles["grid-layout-floor-options"]}>
                                    <div className={styles["floor-options-save"]}>
                                        <div className={styles["grid-options"]}>
                                            <span> {floorData.Name}: </span>
                                            <input
                                                id="grid-col"
                                                className={styles["grid-col"]}
                                                type="text"
                                                placeholder="5"
                                            />
                                            <span>x</span>
                                            <input
                                                id="grid-row"
                                                className={styles["grid-row"]}
                                                type="text"
                                                placeholder="5"
                                            />
                                        </div>
                                        <div className={styles["save-layouts"]}>
                                            <button onClick={() => changeMatrix()}>Kaydet</button>
                                        </div>
                                    </div>
                                    <div className={styles["floor-options"]}>
                                        <div className={styles["choosed-floor"]}>
                                            <button id="choosed-floor" onClick={() => floorOptions()}>
                                                {floors[0].Name}
                                            </button>
                                            <div className={styles["choose-create-floor"]}>
                                                <div className={styles["floor-choose-input"]}>
                                                    <h1>Kat Seçiniz.</h1>
                                                    <div className={styles["floors-container"]}>
                                                        {floors.map((floor, index) => (
                                                            <div key={index}>
                                                                <div className={styles["floors"]}>
                                                                    <div className={styles["floor-name"]}>
                                                                        <button
                                                                            onClick={() => changeFloor(floor.Name)}
                                                                            id="choose-floor"
                                                                        >
                                                                            {floor.Name}
                                                                        </button>
                                                                    </div>
                                                                    <div className={styles["delete-floor"]}>
                                                                        <button>
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="16"
                                                                                height="16"
                                                                                fill="currentColor"
                                                                                class="bi bi-trash"
                                                                                viewBox="0 0 16 16"
                                                                            >
                                                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                                            </svg>{" "}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles["new-floor"]}>
                                            <button onClick={() => newFloorInputBox()} id="new-floor">
                                                Yeni Kat{" "}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div id="grid-layout" className={styles["grid-layout"]}>
                                    {layout}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="NewTableInput" className={staticStyles["input-container"]}>
                <p>Masa Ekle</p>
                <input type="text" placeholder="MASA ADI" name="" id="TableName" />
                <div className={staticStyles["action-buttons"]}>
                    <button
                        onClick={() => closeInputBox()}
                        style={{ backgroundColor: "#374151" }}
                    >
                        İptal
                    </button>
                    <button onClick={() => saveNewTable(newTableCol, newTableRow)}>
                        Kaydet
                    </button>
                </div>
            </div>
            <div id="NewFloorInput" className={staticStyles["input-container"]}>
                <p>Kat Ekle</p>
                <input type="text" placeholder="Kat Adı" name="" id="FloorName" />
                <div className={staticStyles["action-buttons"]}>
                    <button
                        onClick={() => newFloorInputBoxClose()}
                        style={{ backgroundColor: "#374151" }}
                    >
                        İptal
                    </button>
                    <button onClick={() => saveNewFloor()}>Kaydet</button>
                </div>
            </div>
        </>
    );
}
export default TableLayout;
