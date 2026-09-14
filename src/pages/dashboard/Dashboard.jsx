import PrivateNavbar from "../../components/navbar/PrivateNavbar";
import Sidebar from "../../components/sidebar/Sidebar";

import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">

      <PrivateNavbar />

      <div className="dashboard-body">

        <Sidebar />

        <main className="dashboard-content">
          <h1>Tableau de bord</h1>
          <p>Bienvenue dans votre espace ServiCasa.</p>
        </main>

      </div>

    </div>
  );
};

export default Dashboard;