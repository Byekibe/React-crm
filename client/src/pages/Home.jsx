import Header from "../components/Header";
import AddClientModal from "../components/AddClientModal";
import Projects from "../components/Projects";
import Client from "../components/Client";

const Home = () => {
    return (
        <>
            <Header />
            <div className="d-flex gap-3 mb-4">
                <div className='container'>
                    <AddClientModal />
                    <Projects />
                    <Client />
                </div>
            </div>
        </>
    )
};

export default Home;