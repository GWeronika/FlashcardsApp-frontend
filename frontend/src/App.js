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
            currentPage: "home",
            options: [],
        };
    }

    updateOptions = (page) => {
        let options;
        switch (page) {
            case "home":
                options = [
                    { onClick: () => this.handlePageChange("sets"), icon: "fa-solid fa-book-bookmark", text: "Sets" },
                    { onClick: () => this.handlePageChange("create"), icon: "fa-solid fa-square-plus", text: "Create" },
                    { onClick: () => this.handlePageChange("login"), icon: "fa-solid fa-user", text: "Log in" },
                ];
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
                ]
                break;
            case "create":
                options = [
                    { onClick: () => this.handlePageChange("sets"), icon: "fa-solid fa-book-bookmark", text: "Sets" },
                    { onClick: () => this.handlePageChange("account"), icon: "fa-solid fa-circle-user", text: "My Account" },
                ]
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

    componentDidMount() {
        this.updateOptions(this.state.currentPage);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentPage !== this.state.currentPage) {
            this.updateOptions(this.state.currentPage);
        }
    }

    handlePageChange = (page) => {
        console.log('Page changed to:', page);
        this.setState({ currentPage: page });
    }

    render() {
        const { currentPage, options } = this.state;

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
                {currentPage === "login" && ( <LoginForm onClose={() => this.handlePageChange("sets")} /> )}
                {currentPage === "sets" && ( <SetsPage /> )}
                {currentPage === "create" && ( <CreateSetForm /> )}
                {currentPage === "register" && ( <RegisterForm onClose={() => this.handlePageChange("login")} /> )}
            </div>
        );
    }
}

export default App;
