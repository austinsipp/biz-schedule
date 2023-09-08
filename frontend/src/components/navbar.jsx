import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <header>
            <div className="container">
                <Link to='/'>
                    <h1>Home</h1>
                </Link>
                <Link to='/schedule'>
                    <h1>View Schedule</h1>
                </Link>
                <Link to='/ptoRequest'>
                    <h1>PTO Request</h1>
                </Link>
            </div>
        </header>
    )
}

export default Navbar