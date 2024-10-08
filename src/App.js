import React from 'react';
import Header from "./components/Header";
import Button from "./components/Button";
import LoginForm from "./pages/LoginForm";
import SetsPage from "./pages/SetsPage";
import CreateSetForm from "./pages/CreateSetForm";
import RegisterForm from "./pages/RegisterForm";
import AccountPage from './pages/AccountPage';
import OptionsSetPage from "./pages/OptionsSetPage";
import FlashcardPage from "./pages/learning-modes/FlashcardPage";
import WritePage from "./pages/learning-modes/WritePage";
import TestPage from './pages/learning-modes/TestPage';
import EditSetPage from "./pages/edit-set/EditSetPage";
import ResetPasswordForm from "./pages/password-reset/ResetPasswordForm";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            currentPage: "home",
            options: [],
            currentUser: null,
            selectedSet: null,
            editingSet: null
        };
    }

    componentDidMount() {
        const currentUser = localStorage.getItem('currentUser');
        let savedPage = localStorage.getItem('currentPage');

        if (savedPage === "options" || savedPage === "flashcards" || savedPage === "write" || savedPage === "test") {
            savedPage = "sets";
        }

        if (currentUser) {
            this.setState({
                isLoggedIn: true,
                currentUser: JSON.parse(currentUser),
                currentPage: savedPage || "home"
            });
        } else {
            this.setState({
                currentPage: savedPage || "home"
            });
        }
        this.updateOptions(savedPage || "home");
    }

    handleLogin = (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.setState(() => ({
            isLoggedIn: true,
            currentUser: user
        }), () => {
            this.updateOptions(this.state.currentPage);
        });
    }

    handleLogout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentPage');

        this.setState({ isLoggedIn: false, currentUser: null, currentPage: "home" }, () => {
            this.updateOptions("home");
            this.handlePageChange("home");
        });
    }

    updateOptions = (page) => {
        const baseOptions = [
            { onClick: () => this.handlePageChange("sets"), icon: "fa-solid fa-book-bookmark", text: "Sets" },
            { onClick: () => this.handlePageChange("create"), icon: "fa-solid fa-square-plus", text: "Create" },
            { onClick: () => this.handlePageChange("account"), icon: "fa-solid fa-circle-user", text: "My Account" },
            { onClick: this.handleLogout, icon: "fa-solid fa-right-from-bracket", text: "Log out" }
        ];

        const guestOptions = [
            { onClick: () => this.handlePageChange("login"), icon: "fa-solid fa-user", text: "Log in" }
        ];

        let options;

        switch (page) {
            case "home":
                options = this.state.isLoggedIn ? baseOptions : [...baseOptions.slice(0, 2), ...guestOptions];
                break;
            case "login":
                options = [
                    { onClick: () => this.handlePageChange("register"), icon: "fa-solid fa-address-card", text: "Register" },
                    { onClick: () => this.handlePageChange("forgot"), icon: "fa-solid fa-key", text: "Recover password" }                ];
                break;
            case "sets":
            case "create":
            case "account":
            case "flashcards":
            case "write":
            case "test":
            case "options":
            case "edit":
                options = baseOptions;
                break;
            case "register":
                options = [
                    { onClick: () => this.handlePageChange("login"), icon: "fa-solid fa-user", text: "Log in" },
                    { onClick: () => this.handlePageChange("forgot"), icon: "fa-solid fa-key", text: "Recover password" }
                ];
                break;
            default:
                options = [];
                break;
        }
        this.setState({ options });
    }

    handlePageChange = (page, extraParams = {}) => {
        localStorage.setItem('currentPage', page);

        this.setState({ currentPage: page, ...extraParams }, () => {
            this.updateOptions(page);
        });
    }

    render() {
        const { currentPage, options, isLoggedIn, currentUser, selectedSet, editingSet } = this.state;

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
                                {isLoggedIn ? (
                                    <>
                                        <Button text={<><strong className="bold-text">Browse sets</strong> to find something for you</>} onClick={() => this.handlePageChange("sets")} />
                                        <Button text={<><strong className="bold-text">Create a set</strong> to go all the way</>} onClick={() => this.handlePageChange("create")} />
                                        <Button text={<><strong className="bold-text">Check an account</strong> to stay up to date</>} onClick={() => this.handlePageChange("account")} />
                                    </>
                                ) : (
                                    <>
                                        <Button text={<><strong className="bold-text">Register</strong> to discover new possibilities</>} onClick={() => this.handlePageChange("register")} />
                                        <Button text={<><strong className="bold-text">Log in</strong> to make progress</>} onClick={() => this.handlePageChange("login")} />
                                        <Button text={<><strong className="bold-text">Create a set</strong> to go all the way</>} onClick={() => this.handlePageChange("create")} />
                                    </>
                                )}
                            </section>
                        </footer>
                    </>
                )}
                {currentPage === "login" && (
                    <LoginForm
                        onClose={() => this.handlePageChange("sets")}
                        onLogin={this.handleLogin}
                        onRegister={() => this.handlePageChange("register")}
                    />
                )}
                {currentPage === "sets" && (
                    <SetsPage
                        isLoggedIn={isLoggedIn}
                        currentUser={currentUser}
                        onSetClick={(set) => this.handlePageChange("options", { selectedSet: set })}
                        onCreateSetClick={() => this.handlePageChange("create")}
                    />
                )}
                {currentPage === "options" && selectedSet && (
                    <OptionsSetPage
                        selectedSet={selectedSet}
                        currentUser={currentUser}
                        onClose={() => this.handlePageChange("sets")}
                        onEditSet={(set) => this.handlePageChange("edit", { editingSet: set })}
                        onFlashcards={() => this.handlePageChange("flashcards", { selectedSet })}
                        onWrite={() => this.handlePageChange("write", { selectedSet })}
                        onTest={() => this.handlePageChange("test", { selectedSet })}
                    />
                )}
                {currentPage === "edit" && editingSet && (
                    <EditSetPage
                        setObject={editingSet}
                        onRedirectToSetsPage={() => this.handlePageChange("sets", { selectedSet: null, editingSet: null })}
                    />
                )}
                {currentPage === "flashcards" && selectedSet && (
                    <FlashcardPage
                        currentUser={currentUser}
                        selectedSet={selectedSet}
                        onBackClick={() => this.handlePageChange("options", { selectedSet })}
                    />
                )}
                {currentPage === "write" && selectedSet && (
                    <WritePage
                        selectedSet={selectedSet}
                        onBackClick={() => this.handlePageChange("options", { selectedSet })}
                    />
                )}
                {currentPage === "test" && selectedSet && (
                    <TestPage
                        selectedSet={selectedSet}
                        onBackClick={() => this.handlePageChange("options", { selectedSet })}
                        onAnotherClick={() => this.handlePageChange("sets")}
                    />
                )}
                {currentPage === "create" && (
                    <CreateSetForm
                        isLoggedIn={isLoggedIn}
                        currentUser={currentUser}
                        onRedirect={() => this.handlePageChange("login")}
                        onRedirectToSetsPage={() => this.handlePageChange("sets")}
                    />
                )}
                {currentPage === "register" && (
                    <RegisterForm
                        onClose={() => this.handlePageChange("login")}
                    />
                )}
                {currentPage === "account" && (
                    <AccountPage
                        user={currentUser}
                        onSetClick={(set) => this.handlePageChange("options", { selectedSet: set })}
                    />
                )}
                {currentPage === "forgot" && (
                    <ResetPasswordForm
                        show={true}
                        handleClose={() => this.handlePageChange("login")}
                    />
                )}
            </div>
        );
    }
}

export default App;
