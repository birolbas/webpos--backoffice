import LeftBar from "./LeftBar/LeftBar";
import { Outlet } from "react-router-dom";
import styles from './main/StaticStyle.module.css';

export default function Layout() {
  return (
    <div style={{ display: "flex" }}>
      <LeftBar />
        <Outlet /> 
    </div>
  );
}
