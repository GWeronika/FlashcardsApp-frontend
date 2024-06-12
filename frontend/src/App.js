import React from 'react';
import Header from "./components/Header";
import Button from "./components/Button";
import LoginForm from "./pages/LoginForm";
import SetsPage from "./pages/SetsPage";
import CreateSetForm from "./pages/CreateSetForm";
import RegisterForm from "./pages/RegisterForm";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            currentPage: "home",
            options: [],
            currentUser: null,
        };
    }

    componentDidMount() {
        this.updateOptions(this.state.currentPage);
        const token = localStorage.getItem('token');
        const currentUser = localStorage.getItem('currentUser');
        if (token && currentUser) {
            this.setState({ isLoggedIn: true, currentUser: JSON.parse(currentUser) });
        }
    }

    handleLogin = (user) => {
        this.setState({ isLoggedIn: true, currentUser: user }, () => {
            this.updateOptions(this.state.currentPage);
        });
    }

    handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.setState({ isLoggedIn: false, currentUser: null }, () => {
            this.updateOptions("home");
            this.handlePageChange("home");
        });
    }

    updateOptions = (page) => {
        let options;
        switch (page) {
            case "home":
                options = [
                    { onClick: () => this.handlePageChange("sets"), icon: "fa-solid fa-book-bookmark", text: "Sets" },
                    { onClick: () => this.handlePageChange("create"), icon: "fa-solid fa-square-plus", text: "Create" },
                    this.state.isLoggedIn ?
                        { onClick: () => this.handlePageChange("account"), icon: "fa-solid fa-circle-user", text: "My Account" } :
                        { onClick: () => this.handlePageChange("login"), icon: "fa-solid fa-user", text: "Log in" },
                    this.state.isLoggedIn && { onClick: this.handleLogout, icon: "fa-solid fa-right-from-bracket", text: "Log out" }
                ].filter(Boolean);
                break;
            case "login":
                options = [
                    { onClick: () => this.handlePageChange("register"), icon: "fa-solid fa-address-card", text: "Register" },
                    { onClick: () => this.handlePageChange("forgot"), icon: "fa-solid fa-key", text: "Recover password" },
                ];
                break;
            case "sets":
                options = [
                    { onClick: () => this.handlePageChange("create"), icon: "fa-solid fa-square-plus", text: "Create" },
                    { onClick: () => this.handlePageChange("account"), icon: "fa-solid fa-circle-user", text: "My Account" },
                    { onClick: this.handleLogout, icon: "fa-solid fa-right-from-bracket", text: "Log out" }
                ];
                break;
            case "create":
                options = [
                    { onClick: () => this.handlePageChange("sets"), icon: "fa-solid fa-book-bookmark", text: "Sets" },
                    { onClick: () => this.handlePageChange("account"), icon: "fa-solid fa-circle-user", text: "My Account" },
                    { onClick: this.handleLogout, icon: "fa-solid fa-right-from-bracket", text: "Log out" }
                ];
                break;
            case "register":
                options = [
                    { onClick: () => this.handlePageChange("login"), icon: "fa-solid fa-user", text: "Log in" },
                    { onClick: () => this.handlePageChange("forgot"), icon: "fa-solid fa-key", text: "Recover password" },
                ]
                break;
            default:
                options = [];
                break;
        }
        this.setState({ options });
    }

    handlePageChange = (page) => {
        this.setState({ currentPage: page });
    }

    render() {
        const { currentPage, options, isLoggedIn, currentUser } = this.state;

        return (
            <div>
                <Header
                    currentPage={currentPage}
                    options={options}
                    onLogoClick={() => this.handlePageChange("home")}
                />
                {currentPage === "home" && (
                    <>
                        <main>
                            <section className="main-image">
                                <h2 className="main-text">For better learning<br/><br/>Create your own flashcards and learn<br/>faster, better and more efficiently.</h2>
                                <img src="/main.png" alt="MainImage"/>
                            </section>
                        </main>
                        <footer>
                            <section>
                                <Button text={<><strong className="bold-text">Register</strong> to discover new possibilities</>} onClick={() => this.handlePageChange("register")} />
                                <Button text={<><strong className="bold-text">Log in</strong> to make progress</>} onClick={() => this.handlePageChange("login")} />
                                <Button text={<><strong className="bold-text">Create a set</strong> to make a difference</>} onClick={() => this.handlePageChange("create")} />
                            </section>
                        </footer>
                    </>
                )}
                {currentPage === "login" && ( <LoginForm onClose={() => this.handlePageChange("sets")} onLogin={this.handleLogin} /> )}
                {currentPage === "sets" && ( <SetsPage isLoggedIn={isLoggedIn} currentUser={currentUser} /> )}
                {currentPage === "create" && ( <CreateSetForm /> )}
                {currentPage === "register" && ( <RegisterForm onClose={() => this.handlePageChange("login")} /> )}
            </div>
        );
    }
}

export default App;
